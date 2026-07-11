import Link from "next/link";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  getDictionary,
  type Language,
} from "@/lib/i18n";

export default function AppHeader({
  language,
}: {
  language: Language;
}) {
  const dictionary = getDictionary(language);
  const navigation = dictionary.navigation;

  return (
    <header className="sticky top-0 z-[1000] border-b border-white/20 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-lg">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-xl font-black md:text-2xl"
        >
          <span aria-hidden="true">🌊</span>

          <span>{navigation.brand}</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <nav
            aria-label={
              language === "bn"
                ? "প্রধান নেভিগেশন"
                : "Main navigation"
            }
            className="hidden items-center gap-1 sm:flex md:gap-2"
          >
            <Link
              href="/"
              className="rounded-xl px-3 py-2 text-sm font-extrabold transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/30 md:px-4 md:text-base"
            >
              {navigation.home}
            </Link>

            <Link
              href="/trends"
              className="rounded-xl px-3 py-2 text-sm font-extrabold transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/30 md:px-4 md:text-base"
            >
              {navigation.trends}
            </Link>

            <Link
              href="/compare"
              className="rounded-xl px-3 py-2 text-sm font-extrabold transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/30 md:px-4 md:text-base"
            >
              {navigation.compare}
            </Link>
          </nav>

          <LanguageSwitcher
            language={language}
            label={navigation.switchTo}
            ariaLabel={navigation.switchAria}
          />
        </div>
      </div>

      <nav
        aria-label={
          language === "bn"
            ? "মোবাইল নেভিগেশন"
            : "Mobile navigation"
        }
        className="flex justify-center gap-1 border-t border-white/15 px-3 py-2 sm:hidden"
      >
        <Link
          href="/"
          className="rounded-lg px-3 py-2 text-sm font-extrabold hover:bg-white/15"
        >
          {navigation.home}
        </Link>

        <Link
          href="/trends"
          className="rounded-lg px-3 py-2 text-sm font-extrabold hover:bg-white/15"
        >
          {navigation.trends}
        </Link>

        <Link
          href="/compare"
          className="rounded-lg px-3 py-2 text-sm font-extrabold hover:bg-white/15"
        >
          {navigation.compare}
        </Link>
      </nav>
    </header>
  );
}