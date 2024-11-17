import './globals.css'

export const metadata = {
  title: 'Drive Express',
  description: 'Application de Drive alimentaire',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}