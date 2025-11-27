import ServiceWorkerRegister  from './sw-init';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { SessionProviderWrapper } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ReferLink - Private Job Referral Platform',
  description: 'Connect, share job opportunities, and request referrals in a trusted community',
  manifest: "/manifest.json",
  theme_color: "#000000",
  icons: {
    icon : "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://www.referlink.space" />
        <meta name="theme-color" content="#ffffff"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="application-name" content="ReferLink"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff"/>
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a1a1a"/>
        <meta property="og:title" content="ReferLink - Private Job Referral Platform" />
        <meta property="og:description" content="connect, Share job opportuniites, and request referrals in a trusted communinty."/>
        <meta property="og:image" content="https://www.referlink.space/icons/logo.png" />
        <meta property="og:url" content="https://www.referlink.space" />
        <meta property="og:type" content="website" />
        
      </head>
      <body className={inter.className}>
        <SessionProviderWrapper>
          <ServiceWorkerRegister /> 
          {children}
          <Toaster position="top-right" richColors />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
