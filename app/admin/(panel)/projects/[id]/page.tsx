'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ErrorBox } from '@/app/admin/_components/ui';
import { api, errMsg } from '@/app/lib/admin-api';
import type { Project } from '@/app/lib/admin-types';
import ProjectForm from '../ProjectForm';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Project>(`/admin/projects/${id}`).then(setProject).catch((e) => setError(errMsg(e)));
  }, [id]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">แก้ไขผลงาน</h1>
      <ErrorBox message={error} />
      {project && (
        <ProjectForm
          initial={project}
          onSubmit={async (data) => {
            await api(`/admin/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
            router.push('/admin/projects');
          }}
        />
      )}
    </div>
  );
}
