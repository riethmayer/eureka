import "../styles/global.css";
import Navigation from "@/components/navigation";
export const metadata = {
  title: "Eureka",
  description: "Eureka is a Mahjong Solitaire Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-800 h-full">
      <body className="h-full">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
