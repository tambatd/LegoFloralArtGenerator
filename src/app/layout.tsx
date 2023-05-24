import "./globals.css";
import lego from "./assets/legos.png";

export const metadata = {
  title: "Lego Floral Art Set Art Generator",
  description:
    "Upload any image and generate instructions on how to build them using the Lego Floral Art set",
  other: { image: lego.src },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
