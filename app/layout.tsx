import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata = {
    title: "KArt Everything",
    description: "Kat's portfolio and journal",
};

export default function RootLayout({ children}) {
    return (
        <html lang="en">
            <body>
                <Header />
                {children}
                <Footer />

                <Script 
                    src="https://kit.fontawesome.com/1165876da6.js"
                    strategy="afterInteractive"    
                />
            </body>
        </html>
    );
}