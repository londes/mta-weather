import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import { StationProvider } from "../contexts/StationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Subway Arrivals & Weather",
  description: "Real-time wall-mounted dashboard displaying NYC weather forecasts and MTA G train arrivals",
  icons: {
    icon: '/NYCS-bull-trans-G-Std.svg',
    shortcut: '/NYCS-bull-trans-G-Std.svg',
    apple: '/NYCS-bull-trans-G-Std.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <StationProvider>
            {children}
          </StationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
