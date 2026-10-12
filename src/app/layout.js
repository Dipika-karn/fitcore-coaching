import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://fitcore-coaching.vercel.app"),

  title: {
    default: "FitCore Coaching | Online Fitness Coaching",
    template: "%s | FitCore Coaching",
  },

  description:
    "Personalized online fitness coaching designed to help you get stronger, feel better, and live healthier.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "FitCore Coaching",
    title: "FitCore Coaching | Online Fitness Coaching",
    description:
      "Personalized online fitness coaching designed to help you get stronger, feel better, and live healthier.",
    url: "/",
    images: [
      {
        url: "/images/seo/og-image.png",
        width: 1200,
        height: 630,
        alt: "FitCore Coaching — Online Fitness Coaching",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FitCore Coaching | Online Fitness Coaching",
    description:
      "Personalized online fitness coaching designed to help you get stronger, feel better, and live healthier.",
    images: ["/images/seo/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}