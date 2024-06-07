import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import type { Metadata } from 'next';
import theme from '../theme';
import Footer from './Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alexandria 2024 Candidate Tool',
  description:
    'A tool to help you figure out who to vote for in the Alexandria 2024 Democratic primary election.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
            <Footer />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
