import type React from "react"
import "./globals.css"

import { Inter } from "next/font/google";
import type { Metadata } from "next";
// import { ThemeProvider } from "next-themes";
import { ThemeProvider } from "next-themes";


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Music Platform Login",
  description: "Login to the music platform as a user or administrator",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
