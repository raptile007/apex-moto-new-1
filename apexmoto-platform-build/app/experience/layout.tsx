import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "ApexMoto | Cinematic Experience",
  description: "Immerse yourself in the future of motorcycle performance through our cinematic 3D scroll experience.",
  openGraph: {
    title: "ApexMoto | Cinematic Experience",
    description: "Immerse yourself in the future of motorcycle performance.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#050505",
}

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
