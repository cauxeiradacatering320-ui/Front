import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f5f2eb] min-h-screen text-black font-sans selection:bg-[#cba774] selection:text-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
