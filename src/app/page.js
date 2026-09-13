'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const TEAM_NAME = 'Legends Stars Jura'
const TEAM_TAGLINE = 'Cricket Team'
const TEAM_LOGO_URL = ''

const colors = {
  bg: '#F8F7FF',
  purple: '#7C3AED',
  darkBlue: '#1E1B4B',
  pink: '#EC4899',
  blue: '#3B82F6',
  text: '#1E1B4B',
  muted: '#6B7280',
  white: '#FFFFFF',
}

const gradient = `linear-gradient(135deg, ${colors.purple}, ${colors.pink})`

export default function HomePage() {
  const [players, setPlayers] = useState([])
  const [coaches, setCoaches] = useState([])
  const [nextMatch, setNextMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(null)
  const [squadView, setSquadView] = useState('Playing XI')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [playersRes, coachesRes, matchesRes] = await Promise.all([
      supabase.from('players').select('*').order('jersey_number', { ascending: true }),
      supabase.from('coaches').select('*'),
      supabase.from('matches').select('*').eq('status', 'SCHEDULED').order('match_date', { ascending: true }).limit(1),
    ])

    if (!playersRes.error) setPlayers(playersRes.data)
    if (!coachesRes.error) setCoaches(coachesRes.data)
    if (!matchesRes.error && matchesRes.data.length > 0) setNextMatch(matchesRes.data[0])
    setLoading(false)
  }

  const playingXI = players.filter(p => p.squad_status === 'Playing XI')
  const squad = players.filter(p => p.squad_status !== 'Playing XI')
  const shownPlayers = squadView === 'Playing XI' ? playingXI : squad

  const card = {
    background: colors.white,
    borderRadius: '18px',
    padding: '18px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(124, 58, 237, 0.08)',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  }

  const navLink = { color: colors.text, textDecoration: 'none', fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }

  function toggleTab(tab) {
    setActiveTab(activeTab === tab ? null : tab)
  }

  function PlayerCard({ player }) {
    return (
      <div style={card}>
        {player.photo_url ? (
          <img src={player.photo_url} alt={player.name} style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block', border: `3px solid transparent`, backgroundImage: gradient, backgroundOrigin: 'border-box', backgroundClip: 'content-box, border-box' }} />
        ) : (
          <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: gradient, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🏏</div>
        )}
        <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '4px 0 2px', color: colors.darkBlue }}>{player.name} {player.is_captain && '👑'}</p>
        <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>{player.role || 'N/A'} {player.jersey_number ? `· #${player.jersey_number}` : ''}</p>
      </div>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 10% 10%, rgba(124,58,237,0.08), transparent 40%),
        radial-gradient(circle at 90% 20%, rgba(236,72,153,0.08), transparent 40%),
        radial-gradient(circle at 50% 90%, rgba(59,130,246,0.06), transparent 50%),
        ${colors.bg}
      `,
      color: colors.text,
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)',
        padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(124,58,237,0.1)', flexWrap: 'wrap', gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {TEAM_LOGO_URL ? (
            <img src={TEAM_LOGO_URL} alt={TEAM_NAME} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏏</div>
          )}
          <span style={{ fontWeight: 'bold', fontSize: '16px', color: colors.darkBlue }}>{TEAM_NAME}</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => toggleTab('team')} style={{ ...navLink, color: activeTab === 'team' ? colors.purple : colors.text }}>Team</button>
          <button onClick={() => toggleTab('coaches')} style={{ ...navLink, color: activeTab === 'coaches' ? colors.purple : colors.text }}>Coaches</button>
          <a href="/matches" style={navLink}>Matches</a>
          <a href="/request-match" style={{
            background: gradient, color: 'white', padding: '8px 18px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'
          }}>Request a Match</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '70px 20px 50px' }}>
        <div style={{ fontSize: '46px' }}>🏏</div>
        <h1 style={{ fontSize: '38px', fontWeight: 'bold', margin: '10px 0 4px', color: colors.darkBlue }}>{TEAM_NAME}</h1>
        <p style={{
          background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '1px', fontSize: '15px', fontWeight: 'bold',
        }}>{TEAM_TAGLINE}</p>

        {nextMatch && (
          <div style={{ ...card, maxWidth: '360px', margin: '30px auto 0' }}>
            <p style={{ fontSize: '12px', color: colors.purple, letterSpacing: '1px', margin: '0 0 8px', fontWeight: 'bold' }}>NEXT MATCH</p>
            <p style={{ fontWeight: 'bold', fontSize: '17px', margin: '0 0 4px', color: colors.darkBlue }}>vs {nextMatch.opponent_team_name}</p>
            <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>{nextMatch.match_date} · {nextMatch.venue}</p>
          </div>
        )}

        {!activeTab && (
          <p style={{ color: colors.muted, fontSize: '13px', marginTop: '24px' }}>
            Tap <strong style={{ color: colors.purple }}>Team</strong> or <strong style={{ color: colors.pink }}>Coaches</strong> above to explore
          </p>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: colors.muted }}>Loading...</p>
      ) : (
        <>
          {activeTab === 'team' && (
            <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 20px 60px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', justifyContent: 'center' }}>
                <button
                  onClick={() => setSquadView('Playing XI')}
                  style={{
                    padding: '8px 20px', borderRadius: '20px', border: 'none',
                    background: squadView === 'Playing XI' ? gradient : colors.white,
                    color: squadView === 'Playing XI' ? 'white' : colors.purple,
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
                    boxShadow: '0 2px 8px rgba(124,58,237,0.15)',
                  }}
                >
                  Playing XI
                </button>
                <button
                  onClick={() => setSquadView('Squad')}
                  style={{
                    padding: '8px 20px', borderRadius: '20px', border: 'none',
                    background: squadView === 'Squad' ? gradient : colors.white,
                    color: squadView === 'Squad' ? 'white' : colors.purple,
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
                    boxShadow: '0 2px 8px rgba(124,58,237,0.15)',
                  }}
                >
                  Full Squad
                </button>
              </div>

              {shownPlayers.length === 0 ? (
                <p style={{ color: colors.muted, textAlign: 'center' }}>No players in this list yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '18px' }}>
                  {shownPlayers.map((p) => <PlayerCard key={p.id} player={p} />)}
                </div>
              )}
            </section>
          )}

          {activeTab === 'coaches' && (
            <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 20px 60px' }}>
              {coaches.length === 0 ? (
                <p style={{ color: colors.muted, textAlign: 'center' }}>No coaches added yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '18px' }}>
                  {coaches.map((c) => (
                    <div key={c.id} style={card}>
                      {c.photo_url ? (
                        <img src={c.photo_url} alt={c.name} style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block' }} />
                      ) : (
                        <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: gradient, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🧑‍🏫</div>
                      )}
                      <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '4px 0 2px', color: colors.darkBlue }}>{c.name}</p>
                      <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>{c.role || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </main>
  )
}