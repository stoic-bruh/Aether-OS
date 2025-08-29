'use client';
import { useMobileMenu } from '@/app/context/MobileMenuContext';
import { Menu, X } from 'lucide-react';

export default function MobileHeader() {
  const { isOpen, toggleMenu } = useMobileMenu();

  return (
    <header className="md:hidden sticky top-0 z-40 bg-black/50 backdrop-blur-lg border-b border-neutral-800 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">AetherOS</h1>
      <button onClick={toggleMenu} className="p-2">
        {isOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}
