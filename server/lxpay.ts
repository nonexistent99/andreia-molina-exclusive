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
    const payload = {
      identifier: params.orderId,
      amount: params.amount / 100, // Converter de centavos para reais
      client: {
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone || "",
        document: params.customerDocument || "",
      },
      products: params.products || [],
      description: params.description || "",
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
    });

    console.log("[Lxpay] Resposta recebida:", {
      transactionId: response.data.transactionId,
      status: response.data.status,
    });

    // Gerar QR code em base64 a partir do código PIX
    const pixCode = response.data.pix?.code || response.data.pix?.copyPaste || "";
    let pixQrCode = "";

    if (pixCode) {
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
    }

    return {
      transactionId: response.data.transactionId,
      pixCode: pixCode,
      pixQrCode: pixQrCode,
      expiresAt: response.data.order?.expiresAt || "",
      status: response.data.status,
    };
  } catch (error) {
    console.error("[Lxpay] Erro ao criar cobrança PIX:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      console.error("[Lxpay] Detalhes do erro:", error.response?.data);
      throw new Error(`Erro Lxpay: ${errorMessage}`);
    }
    throw error;
  }
}

/**
 * Verifica o status de um pagamento
 */
export async function checkPaymentStatus(transactionId: string): Promise<CheckPaymentStatusResponse> {
  const apiKey = process.env.LXPAY_API_KEY;
  const apiSecret = process.env.LXPAY_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LXPAY_API_KEY ou LXPAY_API_SECRET não configuradas");
  }

  try {
    const response = await axios.get(
      `https://api.lxpay.com.br/api/v1/gateway/pix/transaction/${transactionId}`,
      {
        headers: {
          "x-public-key": apiKey,
          "x-secret-key": apiSecret,
        },
      }
     );

    return {
      transactionId: response.data.transactionId,
      status: response.data.status?.toLowerCase() || "pending",
      paidAt: response.data.paidAt,
    };
  } catch (error) {
    console.error("[Lxpay] Erro ao verificar status do pagamento:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro Lxpay: ${error.response?.data?.message || error.message}`);
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
    failed: "failed",
    cancelled: "cancelled",
    OK: "completed",
  };

  return {
    transactionId: payload.transactionId,
    status: statusMap[payload.status] || "pending",
    paidAt: payload.paidAt ? new Date(payload.paidAt) : undefined,
  };
}
