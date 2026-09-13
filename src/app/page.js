'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function IntroPage() {
  const router = useRouter()

  const developerName = 'Mir Hamza Manzoor'
  const developerBio = 'Full Stack Developer'
  const developerPhoto = 'https://nepjpcxwowmalqwkjiee.supabase.co/storage/v1/object/sign/hamza%20photo/IMG-20250904-WA0010.jpg?token=eyJraWQiOiIyNDNjMTQ1Yy1lZDdjLTQyMjItYTc1OS0yMThlYjYxMDJhNzUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJoYW16YSBwaG90by9JTUctMjAyNTA5MDQtV0EwMDEwLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODkyMjcyODUsImV4cCI6MTgyMDc2MzI4NX0.avhdNxS1PDCwUR9cnrQPNJUTGMp5crUhO4eXKlVRs3veppq2cwqiMRwhKJVysiiI3AW-SnYDUOcP_XBCW6VUaQ'
  const whatsappLink = 'https://wa.me/923558396496'

  const [showPhoto, setShowPhoto] = useState(false)
  const [typedName, setTypedName] = useState('')
  const [doneTyping, setDoneTyping] = useState(false)
  const [showBio, setShowBio] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Step 1: show photo
    const t0 = setTimeout(() => setShowPhoto(true), 200)

    // Step 2: start typing name after photo appears
    const t1 = setTimeout(() => {
      let i = 0
      const typeInterval = setInterval(() => {
        i++
        setTypedName(developerName.slice(0, i))
        if (i >= developerName.length) {
          clearInterval(typeInterval)
          setDoneTyping(true)
          setTimeout(() => setShowBio(true), 400)
          setTimeout(() => setShowButton(true), 1200)
        }
      }, 150)
    }, 1000)

    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
    }
  }, [])

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
        @keyframes photoPop {
          0% { opacity: 0; transform: scale(0.6) rotate(-8deg); }
          60% { opacity: 1; transform: scale(1.08) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7) translateY(20px); }
          60% { opacity: 1; transform: scale(1.08) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 0 16px rgba(124,58,237,0); }
        }
        .photo-in { animation: photoPop 1.1s ease both; }
        .bio-in { animation: fadeSlideUp 1s ease both; }
        .btn-in { animation: popIn 0.9s ease both, pulseGlow 2.8s infinite 0.9s; }
        .btn-in:hover { transform: scale(1.06); }
        .blob { position: absolute; border-radius: 50%; filter: blur(50px); animation: floatBlob 14s ease-in-out infinite; }
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
        <div className="blob" style={{ width: '300px', height: '300px', background: '#EC4899', opacity: 0.2, bottom: '-80px', right: '-60px', animationDelay: '3s' }} />
        <div className="blob" style={{ width: '200px', height: '200px', background: '#3B82F6', opacity: 0.2, top: '40%', right: '10%', animationDelay: '6s' }} />

        {showPhoto && (
          <img
            className="photo-in"
            src={developerPhoto}
            alt={developerName}
            style={{
              position: 'relative', zIndex: 1,
              width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 20%',
              marginBottom: '22px', border: '4px solid white',
              boxShadow: '0 8px 30px rgba(124,58,237,0.25)',
            }}
          />
        )}

        <h1 style={{ position: 'relative', zIndex: 1, fontSize: '30px', fontWeight: 'bold', margin: '0 0 8px', color: '#1E1B4B', minHeight: '40px' }}>
          {typedName}
        </h1>

        {showBio && (
          <p className="bio-in" style={{
            position: 'relative', zIndex: 1,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontSize: '15px', fontWeight: 'bold', marginBottom: '24px', maxWidth: '360px',
          }}>
            {developerBio}
          </p>
        )}

        {showBio && (
          <div className="bio-in" style={{ position: 'relative', zIndex: 1, marginBottom: '34px' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              color: '#25d366', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold',
            }}>
              💬 WhatsApp
            </a>
          </div>
        )}

        {showButton && (
          <button
            className="btn-in"
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
              transition: 'transform 0.2s ease',
            }}
          >
            Enter Website →
          </button>
        )}
      </main>
    </>
  )
}