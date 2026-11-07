'use client';

import { ErrorBox, Field, btn, input } from '@/app/admin/_components/ui';
import { errMsg } from '@/app/lib/admin-api';
import type { Experience } from '@/app/lib/admin-types';
import { useState, type FormEvent } from 'react';

const csv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

export default function ExperienceForm({
  initial,
  onSubmit,
}: {
  initial?: Experience;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const edit = !!initial;
  const [f, setF] = useState({
    company: initial?.company ?? '',
    position: initial?.position ?? '',
    employmentType: initial?.employmentType ?? '',
    description: initial?.description ?? '',
    startDate: initial?.startDate.slice(0, 10) ?? '',
    endDate: initial?.endDate?.slice(0, 10) ?? '',
    technologies: (initial?.technologies ?? []).join(', '),
    isPublished: initial?.isPublished ?? true,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof f, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onSubmit({
        company: f.company.trim(),
        position: f.position.trim(),
        employmentType: f.employmentType.trim() || (edit ? null : undefined),
        description: f.description.trim(),
        startDate: f.startDate,
        endDate: f.endDate || (edit ? null : undefined), // ว่าง = ยังทำอยู่
        technologies: csv(f.technologies),
        isPublished: f.isPublished,
      });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="admin-form">
      <ErrorBox message={error} />
      <div className="admin-form-row">
        <Field label="บริษัท / สถานที่ *">
          <input className={input} required value={f.company} onChange={(e) => set('company', e.target.value)} />
        </Field>
        <Field label="ตำแหน่ง *">
          <input className={input} required value={f.position} onChange={(e) => set('position', e.target.value)} />
        </Field>
      </div>
      <Field label="ประเภท" hint="เช่น Education, Collaboration, Internship (ไม่บังคับ)">
        <input className={input} value={f.employmentType} onChange={(e) => set('employmentType', e.target.value)} />
      </Field>
      <div className="admin-form-row">
        <Field label="วันที่เริ่ม *">
          <input className={input} type="date" required value={f.startDate} onChange={(e) => set('startDate', e.target.value)} />
        </Field>
        <Field label="วันที่สิ้นสุด" hint="เว้นว่าง = ยังทำอยู่">
          <input className={input} type="date" value={f.endDate} onChange={(e) => set('endDate', e.target.value)} />
        </Field>
      </div>
      <Field label="รายละเอียด *">
        <textarea className={input} rows={6} required value={f.description} onChange={(e) => set('description', e.target.value)} />
      </Field>
      <Field label="เทคโนโลยี" hint="คั่นด้วยคอมมา">
        <input className={input} value={f.technologies} onChange={(e) => set('technologies', e.target.value)} />
      </Field>
      <label className="admin-check">
        <input type="checkbox" checked={f.isPublished} onChange={(e) => set('isPublished', e.target.checked)} /> เผยแพร่
      </label>
      <button className={btn} disabled={busy}>
        {busy ? 'กำลังบันทึก…' : 'บันทึก'}
      </button>
    </form>
  );
}