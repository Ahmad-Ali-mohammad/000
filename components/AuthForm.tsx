import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

export const AuthForm: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    onLogin(normalizedEmail);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auto Poster Hub</h1>
          <p className="mt-2 text-sm text-gray-500">واجهة تجريبية لإدارة حملات المحتوى. لا توجد مصادقة حقيقية.</p>
        </div>
        <Input label="البريد الإلكتروني" type="email" autoComplete="email" required value={email} onChange={e => { setEmail(e.target.value); setError(''); }} />
        {error && <p role="alert" className="text-sm text-amber-700">{error}</p>}
        <Button type="submit" block>دخول تجريبي فقط</Button>
        <p className="text-xs text-gray-500">لا تدخل بيانات حساسة؛ المصادقة الحقيقية تتطلب خادمًا موثوقًا.</p>
      </form>
    </main>
  );
};
