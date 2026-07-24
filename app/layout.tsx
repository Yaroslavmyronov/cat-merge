import '@/styles/globals.css';

import type {Metadata} from 'next'
import { AppProvider } from '@/providers/AppProvider';

export const metadata: Metadata = {
 title: 'Cozy Cats',
 description: 'Pixel-art idle merge game for MiniPay',
 other: {
  'talentapp:project_verification':
   '30ad406b9b87a327219e0a9bd2c94bd9c88e165b82cdc51ace5e7d5de9868e70bf9d78be2c81460beba58f85b381c6ce00aa5e84d20f83f90b5a338b269a0eac',
 },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
