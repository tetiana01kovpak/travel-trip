// Minimal root layout required by the App Router.
// This project is an API-only server (no pages), so there is nothing to render here.
// Visiting "/" will correctly 404 since there is no app/page.tsx.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
