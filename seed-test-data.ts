import { drizzle } from "drizzle-orm/mysql2";
import { models, products, modelProducts } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Seeding test data...");

  // Create a test model
  const modelResult = await db.insert(models).values({
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
  });

  console.log("✅ Model created");

  // Get the model ID (since we don't have $returningId in this setup)
  const [createdModel] = await db.select().from(models).where({ slug: "daniely" }).limit(1);
  
  if (!createdModel) {
    throw new Error("Failed to create model");
  }

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
    await db.insert(products).values(productInfo);
    console.log(`✅ Product ${index + 1} created`);

    // Get the created product
    const [createdProduct] = await db.select().from(products).where({ name: productInfo.name }).limit(1);
    
    if (createdProduct) {
      // Link product to model
      await db.insert(modelProducts).values({
        modelId: createdModel.id,
        productId: createdProduct.id,
        displayOrder: index,
      });
      console.log(`✅ Product ${index + 1} linked to model`);
    }
  }

  console.log("🎉 Seeding completed!");
}

seed().catch(console.error).finally(() => process.exit(0));
