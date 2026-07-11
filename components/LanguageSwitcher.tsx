"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  LANGUAGE_COOKIE,
  type Language,
} from "@/lib/i18n";

export default function LanguageSwitcher({
  language,
  label,
  ariaLabel,
}: {
  language: Language;
  label: string;
  ariaLabel: string;
}) {
  const router = useRouter();
  const [changing, setChanging] = useState(false);

  function changeLanguage(): void {
    setChanging(true);

    const nextLanguage: Language =
      language === "bn" ? "en" : "bn";

    document.cookie =
      `${LANGUAGE_COOKIE}=${nextLanguage};` +
      "path=/;" +
      "max-age=31536000;" +
      "samesite=lax";

    router.refresh();

    window.setTimeout(() => {
      setChanging(false);
    }, 500);
  }

  return (
    <button
      type="button"
      onClick={changeLanguage}
      disabled={changing}
      aria-label={ariaLabel}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/40 bg-white px-4 py-2 text-sm font-extrabold text-blue-700 shadow-md transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/40 disabled:cursor-wait disabled:opacity-70 md:text-base"
    >
      🌐 {changing ? "..." : label}
    </button>
  );
}