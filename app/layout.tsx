import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
