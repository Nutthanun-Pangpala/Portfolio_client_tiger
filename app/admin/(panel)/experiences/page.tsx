'use client';

import { ErrorBox, Toggle, btn, btnDanger, btnGhost } from '@/app/admin/_components/ui';
import { api, errMsg } from '@/app/lib/admin-api';
import type { Experience } from '@/app/lib/admin-types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

export default function ExperiencesPage() {
  const [items, setItems] = useState<Experience[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Experience[]>('/admin/experiences').then(setItems).catch((e) => setError(errMsg(e)));
  }, []);

  async function togglePublish(x: Experience) {
    setError('');
    try {
      const updated = await api<Experience>(`/admin/experiences/${x.id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished: !x.isPublished }),
      });
      setItems((cur) => cur?.map((i) => (i.id === x.id ? updated : i)) ?? cur);
    } catch (e) {
      setError(errMsg(e));
    }
  }

  async function remove(x: Experience) {
    if (!confirm(`ลบ "${x.position} @ ${x.company}" ใช่หรือไม่? ย้อนกลับไม่ได้`)) return;
    setError('');
    try {
      await api(`/admin/experiences/${x.id}`, { method: 'DELETE' });
      setItems((cur) => cur?.filter((i) => i.id !== x.id) ?? cur);
    } catch (e) {
      setError(errMsg(e));
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h1>ประสบการณ์</h1>
        <Link href="/admin/experiences/new" className={btn}>
          + เพิ่มประสบการณ์
        </Link>
      </div>
      <ErrorBox message={error} />

      {!items ? (
        !error && <p className="admin-muted">กำลังโหลด…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>ยังไม่มีข้อมูล</h3>
          <p>เริ่มจากเพิ่มประสบการณ์แรกของคุณ</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ตำแหน่ง / บริษัท</th>
                <th>ช่วงเวลา</th>
                <th>เผยแพร่</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td>
                    <Link href={`/admin/experiences/${x.id}`} className="admin-title">
                      {x.position}
                    </Link>
                    <div className="admin-sub">
                      {x.company}
                      {x.employmentType ? ` · ${x.employmentType}` : ''}
                    </div>
                  </td>
                  <td className="admin-tech admin-nowrap">
                    {fmt(x.startDate)} – {x.endDate ? fmt(x.endDate) : 'ปัจจุบัน'}
                  </td>
                  <td>
                    <Toggle on={x.isPublished} label={`เผยแพร่: ${x.position}`} onClick={() => togglePublish(x)} />
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/experiences/${x.id}`} className={btnGhost}>
                        แก้ไข
                      </Link>
                      <button onClick={() => remove(x)} className={btnDanger}>
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