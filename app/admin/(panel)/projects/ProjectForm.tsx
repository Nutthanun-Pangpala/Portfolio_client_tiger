'use client';

import { useState, type FormEvent } from 'react';
import { ErrorBox, Field, btn, input } from '@/app/admin/_components/ui';
import { errMsg } from '@/app/lib/admin-api';
import type { Project } from '@/app/lib/admin-types';

const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const csv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

export default function ProjectForm({
  initial,
  onSubmit,
}: {
  initial?: Project;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const edit = !!initial;
  const [f, setF] = useState({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    role: initial?.role ?? '',
    imageUrl: initial?.imageUrl ?? '',
    images: (initial?.images ?? []).join('\n'),
    demoUrl: initial?.demoUrl ?? '',
    githubUrl: initial?.githubUrl ?? '',
    technologies: (initial?.technologies ?? []).join(', '),
    isFeatured: initial?.isFeatured ?? false,
    isPublished: initial?.isPublished ?? true,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof f, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));
  // ตอนแก้ไข: ช่องที่ล้างว่างให้ส่ง null เพื่อลบค่า / ตอนสร้าง: ไม่ส่งช่องนั้น
  const opt = (v: string) => v.trim() || (edit ? null : undefined);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onSubmit({
        title: f.title.trim(),
        ...(f.slug.trim() && { slug: f.slug.trim() }),
        description: f.description.trim(),
        role: opt(f.role),
        imageUrl: opt(f.imageUrl),
        demoUrl: opt(f.demoUrl),
        githubUrl: opt(f.githubUrl),
        images: lines(f.images),
        technologies: csv(f.technologies),
        isFeatured: f.isFeatured,
        isPublished: f.isPublished,
      });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4">
      <ErrorBox message={error} />
      <Field label="ชื่อผลงาน *">
        <input className={input} required value={f.title} onChange={(e) => set('title', e.target.value)} />
      </Field>
      <Field label="Slug" hint="a-z, 0-9 และ - เท่านั้น เว้นว่างเพื่อสร้างจากชื่ออัตโนมัติ (ชื่อภาษาไทยล้วนควรกรอกเอง)">
        <input className={input} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={f.slug} onChange={(e) => set('slug', e.target.value)} />
      </Field>
      <Field label="รายละเอียด *">
        <textarea className={input} rows={6} required value={f.description} onChange={(e) => set('description', e.target.value)} />
      </Field>
      <Field label="บทบาท" hint="เช่น Full-stack Developer">
        <input className={input} value={f.role} onChange={(e) => set('role', e.target.value)} />
      </Field>
      <Field label="เทคโนโลยี" hint="คั่นด้วยคอมมา เช่น Next.js, NestJS, Prisma">
        <input className={input} value={f.technologies} onChange={(e) => set('technologies', e.target.value)} />
      </Field>
      <Field label="รูปปก (imageUrl)" hint="เช่น /projects/mangax/1.png หรือ URL เต็ม">
        <input className={input} value={f.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
      </Field>
      <Field label="รูปในแกลเลอรี" hint="หนึ่งบรรทัดต่อหนึ่งรูป">
        <textarea className={input} rows={4} value={f.images} onChange={(e) => set('images', e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Demo URL">
          <input className={input} type="url" placeholder="https://" value={f.demoUrl} onChange={(e) => set('demoUrl', e.target.value)} />
        </Field>
        <Field label="GitHub URL">
          <input className={input} type="url" placeholder="https://" value={f.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} />
        </Field>
      </div>
      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={f.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} /> แนะนำ (แสดงก่อน)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={f.isPublished} onChange={(e) => set('isPublished', e.target.checked)} /> เผยแพร่
        </label>
      </div>
      <button className={btn} disabled={busy}>{busy ? 'กำลังบันทึก…' : 'บันทึก'}</button>
    </form>
  );
}
