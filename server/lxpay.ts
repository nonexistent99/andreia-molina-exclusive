import axios from "axios";

const LXPAY_API_URL = "https://api.lxpay.com.br/api/v1/gateway/pix/receive";

interface CreatePixChargeParams {
  amount: number; // Valor em reais (não centavos)
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDocument?: string;
  orderId: string;
  description: string;
  products?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface CreatePixChargeResponse {
  transactionId: string;
  pixCode: string;
  pixQrCode: string;
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
 */
export async function createPixCharge(params: CreatePixChargeParams): Promise<CreatePixChargeResponse> {
  const apiKey = process.env.LXPAY_API_KEY;
  const apiSecret = process.env.LXPAY_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LXPAY_API_KEY ou LXPAY_API_SECRET não configuradas");
  }

  try {
    // Implementação conforme documentação oficial da LXPay
    const response = await axios.post(
      LXPAY_API_URL,
      {
        identifier: params.orderId,
        amount: params.amount,
        client: {
          name: params.customerName,
          email: params.customerEmail,
          phone: params.customerPhone || "",
          document: params.customerDocument || "",
        },
        products: params.products || [],
        metadata: {
          description: params.description,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-public-key": apiKey,
          "x-secret-key": apiSecret,
        },
      }
    );

    return {
      transactionId: response.data.transactionId,
      pixCode: response.data.pix?.copyPaste || "",
      pixQrCode: response.data.pix?.qrCodeBase64 || "",
      expiresAt: response.data.order?.expiresAt || "",
      status: response.data.status,
    };
  } catch (error) {
    console.error("Erro ao criar cobrança Pix:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      console.error("Detalhes do erro LXPay:", error.response?.data);
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
      status: response.data.status,
      paidAt: response.data.paidAt,
    };
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
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
  // Ajustar conforme estrutura real do webhook da Lxpay
  return {
    transactionId: payload.transactionId || payload.transaction_id || payload.id,
    status: payload.status,
    paidAt: payload.paidAt ? new Date(payload.paidAt) : undefined,
  };
}
