import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/context/Providers";

const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "../../public/fonts/poppins/Poppins-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/poppins/Poppins-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/poppins/Poppins-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/poppins/Poppins-Bold.ttf", weight: "700" },
    { path: "../../public/fonts/poppins/Poppins-ExtraBold.ttf", weight: "800" },
  ],
});

const almarai = localFont({
  variable: "--font-almarai",
  display: "swap",
  src: [
    { path: "../../public/fonts/almarai/Almarai-Light.ttf", weight: "300" },
    { path: "../../public/fonts/almarai/Almarai-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/almarai/Almarai-Bold.ttf", weight: "700" },
    { path: "../../public/fonts/almarai/Almarai-ExtraBold.ttf", weight: "800" },
  ],
});

export const metadata: Metadata = {
  title: "Takos Korner",
  description: "Order from the best restaurants around you.",
  icons: { icon: "/images/logo/logo_foreground.png" },
};

export const viewport: Viewport = {
  themeColor: "#EC1D23",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${almarai.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-bg text-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
