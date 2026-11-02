import type { Metadata } from "next";
import { Geist_Mono, Oswald, Playwrite_IT_Moderna, Work_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Executive FinEd Sovereign: Work Sans for reading, Oswald for headings and
// metrics, Playwrite for short editorial accents only.
const workSans = Work_Sans({ variable: "--font-sans", subsets: ["latin"] });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"] });
const playwrite = Playwrite_IT_Moderna({ variable: "--font-script", weight: "400" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "BankPrep", template: "%s · BankPrep" },
  description: "Topic-wise practice for Indian banking examinations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${workSans.variable} ${oswald.variable} ${playwrite.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
