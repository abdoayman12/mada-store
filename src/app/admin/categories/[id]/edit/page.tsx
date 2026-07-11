"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { getAdminCategoryById } from "@/lib/adminData";
import CategoryForm from "@/components/admin/CategoryForm";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const category = getAdminCategoryById(id);
  if (!category) return notFound();
  return <CategoryForm category={category} />;
}
