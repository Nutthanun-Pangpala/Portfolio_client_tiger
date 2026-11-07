'use client';

import { api, errMsg } from '@/app/lib/admin-api';
import type { Project } from '@/app/lib/admin-types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Project[]>('/admin/projects').then(setItems).catch((e) => setError(errMsg(e)));
  }, []);

  const replace = (p: Project) =>
    setItems((cur) => cur?.map((x) => (x.id === p.id ? p : x)) ?? cur);

  async function patch(id: string, path: string, body: object) {
    setError('');
    try {
      replace(await api<Project>(`/admin/projects/${id}${path}`, { method: 'PATCH', body: JSON.stringify(body) }));
    } catch (e) {
      setError(errMsg(e));
    }
  }

  async function remove(p: Project) {
    if (!confirm(`ลบ "${p.title}" ใช่หรือไม่? ย้อนกลับไม่ได้`)) return;
    setError('');
    try {
      await api(`/admin/projects/${p.id}`, { method: 'DELETE' });
      setItems((cur) => cur?.filter((x) => x.id !== p.id) ?? cur);
    } catch (e) {
      setError(errMsg(e));
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h1>ผลงาน</h1>
        <Link href="/admin/projects/new" className="button button-primary">
          + เพิ่มผลงาน
        </Link>
      </div>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {!items ? (
        !error && <p className="admin-muted">กำลังโหลด…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>ยังไม่มีผลงาน</h3>
          <p>เริ่มจากเพิ่มผลงานชิ้นแรกของคุณ</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>เทคโนโลยี</th>
                <th>แนะนำ</th>
                <th>เผยแพร่</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/projects/${p.id}`} className="admin-title">
                      {p.title}
                    </Link>
                    <div className="admin-sub">
                      /{p.slug}
                      {p.role ? ` · ${p.role}` : ''}
                    </div>
                  </td>
                  <td className="admin-tech">{p.technologies.join(', ')}</td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={p.isFeatured}
                      aria-label={`แนะนำ: ${p.title}`}
                      className="admin-switch"
                      onClick={() => patch(p.id, '', { isFeatured: !p.isFeatured })}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={p.isPublished}
                      aria-label={`เผยแพร่: ${p.title}`}
                      className="admin-switch"
                      onClick={() => patch(p.id, '/publish', { isPublished: !p.isPublished })}
                    />
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/projects/${p.id}`} className="button button-small">
                        แก้ไข
                      </Link>
                      <button type="button" onClick={() => remove(p)} className="button button-small admin-danger">
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}