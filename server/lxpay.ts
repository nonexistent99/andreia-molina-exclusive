import axios from "axios";
import QRCode from "qrcode";

const LXPAY_API_URL = "https://api.lxpay.com.br/api/v1/gateway/pix/receive";

interface CreatePixChargeParams {
  amount: number; // Valor em centavos (ex: 10000 = R$ 100,00 )
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDocument?: string;
  orderId: string;
  description?: string;
  products?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  callbackUrl?: string;
}

interface CreatePixChargeResponse {
  transactionId: string;
  pixCode: string;
  pixQrCode: string; // Base64 da imagem do QR code
  expiresAt: string;
  status: string;
}

interface CheckPaymentStatusResponse {
  transactionId: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paidAt?: string;
}

/**
 * Cria uma cobrança Pix via Lxpay
 * Documentação: https://lxpay.com.br/docs
 */
export async function createPixCharge(params: CreatePixChargeParams ): Promise<CreatePixChargeResponse> {
  const apiKey = process.env.LXPAY_API_KEY;
  const apiSecret = process.env.LXPAY_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LXPAY_API_KEY ou LXPAY_API_SECRET não configuradas");
  }

  try {
    // Construir payload conforme documentação da Lxpay
    // Campos obrigatórios: amount, client, identifier
    const payload = {
      amount: params.amount / 100, // Converter de centavos para reais (decimal)
      client: {
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone || "",
        document: params.customerDocument || "",
      },
      identifier: params.orderId, // ID único da transação
      ...(params.products && params.products.length > 0 && { products: params.products }),
      ...(params.description && { description: params.description }),
      ...(params.callbackUrl && { callbackUrl: params.callbackUrl }),
    };

    console.log("[Lxpay] Criando cobrança PIX:", {
      orderId: params.orderId,
      amount: params.amount,
    });

    const response = await axios.post(LXPAY_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-public-key": apiKey,
        "x-secret-key": apiSecret,
      },
      timeout: 10000, // 10 segundos de timeout
    });

    console.log("[Lxpay] Resposta recebida:", {
      transactionId: response.data.transactionId,
      status: response.data.status,
      hasPix: !!response.data.pix,
    });

    // Extrair dados da resposta
    const transactionId = response.data.transactionId;
    const status = response.data.status;
    const pixData = response.data.pix;
    const orderData = response.data.order;

    if (!pixData) {
      throw new Error("Resposta da Lxpay não contém dados PIX");
    }

    // O código PIX pode estar em diferentes campos
    const pixCode = pixData.code || pixData.copyPaste || pixData.qrCode || "";

    if (!pixCode) {
      throw new Error("Código PIX não encontrado na resposta da Lxpay");
    }

    // Gerar QR code em base64 a partir do código PIX
    let pixQrCode = "";
    try {
      pixQrCode = await QRCode.toDataURL(pixCode, {
        errorCorrectionLevel: "H",
        type: "image/png",
        width: 300,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      console.log("[Lxpay] QR code gerado com sucesso");
    } catch (qrError) {
      console.error("[Lxpay] Erro ao gerar QR code:", qrError);
      // Continuar mesmo se falhar ao gerar QR code
    }

    // Extrair data de expiração
    const expiresAt = orderData?.expiresAt || pixData.expiresAt || "";

    return {
      transactionId,
      pixCode,
      pixQrCode,
      expiresAt,
      status,
    };
  } catch (error) {
    console.error("[Lxpay] Erro ao criar cobrança PIX:", error);

    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error || error.message;

      console.error("[Lxpay] Status:", error.response?.status);
      console.error("[Lxpay] Dados da resposta:", errorData);

      // Mensagens de erro mais específicas
      if (error.response?.status === 401) {
        throw new Error("Erro Lxpay: Autenticação falhou. Verifique suas credenciais.");
      } else if (error.response?.status === 400) {
        throw new Error(`Erro Lxpay: Requisição inválida. ${errorMessage}`);
      } else if (error.response?.status === 500) {
        throw new Error(`Erro Lxpay: Erro interno do servidor. ${errorMessage}`);
      } else {
        throw new Error(`Erro Lxpay: ${errorMessage}`);
      }
    }

}

/**
 * Verifica o status de um pagamento
 */
export async function checkPaymentStatus(transactionId: string): Promise<CheckPaymentStatusResponse> {
  const apiKey = process.env.LXPAY_API_KEY;
  const apiSecret = process.env.LXPAY_API_SECRET;
  }

  try {
        headers: {
          "x-public-key": apiKey,
          "x-secret-key": apiSecret,
        },
        timeout: 10000,
      }
     );
      pending: "pending",
      completed: "completed",
      ok: "completed",
    };

    return {
      transactionId: response.data.transactionId,
      status: statusMap[status] || "pending",
      paidAt: response.data.paidAt ? new Date(response.data.paidAt) : undefined,
    };
  } catch (error) {
    console.error("[Lxpay] Erro ao verificar status do pagamento:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Erro Lxpay: ${errorMessage}`);
    }
    throw error;
  }
}

/**
 * Processa webhook da Lxpay
 */
export function processWebhook(payload: any): {
  transactionId: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paidAt?: Date;
} {
  const statusMap: Record<string, "pending" | "completed" | "failed" | "cancelled"> = {
    pending: "pending",
    completed: "completed",
    paid: "completed",
    failed: "failed",
    cancelled: "cancelled",
    ok: "completed",
  };

  return {
    transactionId: payload.transactionId,
    status: statusMap[payload.status?.toLowerCase()] || "pending",
    paidAt: payload.paidAt ? new Date(payload.paidAt) : undefined,
  };
}      paid: "completed",
      failed: "failed",
      cancelled: "cancelled",

    const status = response.data.status?.toLowerCase() || "pending";
    const statusMap: Record<string, "pending" | "completed" | "failed" | "cancelled"> = {
    const response = await axios.get(
      `https://api.lxpay.com.br/api/v1/gateway/pix/transaction/${transactionId}`,
      {

  if (!apiKey || !apiSecret) {
    throw new Error("LXPAY_API_KEY ou LXPAY_API_SECRET não configuradas");

