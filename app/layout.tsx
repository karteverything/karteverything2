import "./globals.css";

export const metadata = {
    title: "KArt Everything",
    description: "Kat's portfolio and journal".
};

export default function RootLayout({ children}) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}