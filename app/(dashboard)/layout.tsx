import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";
import { ToasterProvider } from "@/lib/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Klikmart - Dashboard",
  description: "Klikmart Dashboard pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <ToasterProvider />
          <div className="flex max-lg:flex-col text-grey-1">
            <LeftSideBar /> {/* Show only on larger screens */}
            <div className="flex max-lg:flex-col text-grey-1">
              <div className="lg:hidden">
                {" "}
                {/* Show only on smaller screens */}
                <TopBar />
              </div>
              <div className="flex-1">{children}</div>
            </div>
          </div>
        </body>
      </ClerkProvider>
    </html>
  );
}

