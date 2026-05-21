import './globals.css'
export const metadata = { title: 'WC2026 予想ゲーム', description: '2026 FIFAワールドカップ予想ゲーム' }
export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
