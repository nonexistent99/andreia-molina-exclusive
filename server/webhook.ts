import { Router } from "express";
import { handleLxpayWebhook } from "./routers";

const router = Router();

/**
 * Webhook endpoint para notificações da Lxpay
 * URL para configurar no painel da Lxpay: https://seu-dominio.com/api/webhooks/lxpay
 */
router.post("/lxpay", async (req, res) => {
  try {
    console.log("[Webhook] Received Lxpay webhook:", req.body);
    
    // Validar que o webhook contém os campos esperados
    if (!req.body || !req.body.transactionId) {
      console.warn("[Webhook] Webhook inválido - faltam campos obrigatórios");
      return res.status(400).json({ 
        success: false, 
        error: "Webhook inválido - faltam campos obrigatórios" 
      });
    }
    
    // Processar webhook
    await handleLxpayWebhook(req.body);
    
    // Responder com sucesso
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Webhook] Error processing Lxpay webhook:", error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

export default router;
