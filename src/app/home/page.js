'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const TEAM_NAME = 'Legends Stars Jura'
const TEAM_TAGLINE = 'Cricket Team'
const TEAM_LOGO_URL = ''

const colors = {
  bg1: '#050D09',
  bg2: '#0F2A1E',
  gold: '#C9A24B',
  text: '#F2F1EA',
  muted: '#9CA8A0',
}

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

  const glassCard = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px',
    padding: '18px',
    textAlign: 'center',
  }

  const navLink = { color: colors.text, textDecoration: 'none', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }

  function toggleTab(tab) {
    setActiveTab(activeTab === tab ? null : tab)
  }

  function PlayerCard({ player }) {
    return (
      <div style={glassCard}>
        {player.photo_url ? (
          <img src={player.photo_url} alt={player.name} style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block', border: `2px solid ${colors.gold}` }} />
        ) : (
          <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🏏</div>
        )}
        <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '4px 0 2px' }}>{player.name} {player.is_captain && '👑'}</p>
        <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>{player.role || 'N/A'} {player.jersey_number ? `· #${player.jersey_number}` : ''}</p>
      </div>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: `
        radial-gradient(ellipse 500px 300px at 20% 0%, rgba(255,255,255,0.14), transparent 60%),
        radial-gradient(ellipse 500px 300px at 80% 0%, rgba(255,255,255,0.12), transparent 60%),
        radial-gradient(ellipse 700px 400px at 50% 100%, rgba(201,162,75,0.10), transparent 65%),
        radial-gradient(circle at 50% 40%, rgba(201,162,75,0.05), transparent 70%),
        linear-gradient(180deg, ${colors.bg1} 0%, ${colors.bg2} 45%, ${colors.bg1} 100%)
      `,
      color: colors.text,
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      <div style={{ position: 'absolute', top: '-100px', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-100px', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />

      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(5,13,9,0.75)', backdropFilter: 'blur(10px)',
        padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {TEAM_LOGO_URL ? (
            <img src={TEAM_LOGO_URL} alt={TEAM_NAME} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏏</div>
          )}
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{TEAM_NAME}</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => toggleTab('team')} style={{ ...navLink, color: activeTab === 'team' ? colors.gold : colors.text }}>Team</button>
          <button onClick={() => toggleTab('coaches')} style={{ ...navLink, color: activeTab === 'coaches' ? colors.gold : colors.text }}>Coaches</button>
          <a href="/matches" style={navLink}>Matches</a>
          <a href="/request-match" style={{
            background: colors.gold, color: '#111', padding: '8px 18px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'
          }}>Request a Match</a>
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '70px 20px 50px', position: 'relative' }}>
        <div style={{ fontSize: '46px' }}>🏏</div>
        <h1 style={{ fontSize: '38px', fontWeight: 'bold', margin: '10px 0 4px' }}>{TEAM_NAME}</h1>
        <p style={{ color: colors.gold, letterSpacing: '1px', fontSize: '15px' }}>{TEAM_TAGLINE}</p>

        {nextMatch && (
          <div style={{ ...glassCard, maxWidth: '360px', margin: '30px auto 0' }}>
            <p style={{ fontSize: '12px', color: colors.gold, letterSpacing: '1px', margin: '0 0 8px' }}>NEXT MATCH</p>
            <p style={{ fontWeight: 'bold', fontSize: '17px', margin: '0 0 4px' }}>vs {nextMatch.opponent_team_name}</p>
            <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>{nextMatch.match_date} · {nextMatch.venue}</p>
          </div>
        )}

        {!activeTab && (
          <p style={{ color: colors.muted, fontSize: '13px', marginTop: '24px' }}>
            Tap <strong style={{ color: colors.gold }}>Team</strong> or <strong style={{ color: colors.gold }}>Coaches</strong> above to explore
          </p>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: colors.muted }}>Loading...</p>
      ) : (
        <>
          {activeTab === 'team' && (
            <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 20px 60px', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', justifyContent: 'center' }}>
                <button
                  onClick={() => setSquadView('Playing XI')}
                  style={{
                    padding: '8px 20px', borderRadius: '20px', border: `1px solid ${colors.gold}`,
                    background: squadView === 'Playing XI' ? colors.gold : 'transparent',
                    color: squadView === 'Playing XI' ? '#111' : colors.gold,
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
                  }}
                >
                  Playing XI
                </button>
                <button
                  onClick={() => setSquadView('Squad')}
                  style={{
                    padding: '8px 20px', borderRadius: '20px', border: `1px solid ${colors.gold}`,
                    background: squadView === 'Squad' ? colors.gold : 'transparent',
                    color: squadView === 'Squad' ? '#111' : colors.gold,
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
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
                    <div key={c.id} style={glassCard}>
                      {c.photo_url ? (
                        <img src={c.photo_url} alt={c.name} style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block', border: `2px solid ${colors.gold}` }} />
                      ) : (
                        <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🧑‍🏫</div>
                      )}
                      <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '4px 0 2px' }}>{c.name}</p>
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