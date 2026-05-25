import "../styles/global.css";
import Navigation from "@/components/navigation";
import * as Sentry from "@sentry/nextjs";
import type { Metadata, Viewport } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "Eureka",
    description: "Eureka is a Mahjong Solitaire Game",
    icons: { icon: "/icon.svg" },
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-800 h-full">
      <body className="h-full flex flex-col">
        <Navigation />
        <main className="flex flex-col flex-1 min-h-0">{children}</main>
      </body>
    </html>
  );
}
