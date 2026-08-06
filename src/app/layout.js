import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./Providers";

export const metadata = {
  title: "Student Marketplace",
  description: "A safe marketplace for university students to buy and sell.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
