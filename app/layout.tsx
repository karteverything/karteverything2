import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "KArt Everything",
    description: "Kat's portfolio and journal",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Header />
                
                <main>
                    {children}
                </main>
                
                <Footer />
            </body>
        </html>
    );
}