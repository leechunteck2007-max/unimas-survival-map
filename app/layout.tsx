import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CampusExplorerProvider } from "@/hooks/useCampusExplorer";
import { UserLocationProvider } from "@/hooks/useUserLocation";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNIMAS Survival",
  description: "A simple guide to useful places and facilities around UNIMAS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body>
        <UserLocationProvider>
          <CampusExplorerProvider>{children}</CampusExplorerProvider>
        </UserLocationProvider>
      </body>
    </html>
  );
}
