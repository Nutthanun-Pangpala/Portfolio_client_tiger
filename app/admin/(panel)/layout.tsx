'use client';

import { ErrorBox, btnGhost } from '@/app/admin/_components/ui';
import { ApiError, api, errMsg } from '@/app/lib/admin-api';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState, type ReactNode } from 'react';

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'admin-nav-icon',
  'aria-hidden': true,
};

const NAV = [
  {
    href: '/admin/projects',
    label: 'ผลงาน',
    icon: (
      <svg {...iconProps}>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    href: '/admin/experiences',
    label: 'ประสบการณ์',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
];

// usePathname อยู่ในคอมโพเนนต์เล็กๆ นี้เท่านั้น และถูกห่อด้วย <Suspense> ตอนใช้งาน
// (Next.js ที่เปิด Cache Components ไม่ยอมให้เรียก usePathname นอก Suspense ในเส้นทาง [id])
function NavLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  const pathname = usePathname();
  return (
    <Link href={href} className="admin-nav-link" aria-current={pathname.startsWith(href) ? 'page' : undefined}>
      {icon}
      {label}
    </Link>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<{ id: string; email: string }>('/auth/me')
      .then((u) => setEmail(u.email))
      .catch((err) => {
        // 401 = ยังไม่ login; อย่างอื่น (เช่น API ล่ม/CORS) ให้แสดง error แทนการเด้งไปหน้า login
        if (err instanceof ApiError && err.status === 401) router.replace('/admin/login');
        else setError(errMsg(err));
      });
  }, [router]);

  async function logout() {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    router.replace('/admin/login');
  }

  if (error)
    return (
      <div className="admin-center">
        <ErrorBox message={error} />
      </div>
    );
  if (!email) return <p className="admin-center admin-muted">กำลังตรวจสอบสิทธิ์…</p>;

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <span className="admin-brand-mark" aria-hidden />
          หลังบ้าน
        </div>

        <nav className="admin-nav">
          {NAV.map((n) => (
            <Suspense
              key={n.href}
              fallback={
                <Link href={n.href} className="admin-nav-link">
                  {n.icon}
                  {n.label}
                </Link>
              }
            >
              <NavLink href={n.href} label={n.label} icon={n.icon} />
            </Suspense>
          ))}
        </nav>

        <div className="admin-account">
          <div className="admin-account-row">
            <span className="admin-avatar" aria-hidden>
              {email.charAt(0).toUpperCase()}
            </span>
            <span className="admin-account-email">{email}</span>
          </div>
          <button onClick={logout} className={`${btnGhost} admin-logout`}>
            ออกจากระบบ
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}