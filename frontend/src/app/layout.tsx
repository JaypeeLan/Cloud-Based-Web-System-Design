import type { Metadata } from "next";
import { PageTransition } from "@/components/ui/PageTransition";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalSpot Booker",
  description: "Discover salons, eateries, and events by area and book instantly"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PageTransition>{children}</PageTransition>
        </AuthProvider>
      </body>
    </html>
  );
}
