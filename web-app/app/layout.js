import '../styles/globals.css'
import { AuthProvider } from '../hooks/useAuth'

export const metadata = {
  title: 'SIH Dashboard',
  description: 'Slope Monitoring & Risk Assessment System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

