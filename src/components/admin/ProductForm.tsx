"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheck } from "react-icons/fi";
import { Product } from "@/lib/types";
import { categories } from "@/lib/data";
import { FieldWrapper, Input, Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type FormState = {
  name: string;
  categoryId: string;
  price: string;
  compareAtPrice: string;
  description: string;
  details: string;
  inStock: boolean;
  isNew: boolean;
  isBestSeller: boolean;
};

function toFormState(product?: Partial<Product>): FormState {
  return {
    name: product?.name ?? "",
    categoryId: product?.categoryId ?? "",
    price: product?.price?.toString() ?? "",
    compareAtPrice: product?.compareAtPrice?.toString() ?? "",
    description: product?.description ?? "",
    details: product?.details?.join("\n") ?? "",
    inStock: product?.inStock ?? true,
    isNew: product?.isNew ?? false,
    isBestSeller: product?.isBestSeller ?? false,
  };
}

type Errors = Partial<Record<keyof FormState, string>>;

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [form, setForm] = useState<FormState>(() => toFormState(product));
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "اسم المنتج مطلوب";
    if (!form.categoryId) e.categoryId = "اختر الفئة";
    if (!form.price || isNaN(Number(form.price))) e.price = "السعر مطلوب وصحيح";
    if (!form.description.trim()) e.description = "الوصف مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    // TODO: call a Next.js server action to persist the product in the DB
    setSaved(true);
    setTimeout(() => {
      router.push("/admin/products");
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          <FiCheck size={16} />
          {isEdit ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح"} — جاري التحويل...
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-soft space-y-5">
        <h2 className="font-display text-base font-bold text-[#2A2E26] border-b border-[#E3DECF] pb-3">
          المعلومات الأساسية
        </h2>

        <FieldWrapper label="اسم المنتج" required error={errors.name}>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="مثال: شمعة عود ولافندر" />
        </FieldWrapper>

        <FieldWrapper label="الفئة" required error={errors.categoryId}>
          <Select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
            <option value="">اختر الفئة</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </FieldWrapper>

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="السعر (ج.م)" required error={errors.price}>
            <Input type="number" dir="ltr" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" />
          </FieldWrapper>
          <FieldWrapper label="السعر قبل الخصم (اختياري)">
            <Input type="number" dir="ltr" min={0} value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} placeholder="0" />
          </FieldWrapper>
        </div>

        <FieldWrapper label="وصف المنتج" required error={errors.description}>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="اكتب وصفًا مختصرًا وجذابًا للمنتج..." />
        </FieldWrapper>

        <FieldWrapper label="تفاصيل المنتج" hint="كل سطر هيتحول لنقطة في صفحة المنتج">
          <Textarea
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder={"100 مل\nخالٍ من الكحول\nمناسب لكل أنواع البشرة"}
            className="min-h-[100px] font-mono text-xs"
          />
        </FieldWrapper>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft space-y-4">
        <h2 className="font-display text-base font-bold text-[#2A2E26] border-b border-[#E3DECF] pb-3">
          الحالة والوسوم
        </h2>

        <div className="space-y-3">
          {[
            { key: "inStock" as const, label: "متوفر في المخزون" },
            { key: "isNew" as const, label: "وسم «جديد»" },
            { key: "isBestSeller" as const, label: "وسم «الأكثر طلبًا»" },
          ].map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => set(key, !form[key])}
                className={`relative h-6 w-11 rounded-full transition-colors ${form[key] ? "bg-[#71896A]" : "bg-[#E3DECF]"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form[key] ? "right-1 translate-x-0" : "right-6"}`} />
              </div>
              <span className="text-sm font-semibold text-[#2A2E26]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} size="lg" disabled={saved}>
          {saved ? <><FiCheck size={16} /> تم الحفظ</> : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
        </Button>
        <Button variant="outline" size="lg" onClick={() => router.back()}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
