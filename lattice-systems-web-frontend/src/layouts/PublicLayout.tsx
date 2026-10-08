import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
