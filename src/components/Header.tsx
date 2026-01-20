'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({ title, showBack = false, rightElement }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={24} className="text-slate-700" />
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
    </header>
  );
}
