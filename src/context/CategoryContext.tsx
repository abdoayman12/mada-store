"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
} from "react";
import { Category } from "@/generated/prisma/client";

type CategorieContextValue = {
    category: Category[];
    setCategory: Dispatch<Category[]>;
};

const CategoryContext = createContext<CategorieContextValue | null>(null);

const categoryLocal = JSON.parse(localStorage.getItem("category") || "[]");

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [category, setCategory] = useState<Category[]>(
        () => categoryLocal ?? [],
    );

    return (
        <CategoryContext.Provider value={{ category, setCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCatgory() {
    const ctx = useContext(CategoryContext);
    if (!ctx) throw new Error("useAuth must be used inside <CategoryContext>");
    return ctx;
}
