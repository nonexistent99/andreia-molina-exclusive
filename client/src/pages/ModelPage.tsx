import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Packages from "@/components/Packages";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface Model {
  id: number;
  name: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroImageUrl: string | null;
  aboutImageUrl: string | null;
  instagramUrl: string | null;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  priceInCents: number;
  originalPriceInCents: number | null;
  imageUrl: string | null;
  features: string;
  isFeatured: boolean;
}

export default function ModelPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [model, setModel] = useState<Model | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModelData();
  }, [params.slug]);

  const loadModelData = async () => {
    try {
      // Load model data
      const modelResponse = await fetch(`/api/models/${params.slug}`);
      
      if (!modelResponse.ok) {
        toast.error("Modelo não encontrada");
        setLocation("/");
        return;
      }

      const modelData = await modelResponse.json();
      
      if (!modelData.isActive) {
        toast.error("Esta modelo não está disponível");
        setLocation("/");
        return;
      }

      setModel(modelData);

      // Load products for this model
      const productsResponse = await fetch(`/api/models/${params.slug}/products`);
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }

    } catch (error) {
      console.error("Error loading model:", error);
      toast.error("Erro ao carregar modelo");
      setLocation("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!model) {
    return null;
  }

  // Detect if heroImageUrl is a video (ends with .mp4, .webm, etc.)
  const isHeroVideo = model.heroImageUrl?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div 
      className="min-h-screen"
      style={{
        '--color-primary': model.primaryColor,
        '--color-secondary': model.secondaryColor,
        '--color-accent': model.accentColor,
      } as React.CSSProperties}
    >
      <Header modelName={model.name} />
      <main id="hero">
        <Hero 
          modelName={model.name}
          title={model.title}
          subtitle={model.subtitle || undefined}
          heroImageUrl={model.heroImageUrl}
          isVideo={!!isHeroVideo}
        />
        <About 
          description={model.description}
          aboutImageUrl={model.aboutImageUrl}
        />
        <Packages 
          products={products}
          isLoading={false}
        />
        <FAQ />
      </main>
      <Footer modelName={model.name} instagramUrl={model.instagramUrl || undefined} />
    </div>
  );
}
