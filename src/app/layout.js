import './globals.css';
import { LanguageProvider } from '@/components/LanguageContext';
import Header from '@/components/Header';

export const metadata = {
  title: 'CDPI - Inji Proof of Concept',
  description: 'Simulation de l\'infrastructure MOSIP Inji pour le CDPI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Header />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
