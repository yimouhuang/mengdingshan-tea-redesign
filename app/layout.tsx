import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Space_Grotesk, Syne } from "next/font/google"
import { AmbientSoundscapeProvider } from "@/components/ambient-soundscape"
import { StarTrail } from "@/components/star-trail"
import "./globals.css"
import "maplibre-gl/dist/maplibre-gl.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" })
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" })

export const metadata: Metadata = {
  title: "蒙顶山茶文化数字影像馆 | Mengding Mountain Tea Visual Archive",
  description: "A bilingual archive for Mengding Mountain tea photography and film."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geist.variable} ${geistMono.variable} ${inter.variable} ${spaceGrotesk.variable} ${syne.variable} font-sans antialiased`}
      >
        <AmbientSoundscapeProvider>
          {children}
          <StarTrail />
        </AmbientSoundscapeProvider>
      </body>
    </html>
  )
}
