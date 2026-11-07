const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5555';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const errMsg = (e: unknown) =>
  e instanceof Error ? e.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';

export async function api<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      credentials: 'include', // ส่ง/รับ httpOnly cookie
      cache: 'no-store',
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(0, `เชื่อมต่อ API ไม่ได้ (${BASE}) — เช็กว่าเซิร์ฟเวอร์รันอยู่และตั้ง CORS ถูกต้อง`);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? res.statusText);
    throw new ApiError(res.status, msg);
  }
  return res.json() as Promise<T>;
}
