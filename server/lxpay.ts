import axios from "axios";
import QRCode from "qrcode";

const LXPAY_API_URL = "https://api.lxpay.com.br/api/v1/gateway/pix/receive";

interface CreatePixChargeParams {
  amount: number;
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
  pixQrCode: string;
  expiresAt: string;
  status: string;
}

export async function createPixCharge(params: CreatePixChargeParams): Promise<CreatePixChargeResponse> {
  const apiKey = process.env.LXPAY_API_KEY;
  const apiSecret = process.env.LXPAY_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LXPAY_API_KEY ou LXPAY_API_SECRET não configuradas");
  }

  try {
    // Construir payload conforme documentação da Lxpay
    const payload = {
      amount: Math.round(params.amount) / 100, // Converter centavos para reais
      client: {
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone || "",
        document: params.customerDocument || "",
      },
      identifier: params.orderId,
      ...(params.description && { description: params.description }),
      ...(params.callbackUrl && { callbackUrl: params.callbackUrl }),
    };

    console.log("[Lxpay] Enviando requisição para criar PIX:", {
      orderId: params.orderId,
      amount: params.amount,
      url: LXPAY_API_URL,
    });

    const response = await axios.post(LXPAY_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-public-key": apiKey,
        "x-secret-key": apiSecret,
      },
      timeout: 10000,
    });

    console.log("[Lxpay] Resposta recebida com sucesso:", {
      transactionId: response.data.transactionId,
      status: response.data.status,
    });

    const transactionId = response.data.transactionId;
    const status = response.data.status;
    const pixData = response.data.pix;

    if (!pixData) {
      console.error("[Lxpay] Resposta sem dados PIX:", response.data);
      throw new Error("Resposta da Lxpay não contém dados PIX");
    }

    // Tentar extrair o código PIX de diferentes campos possíveis
    const pixCode = pixData.code || pixData.copyPaste || pixData.qrCode || "";

    if (!pixCode) {
      console.error("[Lxpay] Nenhum código PIX encontrado em:", pixData);
      throw new Error("Código PIX não encontrado na resposta da Lxpay");
    }

    console.log("[Lxpay] Código PIX obtido, gerando QR code...");

    // Gerar QR code em base64
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

    const expiresAt = pixData.expiresAt || "";

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
      const statusCode = error.response?.status;

      console.error("[Lxpay] Status HTTP:", statusCode);
      console.error("[Lxpay] Dados de erro:", errorData);

      if (statusCode === 401) {
        throw new Error("Erro Lxpay: Autenticação falhou. Verifique suas credenciais (public-key e secret-key).");
      } else if (statusCode === 400) {
        throw new Error(`Erro Lxpay: Requisição inválida. ${errorMessage}`);
      } else if (statusCode === 500) {
        throw new Error(`Erro Lxpay: Erro interno do servidor. ${errorMessage}`);
      } else {
        throw new Error(`Erro Lxpay (${statusCode}): ${errorMessage}`);
      }
    }

    throw new Error(`Erro ao criar cobrança PIX: ${error instanceof Error ? error.message : String(error)}`);
  }
}

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
}
