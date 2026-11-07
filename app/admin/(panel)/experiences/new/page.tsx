'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/admin-api';
import ExperienceForm from '../ExperienceForm';

export default function NewExperiencePage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">เพิ่มประสบการณ์</h1>
      <ExperienceForm
        onSubmit={async (data) => {
          await api('/admin/experiences', { method: 'POST', body: JSON.stringify(data) });
          router.push('/admin/experiences');
        }}
      />
    </div>
  );
}
