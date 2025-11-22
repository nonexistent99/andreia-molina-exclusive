import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3";

interface SendEmailParams {
  to: {
    email: string;
    name: string;
  };
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface SendEmailResponse {
  messageId: string;
}

/**
 * Envia um email transacional via Brevo
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY não configurada");
  }

  try {
    const response = await axios.post(
      `${BREVO_API_URL}/smtp/email`,
      {
        sender: {
          name: "Andreia Molina Exclusive",
          email: "noreply@andreiamolina.com", // Ajustar para email verificado
        },
        to: [params.to],
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent,
      },
      {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": apiKey,
        },
      }
    );

    return {
      messageId: response.data.messageId,
    };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro Brevo: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Template de email de confirmação de pedido
 */
export function getOrderConfirmationEmailTemplate(data: {
  customerName: string;
  orderNumber: string;
  productName: string;
  amount: number;
}): { subject: string; htmlContent: string; textContent: string } {
  const subject = `Pedido Confirmado - ${data.orderNumber}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pedido Confirmado! 🎉</h1>
        </div>
        <div class="content">
          <p>Olá <strong>${data.customerName}</strong>,</p>
          <p>Seu pedido foi confirmado com sucesso!</p>
          <p><strong>Número do Pedido:</strong> ${data.orderNumber}</p>
          <p><strong>Produto:</strong> ${data.productName}</p>
          <p><strong>Valor:</strong> R$ ${(data.amount / 100).toFixed(2)}</p>
          <p>Aguardando confirmação do pagamento via Pix. Assim que o pagamento for confirmado, você receberá um novo email com o link para download do seu conteúdo exclusivo.</p>
          <p>O link de pagamento expira em 30 minutos.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Andreia Molina Exclusive. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Pedido Confirmado!
    
    Olá ${data.customerName},
    
    Seu pedido foi confirmado com sucesso!
    
    Número do Pedido: ${data.orderNumber}
    Produto: ${data.productName}
    Valor: R$ ${(data.amount / 100).toFixed(2)}
    
    Aguardando confirmação do pagamento via Pix. Assim que o pagamento for confirmado, você receberá um novo email com o link para download do seu conteúdo exclusivo.
    
    © ${new Date().getFullYear()} Andreia Molina Exclusive. Todos os direitos reservados.
  `;

  return { subject, htmlContent, textContent };
}

/**
 * Template de email com link de download
 */
export function getDownloadLinkEmailTemplate(data: {
  customerName: string;
  orderNumber: string;
  productName: string;
  downloadLink: string;
  expiresAt: Date;
}): { subject: string; htmlContent: string; textContent: string } {
  const subject = `Seu Conteúdo Exclusivo Está Pronto! - ${data.orderNumber}`;
  
  const expirationDate = data.expiresAt.toLocaleDateString('pt-BR');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Pagamento Confirmado! ✨</h1>
        </div>
        <div class="content">
          <p>Olá <strong>${data.customerName}</strong>,</p>
          <p>Seu pagamento foi confirmado e seu conteúdo exclusivo está pronto para download!</p>
          <p><strong>Pedido:</strong> ${data.orderNumber}</p>
          <p><strong>Produto:</strong> ${data.productName}</p>
          <div style="text-align: center;">
            <a href="${data.downloadLink}" class="button">BAIXAR CONTEÚDO AGORA</a>
          </div>
          <div class="warning">
            <strong>⚠️ Importante:</strong>
            <ul>
              <li>Este link expira em: <strong>${expirationDate}</strong></li>
              <li>Você pode fazer até 3 downloads</li>
              <li>Salve o conteúdo em um local seguro</li>
              <li>Não compartilhe este link com outras pessoas</li>
            </ul>
          </div>
          <p>Aproveite seu conteúdo exclusivo! 🎉</p>
          <p>Se tiver alguma dúvida, entre em contato conosco.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Andreia Molina Exclusive. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Pagamento Confirmado!
    
    Olá ${data.customerName},
    
    Seu pagamento foi confirmado e seu conteúdo exclusivo está pronto para download!
    
    Pedido: ${data.orderNumber}
    Produto: ${data.productName}
    
    Link para Download:
    ${data.downloadLink}
    
    IMPORTANTE:
    - Este link expira em: ${expirationDate}
    - Você pode fazer até 3 downloads
    - Salve o conteúdo em um local seguro
    - Não compartilhe este link com outras pessoas
    
    Aproveite seu conteúdo exclusivo!
    
    © ${new Date().getFullYear()} Andreia Molina Exclusive. Todos os direitos reservados.
  `;

  return { subject, htmlContent, textContent };
}
