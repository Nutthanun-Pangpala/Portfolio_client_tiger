import type { ReactNode } from 'react';

// ชื่อ export เหมือนเดิมทุกตัว แต่ชี้ไปที่คลาสใน admin.css แทน Tailwind
export const input = 'admin-input';
export const btn = 'button button-primary admin-btn';
export const btnGhost = 'button button-small';
export const btnDanger = 'button button-small admin-danger';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {children}
      {hint && <span className="admin-hint">{hint}</span>}
    </label>
  );
}

export function ErrorBox({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="admin-error" role="alert">
      {message}
    </p>
  );
}

export function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className="admin-switch"
    />
  );
}