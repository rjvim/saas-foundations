import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import type { ReactNode } from "react";
import { cn } from "@foundations/shadcn/lib/utils";
import { RootProvider } from "fumadocs-ui/provider";
import { baseUrl, createMetadata } from "@workspace/config/metadata";
import { description } from "@workspace/config/layout.config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export const metadata = createMetadata({
  title: {
    template: "%s | SaaS Foundations",
    default: "SaaS Foundations",
  },
  description: description,
  metadataBase: baseUrl,
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          crossOrigin="anonymous"
          src="//cdn.jsdelivr.net/npm/meta-scan@0.10.2/dist/auto.global.js"
          data-auto-enable={"true"}
        />
      </head>
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          `${geistSans.variable} ${geistMono.variable}`
        )}
      >
        <RootProvider
          search={{
            options: {
              type: "static",
              defaultTag: "docs",
              tags: [
                {
                  name: "Docs",
                  value: "docs",
                },
                {
                  name: "Blog",
                  value: "blog",
                },
              ],
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
