import type { Metadata } from "next";
import { Inter, Mulish, Poppins } from "next/font/google";
import "@/styles/globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  preload: true,
  subsets: ["latin"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  preload: true,
  weight: ["200", "300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  preload: true,
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DHP Admin App",
  description: "DHP Admin App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mulish.variable} ${poppins.variable} antialiased `}
      >
        <NextTopLoader
          color="#3b82f6"
          showSpinner={false}
          showForHashAnchor={false}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
