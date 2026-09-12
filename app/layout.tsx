import "./globals.css";
export const metadata = { title: "Islington R&D Digital Hub", description: "Discover research. Understand ideas. Connect and participate." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
