// Server-only helper. Do not import this from a "use client" file.
import { cookies, headers } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, isLang, type Lang } from "./dictionary";

// 1) the language the visitor picked (cookie)
// 2) otherwise Thai if their browser prefers Thai
// 3) otherwise the default
export async function getLang(): Promise<Lang> {
  const saved = (await cookies()).get(LANG_COOKIE)?.value;
  if (isLang(saved)) return saved;

  const accept = (await headers()).get("accept-language") ?? "";
  return accept.toLowerCase().startsWith("th") ? "th" : DEFAULT_LANG;
}
