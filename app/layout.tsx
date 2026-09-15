import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { BottomNav } from "@/components/nav/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maroon Market",
  description: "The Virginia Tech student marketplace",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-stone/5 font-normal text-foreground">
        <StoreProvider>
          <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white">
            <div className="flex-1">{children}</div>
            <BottomNav />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
