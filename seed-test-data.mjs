import { drizzle } from "drizzle-orm/mysql2";
import { models, products, modelProducts } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding test data...");

  // Create a test model
  const [model] = await db.insert(models).values({
    name: "Daniely",
    slug: "daniely",
    title: "Conteúdo Exclusivo Premium",
    subtitle: "Fotos e vídeos em alta qualidade, conteúdo inédito",
    description: "Acesse conteúdo exclusivo e premium com fotos profissionais e vídeos em alta definição. Material inédito e personalizado.",
    primaryColor: "#FF1493",
    secondaryColor: "#9400D3",
    accentColor: "#FFD700",
    heroImageUrl: "/assets/hero-video.mp4",
    aboutImageUrl: null,
    isActive: true,
  }).$returningId();

  console.log("✅ Model created:", model);

  // Create test products
  const productData = [
    {
      name: "Pacote Básico",
      description: "Acesso a fotos exclusivas em alta resolução",
      priceInCents: 4900,
      originalPriceInCents: 9900,
      imageUrl: "/assets/package-basic.jpg",
      features: JSON.stringify([
        "50 fotos em alta resolução",
        "5 vídeos exclusivos",
        "Acesso por 30 dias",
        "Download ilimitado",
        "Suporte prioritário"
      ]),
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Pacote Premium",
      description: "Pacote completo com fotos e vídeos premium",
      priceInCents: 9900,
      originalPriceInCents: 19900,
      imageUrl: "/assets/package-premium.jpg",
      features: JSON.stringify([
        "150 fotos em alta resolução",
        "20 vídeos exclusivos",
        "Acesso por 60 dias",
        "Download ilimitado",
        "Conteúdo atualizado",
        "Suporte VIP 24/7"
      ]),
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Pacote VIP Gold",
      description: "Experiência completa VIP com todo conteúdo disponível",
      priceInCents: 14900,
      originalPriceInCents: 29900,
      imageUrl: "/assets/package-vip.jpg",
      features: JSON.stringify([
        "300+ fotos em alta resolução",
        "50+ vídeos exclusivos",
        "Acesso vitalício",
        "Download ilimitado",
        "Conteúdo exclusivo premium",
        "Atualizações mensais",
        "Suporte VIP prioritário",
        "Acesso antecipado"
      ]),
      isFeatured: false,
      isActive: true,
    }
  ];

  for (const [index, productInfo] of productData.entries()) {
    const [product] = await db.insert(products).values(productInfo).$returningId();
    console.log(`✅ Product ${index + 1} created:`, product);

    // Link product to model
    await db.insert(modelProducts).values({
      modelId: model.id,
      productId: product.id,
      displayOrder: index,
    });
    console.log(`✅ Product ${index + 1} linked to model`);
  }

  console.log("🎉 Seeding completed!");
}

seed().catch(console.error).finally(() => process.exit(0));
