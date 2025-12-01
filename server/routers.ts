import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";
import * as lxpay from "./lxpay";
import * as brevo from "./brevo";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),

    getOrderBump: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductOrderBump(input.productId);
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(z.object({
        productId: z.number(),
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        customerDocument: z.string().min(11),
        orderBumpId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        // Buscar produto
        const product = await db.getProductById(input.productId);
        if (!product) {
          throw new Error("Produto não encontrado");
        }

        // Gerar número do pedido único
        const orderNumber = `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;

        // Criar pedido
        const order = await db.createOrder({
          orderNumber,
          productId: input.productId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone || null,
          customerDocument: input.customerDocument || null,
          amountInCents: product.priceInCents,
          status: "pending",
          paymentMethod: "pix",
        });

        // Enviar email de confirmação
        try {
          const emailTemplate = brevo.getOrderConfirmationEmailTemplate({
            customerName: input.customerName,
            orderNumber: order.orderNumber,
            productName: product.name,
            amount: product.priceInCents,
          });

          const emailResult = await brevo.sendEmail({
            to: {
              email: input.customerEmail,
              name: input.customerName,
            },
            subject: emailTemplate.subject,
            htmlContent: emailTemplate.htmlContent,
            textContent: emailTemplate.textContent,
          });

          await db.createEmailLog({
            orderId: order.id,
            recipientEmail: input.customerEmail,
            emailType: "order_confirmation",
            status: "sent",
            brevoMessageId: emailResult.messageId,
          });
        } catch (error) {
          console.error("Erro ao enviar email de confirmação:", error);
          // Não bloqueia o pedido se o email falhar
        }

        return {
          order,
          product,
        };
      }),

    getByNumber: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        return await db.getOrderByNumber(input.orderNumber);
      }),
  }),
    success: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        const order = await db.getOrderByNumber(input.orderNumber);
        if (!order) throw new Error("Pedido não encontrado");

        const product = await db.getProductById(order.productId);
        if (!product) throw new Error("Produto não encontrado");

        // Busca o link de download do produto principal
        const productDownloadLink = await db.getDownloadLinkByOrderId(order.id, order.productId);

        // Lógica para Order Bump (assumindo que o sistema ainda só suporta 1)
        let orderBumpDownloadLink = null;
        let orderBumpProduct = null;
        if (order.orderBumpId) {
          orderBumpProduct = await db.getProductById(order.orderBumpId);
          orderBumpDownloadLink = await db.getDownloadLinkByOrderId(order.id, order.orderBumpId);
        }

        return {
          productName: product.name,
          productAccessLink: productDownloadLink?.accessLink || null,
          orderBumpName: orderBumpProduct?.name || null,
          orderBumpAccessLink: orderBumpDownloadLink?.accessLink || null,
          hasOrderBump: !!order.orderBumpId,
        };
      }),


  downloads: router({
    validate: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const downloadLink = await db.getDownloadLinkByToken(input.token);
        if (!downloadLink) {
          throw new Error("Link de download não encontrado");
        }

        // Verificar se está ativo
        if (!downloadLink.isActive) {
          throw new Error("Link de download inativo");
        }

        // Verificar expiração
        if (new Date(downloadLink.expiresAt) < new Date()) {
          throw new Error("Link de download expirado");
        }

        // Verificar limite de downloads
        if (downloadLink.downloadCount >= downloadLink.maxDownloads) {
          throw new Error("Limite de downloads atingido");
        }

        const product = await db.getProductById(downloadLink.productId);
        if (!product) {
          throw new Error("Produto não encontrado");
        }

        return {
          ...downloadLink,
          product,
        };
      }),

    download: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const downloadLink = await db.getDownloadLinkByToken(input.token);
        if (!downloadLink) {
          throw new Error("Link de download não encontrado");
        }

        // Verificar validade
        if (!downloadLink.isActive || new Date(downloadLink.expiresAt) < new Date()) {
          throw new Error("Link de download inválido ou expirado");
        }

        if (downloadLink.downloadCount >= downloadLink.maxDownloads) {
          throw new Error("Limite de downloads atingido");
        }

        // Incrementar contador
        await db.incrementDownloadCount(downloadLink.id);

        const product = await db.getProductById(downloadLink.productId);
        if (!product || !product.downloadUrl) {
          throw new Error("Arquivo não disponível");
        }

        return {
          downloadUrl: product.downloadUrl,
        };
      }),
  }),

  payment: router({
    createPixCharge: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .mutation(async ({ input }) => {
        const order = await db.getOrderByNumber(input.orderNumber);
        if (!order) {
          throw new Error("Pedido não encontrado");
        }

        const product = await db.getProductById(order.productId);
        if (!product) {
          throw new Error("Produto não encontrado");
        }

        // Verificar se já existe uma transação para este pedido
        const existingTransaction = await db.getPaymentTransactionByOrderId(order.id);
        if (existingTransaction && existingTransaction.status === "pending") {
          return {
            transactionId: existingTransaction.transactionId,
            pixCode: existingTransaction.pixCode!,
            pixQrCode: existingTransaction.pixQrCode!,
            expiresAt: existingTransaction.expiresAt!,
          };
        }

       const pixCharge = await lxpay.createPixCharge({
         amount: order.amountInCents,  // ✅ CORRETO: Enviar em centavos
         customerName: order.customerName,
         customerEmail: order.customerEmail,
         customerPhone: order.customerPhone || undefined,
         customerDocument: order.customerDocument || undefined,
         orderId: order.orderNumber,
         description: `Compra: ${product.name}`,
      });


        // Salvar transação no banco
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);

        await db.createPaymentTransaction({
          orderId: order.id,
          transactionId: pixCharge.transactionId,
          pixCode: pixCharge.pixCode,
          pixQrCode: pixCharge.pix?.code || pixCharge.pixQrCode || "", 
          status: "pending",
          amountInCents: order.amountInCents,
          expiresAt,
        });

        return {
          transactionId: pixCharge.transactionId,
          pixCode: pixCharge.pixCode,
          pixQrCode: pixCharge.pixQrCode,
          expiresAt,
        };
      }),

    checkStatus: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        const order = await db.getOrderByNumber(input.orderNumber);
        if (!order) {
          throw new Error("Pedido não encontrado");
        }

        const transaction = await db.getPaymentTransactionByOrderId(order.id);
        if (!transaction) {
          return { status: order.status };
        }

        // Verificar status no Lxpay se ainda estiver pendente
        if (transaction.status === "pending") {
          try {
            const paymentStatus = await lxpay.checkPaymentStatus(transaction.transactionId);
            
            if (paymentStatus.status === "completed") {
              await db.updatePaymentTransactionStatus(transaction.id, "completed");
              await db.updateOrderStatus(order.id, "paid", new Date());
              return { status: "paid" };
            }
          } catch (error) {
            console.error("Erro ao verificar status do pagamento:", error);
          }
        }

        return { status: order.status };
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Webhook handler (não exposto via tRPC)
export async function handleLxpayWebhook(payload: any) {
  try {
    const webhookData = lxpay.processWebhook(payload);
    
    // Buscar transação
    const transaction = await db.getPaymentTransactionById(parseInt(webhookData.transactionId));
    if (!transaction) {
      console.error("Transação não encontrada:", webhookData.transactionId);
      return;
    }

    // Atualizar status da transação
    await db.updatePaymentTransactionStatus(
      transaction.id,
      webhookData.status,
      JSON.stringify(payload)
    );

    // Se pagamento foi confirmado
    if (webhookData.status === "completed") {
      const order = await db.getOrderById(transaction.orderId);
      if (!order) return;

      // Atualizar status do pedido
      await db.updateOrderStatus(order.id, "paid", webhookData.paidAt);

      // Gerar link de download
      const downloadToken = nanoid(32);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Expira em 30 dias

      const downloadLink = await db.createDownloadLink({
        orderId: order.id,
        token: downloadToken,
        productId: order.productId,
        expiresAt,
        downloadCount: 0,
        maxDownloads: 3,
        isActive: true,
      });

      const product = await db.getProductById(order.productId);
      if (!product) return;

      // Enviar email com link de download
      const downloadUrl = `${process.env.VITE_APP_URL || 'https://andreiamolina.com'}/download/${downloadToken}`;
      
      const emailTemplate = brevo.getDownloadLinkEmailTemplate({
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        productName: product.name,
        downloadLink: downloadUrl,
        expiresAt: downloadLink.expiresAt,
      });

      try {
        const emailResult = await brevo.sendEmail({
          to: {
            email: order.customerEmail,
            name: order.customerName,
          },
          subject: emailTemplate.subject,
          htmlContent: emailTemplate.htmlContent,
          textContent: emailTemplate.textContent,
        });

        await db.createEmailLog({
          orderId: order.id,
          recipientEmail: order.customerEmail,
          emailType: "download_link",
          status: "sent",
          brevoMessageId: emailResult.messageId,
        });
      } catch (error) {
        console.error("Erro ao enviar email com link de download:", error);
        await db.createEmailLog({
          orderId: order.id,
          recipientEmail: order.customerEmail,
          emailType: "download_link",
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    throw error;
  }
}
