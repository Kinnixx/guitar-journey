import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GuitarJourney — Suivi de pratique",
  description: "Le journal de bord personnel pour suivre sa pratique de la guitare, ses morceaux, sa vitesse et sa progression.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
