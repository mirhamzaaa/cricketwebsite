'use client'

import { useRouter } from 'next/navigation'

export default function IntroPage() {
  const router = useRouter()

  const developerName = 'Mir Hamza Manzoor'
  const developerBio = 'Full Stack Developer & IT Boy'
  const developerPhoto = 'https://nepjpcxwowmalqwkjiee.supabase.co/storage/v1/object/sign/hamza%20photo/IMG-20250904-WA0010.jpg?token=eyJraWQiOiIyNDNjMTQ1Yy1lZDdjLTQyMjItYTc1OS0yMThlYjYxMDJhNzUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJoYW16YSBwaG90by9JTUctMjAyNTA5MDQtV0EwMDEwLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODkyMjcyODUsImV4cCI6MTgyMDc2MzI4NX0.avhdNxS1PDCwUR9cnrQPNJUTGMp5crUhO4eXKlVRs3veppq2cwqiMRwhKJVysiiI3AW-SnYDUOcP_XBCW6VUaQ'
  const whatsappLink = 'https://wa.me/923558396496'

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial',
      backgroundColor: '#111',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
    }}>
      <img
        src={developerPhoto}
        alt={developerName}
        style={{ width: '180px', height: 'auto', maxHeight: '220px', borderRadius: '16px', objectFit: 'contain', marginBottom: '20px', border: '3px solid #0070f3' }}
      />

      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{developerName}</h1>
      <p style={{ fontSize: '16px', color: '#ccc', marginBottom: '20px', maxWidth: '400px' }}>{developerBio}</p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', fontSize: '14px', textDecoration: 'none' }}>
          WhatsApp
        </a>
      </div>

      <button
        onClick={() => router.push('/home')}
        style={{
          padding: '14px 40px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Enter Website →
      </button>
    </main>
  )
}