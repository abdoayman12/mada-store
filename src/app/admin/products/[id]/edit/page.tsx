"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  if (!product) return notFound();
  return <ProductForm product={product} />;
}
