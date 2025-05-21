import type React from "react"
import "./globals.css"

export const metadata = {
  title: "Magical Music",
  description: "חווית מוזיקה יוקרתית",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
