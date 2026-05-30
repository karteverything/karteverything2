import './globals.css';
import { ReactNode } from "react";
import LayoutContent from "@/components/LayoutContent";

export const metadata = {
    title: "KArt Everything",
    description: "Kat's portfolio and journal",
};

export default function RootLayout({ 
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <LayoutContent>
                    {children}
                </LayoutContent>
            </body>
        </html>
    );
}