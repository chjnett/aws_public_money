'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({ title, showBack = false, rightElement }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-[#FFFDF5]/95 backdrop-blur-sm border-b border-cream-300">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-cream-200 active:bg-cream-300 transition-colors"
            >
              <ArrowLeft size={24} className="text-brown-700" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="relative w-14 h-14 opacity-90 mix-blend-multiply">
              <Image
                src="/header-icon.png"
                alt="밥풀"
                fill
                sizes="56px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
    </header>
  );
}

