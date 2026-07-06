"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Header() {
  const pathname = usePathname();
  const { itemsCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream-soft/90 backdrop-blur">
      <div className="wrap flex h-20 items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/Untitled-1.png" alt="مدى" width={56} height={32} className="h-16 w-auto object-contain" priority />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-semibold transition-colors hover:text-sage-700",
                  active ? "text-sage-700" : "text-ink"
                )}
              >
                {link.label}
                {active && <span className="absolute -bottom-2 right-0 left-0 h-[2px] rounded-full bg-clay-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="بحث"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700 sm:flex"
          >
            <FiSearch size={18} />
          </button>
          <Link
            href="/login"
            aria-label="تسجيل الدخول"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700 sm:flex"
          >
            <FiUser size={18} />
          </Link>
          <Link
            href="/cart"
            aria-label="السلة"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700"
          >
            <FiShoppingCart size={18} />
            {itemsCount > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-clay-500 px-1 text-[10px] font-bold text-cream-soft">
                {itemsCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700 lg:hidden"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-cream-soft px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-semibold",
                  pathname === link.href ? "bg-sage-50 text-sage-700" : "text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-ink">
              تسجيل الدخول
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
