import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function FAQ() {
  const faqs = [
    {
      question: "Como funciona o pagamento?",
      answer: "Aceitamos pagamento via Pix. Após selecionar seu pacote, você receberá um QR Code para pagamento. Assim que o pagamento for confirmado (geralmente instantâneo), você receberá o link de download por email."
    },
    {
      question: "Quando recebo acesso ao conteúdo?",
      answer: "O acesso é imediato! Assim que o pagamento for confirmado, você receberá um email com o link para download do seu pacote. O processo geralmente leva menos de 1 minuto."
    },
    {
      question: "Posso baixar o conteúdo mais de uma vez?",
      answer: "Sim! Dependendo do seu pacote, você terá acesso ilimitado para downloads durante o período de validade. Pacotes Premium e VIP Gold oferecem acesso vitalício."
    },
    {
      question: "O conteúdo é realmente exclusivo?",
      answer: "Sim, 100%! Todo o conteúdo disponível em nossos pacotes é exclusivo e não está disponível em nenhuma outra plataforma. Você terá acesso a material inédito e de alta qualidade."
    },
    {
      question: "Qual a qualidade das fotos e vídeos?",
      answer: "Todas as fotos são em alta resolução (mínimo de 4K) e os vídeos em Full HD ou superior. Todo o conteúdo é produzido com equipamento profissional para garantir a melhor qualidade possível."
    },
    {
      question: "Existe garantia de devolução?",
      answer: "Sim! Oferecemos garantia de 7 dias. Se você não ficar satisfeito com o conteúdo, devolvemos 100% do seu dinheiro, sem perguntas."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Absolutamente! Utilizamos criptografia de ponta a ponta em todas as transações. Seus dados pessoais e de pagamento são protegidos pelos mais altos padrões de segurança."
    },
    {
      question: "Posso compartilhar o conteúdo?",
      answer: "Não. O conteúdo é exclusivo para uso pessoal. O compartilhamento ou distribuição do material é proibido e pode resultar em ações legais."
    },
    {
      question: "Como funciona o suporte?",
      answer: "Nosso suporte está disponível 24/7 via email. Respondemos todas as dúvidas em até 24 horas. Clientes VIP Gold têm suporte prioritário com resposta em até 2 horas."
    },
    {
      question: "Posso fazer upgrade do meu pacote?",
      answer: "Sim! Você pode fazer upgrade a qualquer momento. Entre em contato com nosso suporte e faremos o ajuste, descontando o valor já pago."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent text-accent-foreground border-0">
            Perguntas Frequentes
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tire Suas <span className="text-gradient-luxury">Dúvidas</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre nossos pacotes e serviços.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Não encontrou a resposta que procurava?
          </p>
          <a 
            href="mailto:contato@andreiamolina.com" 
            className="text-primary hover:text-primary/80 font-semibold text-lg underline"
          >
            Entre em contato conosco
          </a>
        </div>
      </div>
    </section>
  );
}
