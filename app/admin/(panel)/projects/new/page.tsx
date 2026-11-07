'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/admin-api';
import ProjectForm from '../ProjectForm';

export default function NewProjectPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">เพิ่มผลงาน</h1>
      <ProjectForm
        onSubmit={async (data) => {
          await api('/admin/projects', { method: 'POST', body: JSON.stringify(data) });
          router.push('/admin/projects');
        }}
      />
    </div>
  );
}
