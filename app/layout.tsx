import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "Vistagram",
  description: "Discover & Share Points of Interest",
};

const themeScript=`(function(){
  if(localStorage.theme==='dark' || (!localStorage.theme && matchMedia("(prefers-color-scheme: dark)").matches))
    document.documentElement.classList.add('dark');
}())`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:themeScript}} /></head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
