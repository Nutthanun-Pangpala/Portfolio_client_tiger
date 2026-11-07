import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { LanguageProvider } from "./lib/i18n";
import { getLang } from "./lib/lang";

export const metadata: Metadata = {
  title: "Nutthanun Pengpala | Developer Portfolio",
  description:
    "Software developer portfolio featuring projects, skills, and experience.",
};

async function LanguageGate({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return <LanguageProvider initialLang={lang}>{children}</LanguageProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <LanguageGate>{children}</LanguageGate>
        </Suspense>
      </body>
    </html>
  );
}