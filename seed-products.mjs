import { drizzle } from 'drizzle-orm/mysql2';
import { products } from './drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

async function seedProducts() {
  try {
    console.log('Seeding products...');
    
    const productsData = [
      {
        name: "Pacote Básico",
        description: "Perfeito para começar sua coleção exclusiva",
        priceInCents: 4900,
        originalPriceInCents: 9900,
        imageUrl: "/assets/package-premium.jpg",
        features: JSON.stringify([
          "50 fotos em alta resolução",
          "5 vídeos exclusivos",
          "Acesso por 30 dias",
          "Download ilimitado"
        ]),
        isFeatured: false,
        isActive: true,
        downloadUrl: null,
        fileKey: null,
      },
      {
        name: "Pacote Premium",
        description: "O mais escolhido! Conteúdo completo e exclusivo",
        priceInCents: 9900,
        originalPriceInCents: 19900,
        imageUrl: "/assets/vip-gold.jpg",
        features: JSON.stringify([
          "150 fotos em alta resolução",
          "20 vídeos exclusivos",
          "Conteúdo bônus especial",
          "Acesso vitalício",
          "Download ilimitado",
          "Atualizações mensais"
        ]),
        isFeatured: true,
        isActive: true,
        downloadUrl: null,
        fileKey: null,
      },
      {
        name: "Pacote VIP Gold",
        description: "Experiência completa com todo o conteúdo disponível",
        priceInCents: 14900,
        originalPriceInCents: 29900,
        imageUrl: "/assets/vip-gold.jpg",
        features: JSON.stringify([
          "300+ fotos em alta resolução",
          "50+ vídeos exclusivos",
          "Todo conteúdo bônus",
          "Acesso vitalício premium",
          "Download ilimitado",
          "Atualizações semanais",
          "Conteúdo personalizado",
          "Suporte prioritário"
        ]),
        isFeatured: false,
        isActive: true,
        downloadUrl: null,
        fileKey: null,
      }
    ];
    
    for (const product of productsData) {
      await db.insert(products).values(product);
      console.log(`✓ Inserted: ${product.name}`);
    }
    
    console.log('\n✓ Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
