'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LayoutContent({ children }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}

      <main>
        {children}
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}