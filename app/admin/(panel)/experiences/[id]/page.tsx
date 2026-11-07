'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ErrorBox } from '@/app/admin/_components/ui';
import { api, errMsg } from '@/app/lib/admin-api';
import type { Experience } from '@/app/lib/admin-types';
import ExperienceForm from '../ExperienceForm';

export default function EditExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Experience | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Experience>(`/admin/experiences/${id}`).then(setItem).catch((e) => setError(errMsg(e)));
  }, [id]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">แก้ไขประสบการณ์</h1>
      <ErrorBox message={error} />
      {item && (
        <ExperienceForm
          initial={item}
          onSubmit={async (data) => {
            await api(`/admin/experiences/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
            router.push('/admin/experiences');
          }}
        />
      )}
    </div>
  );
}
