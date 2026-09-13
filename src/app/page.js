'use client'

import { useRouter } from 'next/navigation'

export default function IntroPage() {
  const router = useRouter()

  const developerName = 'Mir Hamza Manzoor'
  const developerBio = 'Full Stack Developer & IT Boy'
  const developerPhoto = 'https://nepjpcxwowmalqwkjiee.supabase.co/storage/v1/object/sign/hamza%20photo/IMG-20250904-WA0010.jpg?token=eyJraWQiOiIyNDNjMTQ1Yy1lZDdjLTQyMjItYTc1OS0yMThlYjYxMDJhNzUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJoYW16YSBwaG90by9JTUctMjAyNTA5MDQtV0EwMDEwLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODkyMjcyODUsImV4cCI6MTgyMDc2MzI4NX0.avhdNxS1PDCwUR9cnrQPNJUTGMp5crUhO4eXKlVRs3veppq2cwqiMRwhKJVysiiI3AW-SnYDUOcP_XBCW6VUaQ'
  const whatsappLink = 'https://wa.me/923558396496'

  return (
    <>
      <style>{`
        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 0 14px rgba(124,58,237,0); }
        }
        .fade-1 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.1s; }
        .fade-2 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.3s; }
        .fade-3 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.5s; }
        .fade-4 { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.7s; }
        .enter-btn { transition: transform 0.2s ease; animation: pulseGlow 2.4s infinite; }
        .enter-btn:hover { transform: scale(1.06); }
        .blob { position: absolute; border-radius: 50%; filter: blur(50px); animation: floatBlob 10s ease-in-out infinite; }
      `}</style>

      <main style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Segoe UI', Arial, sans-serif",
        background: '#F8F7FF',
        padding: '20px',
        textAlign: 'center',
      }}>
        <div className="blob" style={{ width: '260px', height: '260px', background: '#7C3AED', opacity: 0.25, top: '-60px', left: '-60px' }} />
        <div className="blob" style={{ width: '300px', height: '300px', background: '#EC4899', opacity: 0.2, bottom: '-80px', right: '-60px', animationDelay: '2s' }} />
        <div className="blob" style={{ width: '200px', height: '200px', background: '#3B82F6', opacity: 0.2, top: '40%', right: '10%', animationDelay: '4s' }} />

        <img
          className="fade-1"
          src={developerPhoto}
          alt={developerName}
          style={{
            position: 'relative', zIndex: 1,
            width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 20%',
            marginBottom: '22px', border: '4px solid white',
            boxShadow: '0 8px 30px rgba(124,58,237,0.25)',
          }}
        />

        <h1 className="fade-2" style={{ position: 'relative', zIndex: 1, fontSize: '30px', fontWeight: 'bold', margin: '0 0 8px', color: '#1E1B4B' }}>
          {developerName}
        </h1>

        <p className="fade-3" style={{
          position: 'relative', zIndex: 1,
          background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontSize: '15px', fontWeight: 'bold', marginBottom: '24px', maxWidth: '360px',
        }}>
          {developerBio}
        </p>

        <div className="fade-3" style={{ position: 'relative', zIndex: 1, marginBottom: '34px' }}>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
            color: '#25d366', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold',
          }}>
            💬 WhatsApp
          </a>
        </div>

        <button
          className="fade-4 enter-btn"
          onClick={() => router.push('/home')}
          style={{
            position: 'relative', zIndex: 1,
            padding: '15px 42px',
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
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
    </>
  )
}