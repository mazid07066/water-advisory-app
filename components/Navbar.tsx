"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLink = (href: string, label: string) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`px-4 py-2 rounded-2xl text-base md:text-lg font-bold transition ${
          active
            ? "bg-white text-blue-700 shadow"
            : "text-white hover:bg-white/15"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌊</span>
          <span className="text-white text-2xl font-extrabold tracking-tight">
            Water Advisor
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {navLink("/", "Home")}
          {navLink("/trends", "Trends")}
          {navLink("/compare", "Compare")}
        </div>
      </div>
    </nav>
  );
}