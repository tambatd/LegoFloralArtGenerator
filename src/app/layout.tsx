import "./globals.css";

export const metadata = {
  title: "Lego Floral Art Set Art Generator",
  description:
    "Upload any image and generate instructions on how to build them using the Lego Floral Art set",
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
