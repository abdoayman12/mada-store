"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

type AdminUser = { name: string; email: string; role: "admin" };

type AdminAuthCtx = {
    admin: AdminUser | null;
    loading: boolean;
    login: (
        email: string,
        password: string,
    ) => Promise<{ ok: boolean; error?: string }>;
    logout: () => void;
};

const Ctx = createContext<AdminAuthCtx | null>(null);

const STORAGE_KEY = "mada_admin_v1";

// ─── Mock credentials ────────────────────────────────────────────────────────
// TODO: replace login() with a real Next.js server action that validates
//       against the DB and issues an httpOnly session cookie.
const MOCK_ADMIN = { email: "admin@mada-store.com", password: "admin123" };

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setAdmin(JSON.parse(raw));
        } catch {
            //
        } finally {
            setLoading(false);
        }
    }, []);

    async function login(email: string, password: string) {
        // Simulate a network round-trip
        await new Promise((r) => setTimeout(r, 700));

        if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
            const user: AdminUser = {
                name: "مدير النظام",
                email,
                role: "admin",
            };
            setAdmin(user);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            return { ok: true };
        }
        return {
            ok: false,
            error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        };
    }

    function logout() {
        setAdmin(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    return (
        <Ctx.Provider value={{ admin, loading, login, logout }}>
            {children}
        </Ctx.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(Ctx);
    if (!ctx)
        throw new Error("useAdminAuth must be used within AdminAuthProvider");
    return ctx;
}
