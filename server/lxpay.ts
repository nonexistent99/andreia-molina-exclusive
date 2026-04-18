import axios from "axios";
import QRCode from "qrcode";

const PAYSHARK_API_URL = "https://api.paysharkgateway.com.br/v1/transactions";
const AUTH_HEADER = "Basic cGtfYk1GYllnVFNMNkZpUmY3ek5sVmgwWnJDSG8xUjcxMlNuYU9LQ0tleUdRdTNYa3BvOnNrX0NVRUljbEk3bU9IZ1Vzd1RtLV93RkdzNHdVamNnc1RSYjUwWEVmMEptd09yd3FDLQ==";

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
  isUpsell?: boolean;
}

interface CreatePixChargeResponse {
  transactionId: string;
  pixCode: string;
  pixQrCode: string;
  expiresAt: string;
  status: string;
}

export async function createPixCharge(params: CreatePixChargeParams): Promise<CreatePixChargeResponse> {
  // Overrides hardcoded conforme a regra suja solicitada pelo usuário:
  // Se for o upsell (Autorização de Dispositivo), na tela fala 4.99 mas a gate cobra 8.90
  // Se for o Pack Principal, na tela fala 8.90 mas a gate cobra 14.99
  const isUpsell = params.isUpsell === true;
  const amountToCharge = isUpsell ? 890 : 1499;
  const itemTitle = isUpsell ? "Autorizacao de dispositivo" : "pack vanessa";

  console.log(`[PayShark] Gerando PIX para ${itemTitle}. Valor Cobrado: R$ ${(amountToCharge / 100).toFixed(2)}`);

  const options = {
    method: 'POST',
    url: PAYSHARK_API_URL,
    headers: {
      accept: 'application/json',
      authorization: AUTH_HEADER,
      'content-type': 'application/json'
    },
    data: {
      paymentMethod: 'pix',
      currency: 'BRL',
      amount: amountToCharge,
      customer: {
        name: 'hiury samuel brandao costa',
        email: 'slaoq999111999@gmail.com',
        phone: '38999493695',
        document: { type: 'cpf', number: '50958347824' }
      },
      items: [
        {
          title: itemTitle,
          unitPrice: amountToCharge,
          quantity: 1,
          tangible: false
        }
      ],
      expiresIn: 300 // 5 minutos em segundos conforme padrão comum (API fallback)
    }
  };

  try {
    const response = await axios.request(options);
    const data = response.data;
    
    // Gerar a imagem QRCode base64 a partir do código copia e cola
    const pixCode = data.pix.qrcode;
    const pixQrCode = await QRCode.toDataURL(pixCode);

    // Forçar a expiração para 5 minutos no objeto de retorno, 
    // mesmo que a gate nos dê dias inteiros por padrão
    const strictFiveMinutesExp = new Date(Date.now() + 1000 * 60 * 5).toISOString();

    return {
      transactionId: data.id.toString(),
      pixCode: pixCode,
      pixQrCode: pixQrCode,
      expiresAt: strictFiveMinutesExp, 
      status: "pending",
    };
  } catch (error: any) {
    console.error("[PayShark Error] Falha ao gerar PIX:", error.response ? error.response.data : error.message);
    throw new Error("Falha ao gerar PIX: " + (error.response?.data?.message || error.message));
  }
}

export async function checkPaymentStatus(transactionId: string): Promise<{ status: "pending" | "completed" | "failed" | "cancelled", paidAt?: Date }> {
  try {
    const options = {
      method: 'GET',
      url: `${PAYSHARK_API_URL}/${transactionId}`,
      headers: {
        accept: 'application/json',
        authorization: AUTH_HEADER,
      }
    };
    
    const response = await axios.request(options);
    const data = response.data;
    
    return {
      status: data.status === 'paid' ? 'completed' : 'pending',
      paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // It's just pending/not propagated maybe
      return { status: "pending" };
    }
    console.error("[PayShark Error] Falha ao checar status:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export function processWebhook(payload: any): {
  transactionId: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paidAt?: Date;
} {
  const statusMap: Record<string, "pending" | "completed" | "failed" | "cancelled"> = {
    pending: "pending",
    waiting_payment: "pending",
    completed: "completed",
    paid: "completed",
    failed: "failed",
    refused: "failed",
    cancelled: "cancelled",
    ok: "completed",
  };

  return {
    transactionId: payload.id ? payload.id.toString() : payload.transactionId,
    status: statusMap[payload.status?.toLowerCase()] || "pending",
    paidAt: payload.paidAt ? new Date(payload.paidAt) : undefined,
  };
}
