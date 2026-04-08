import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Water Advisory App",
  description: "Smart water monitoring system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}