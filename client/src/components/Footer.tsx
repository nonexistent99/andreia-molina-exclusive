import { APP_TITLE } from "@/const";
import { Heart, Instagram, Mail, Shield } from "lucide-react";

interface FooterProps {
  modelName?: string;
  instagramUrl?: string;
}

export default function Footer({ modelName, instagramUrl }: FooterProps = {}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gradient-luxury">{modelName || APP_TITLE}</h3>
            <p className="text-muted-foreground">
              Conteúdo exclusivo de alta qualidade para admiradores.
            </p>
            <div className="flex items-center gap-4">
              {instagramUrl && (
                <a 
                  href={instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              <a 
                href="mailto:contato@andreiamolina.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#packages" className="text-muted-foreground hover:text-primary transition-colors">
                  Pacotes
                </a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Reembolso
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
              <Shield className="w-4 h-4" />
              <span>Pagamentos 100% Seguros</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {modelName || APP_TITLE}. Todos os direitos reservados.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Feito com <Heart className="w-4 h-4 text-destructive fill-destructive" /> para você
          </p>
        </div>
      </div>
    </footer>
  );
}
