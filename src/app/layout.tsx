import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { WalletProvider } from "@/components/WalletProvider";
import { Toaster } from "@/components/ui/toaster";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";
import "./globals.css";
import localFont from "next/font/local";

const boldFont = localFont({
  src: "../fonts/boldones.zip",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Todo App NextJS Aptos",
  title: "TodoApp Dapp",
  description: "This is a simple todo app, built with Next.js and Aptos.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <ReactQueryProvider>
            <div id="root">{children}</div>
            <WrongNetworkAlert />
            <Toaster />
          </ReactQueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
