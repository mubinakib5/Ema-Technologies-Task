import { Providers } from "@/providers";
import "./globals.css";

export const metadata = {
  title: "Expense Tracker",
  description: "Track your daily expenses across different categories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
