"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheck, FiRefreshCw } from "react-icons/fi";
import { Category } from "@/lib/types";
import { createCategory, updateCategory, toSlug } from "@/lib/adminData";
import { FieldWrapper, Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type FormState = {
    name: string;
    slug: string;
    image: string;
    count: number;
};

function toFormState(cat?: Category): FormState {
    return {
        name: cat?.name ?? "",
        slug: cat?.slug ?? "",
        image: cat?.image ?? "",
        count: cat?.count ?? 0,
    };
}

type Errors = Partial<Record<keyof FormState, string>>;

export default function CategoryForm({ category }: { category?: Category }) {
    const router = useRouter();
    const isEdit = Boolean(category);
    const [form, setForm] = useState<FormState>(() => toFormState(category));
    const [errors, setErrors] = useState<Errors>({});
    const [saved, setSaved] = useState(false);
    // هل المستخدم عدّل الـ slug يدويًا؟ لو لأ، يتولد تلقائيًا من الاسم
    const [slugManual, setSlugManual] = useState(isEdit);

    // ── Auto-generate slug from name (unless user edited it manually) ─────────
    useEffect(() => {
        if (!slugManual && form.name) {
            setForm((prev) => ({ ...prev, slug: toSlug(form.name) }));
        }
    }, [form.name, slugManual]);

    function set<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function validate(): boolean {
        const e: Errors = {};
        if (!form.name.trim()) e.name = "اسم الفئة مطلوب";
        if (!form.slug.trim()) e.slug = "الـ slug مطلوب";
        if (!/^[a-z0-9-]+$/.test(form.slug))
            e.slug = "الـ slug يقبل فقط أحرف إنجليزية صغيرة وأرقام وشرطات";
        if (!form.image.trim()) e.image = "رابط الصورة مطلوب";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit() {
        if (!validate()) return;

        if (isEdit && category) {
            updateCategory(category.id, form);
        } else {
            createCategory(form);
        }

        setSaved(true);
        setTimeout(() => router.push("/admin/categories"), 1000);
    }

    return (
        <div className="mx-auto max-w-xl space-y-6">
            {saved && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                    <FiCheck size={16} />
                    {isEdit ? "تم تحديث الفئة بنجاح" : "تم إضافة الفئة بنجاح"} —
                    جاري التحويل...
                </div>
            )}

            <div className="space-y-5 rounded-2xl bg-white p-6 shadow-soft">
                {/* Name */}
                <FieldWrapper label="اسم الفئة" required error={errors.name}>
                    <Input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="مثال: العناية والجمال"
                    />
                </FieldWrapper>

                {/* Slug — مع زر إعادة التوليد */}
                <FieldWrapper
                    label="الـ Slug (رابط الفئة)"
                    required
                    error={errors.slug}
                    hint="يظهر في الـ URL مثل: /products?category=beauty — أحرف إنجليزية صغيرة وأرقام وشرطات فقط"
                >
                    <div className="flex gap-2">
                        <Input
                            dir="ltr"
                            value={form.slug}
                            onChange={(e) => {
                                setSlugManual(true);
                                set("slug", e.target.value);
                            }}
                            placeholder="beauty"
                            className="flex-1"
                        />
                        <button
                            type="button"
                            title="إعادة التوليد من الاسم"
                            onClick={() => {
                                setSlugManual(false);
                                set("slug", toSlug(form.name));
                            }}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E3DECF] bg-[#F7F4EC] text-[#666C5E] transition hover:border-[#71896A] hover:text-[#71896A]"
                        >
                            <FiRefreshCw size={15} />
                        </button>
                    </div>
                </FieldWrapper>

                {/* Image URL */}
                <FieldWrapper
                    label="رابط صورة الفئة"
                    required
                    error={errors.image}
                >
                    <Input
                        dir="ltr"
                        value={form.image}
                        onChange={(e) => set("image", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                    {form.image && (
                        <div className="mt-2 h-28 w-28 overflow-hidden rounded-xl border border-[#E3DECF] bg-[#F7F4EC]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={form.image}
                                alt="معاينة"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    (
                                        e.target as HTMLImageElement
                                    ).style.display = "none";
                                }}
                            />
                        </div>
                    )}
                </FieldWrapper>

                {/* Products count */}
                <FieldWrapper
                    label="عدد المنتجات"
                    hint="بيتحدث تلقائيًا من قاعدة البيانات — يمكنك تعديله يدويًا"
                >
                    <Input
                        type="number"
                        dir="ltr"
                        min={0}
                        value={form.count}
                        onChange={(e) => set("count", Number(e.target.value))}
                    />
                </FieldWrapper>
            </div>

            <div className="flex items-center gap-3">
                <Button onClick={handleSubmit} size="lg" disabled={saved}>
                    {saved ? (
                        <>
                            <FiCheck size={16} /> تم الحفظ
                        </>
                    ) : isEdit ? (
                        "حفظ التعديلات"
                    ) : (
                        "إضافة الفئة"
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                >
                    إلغاء
                </Button>
            </div>
        </div>
    );
}
