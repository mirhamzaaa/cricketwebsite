'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const colors = {
  bg1: '#050D09',
  bg2: '#0F2A1E',
  gold: '#C9A24B',
  text: '#F2F1EA',
  muted: '#9CA8A0',
}

export default function PublicMatchesPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchMatches()
  }, [])

  async function fetchMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: true })

    if (!error) setMatches(data)
    setLoading(false)
  }

  const upcoming = matches.filter(m => m.status === 'SCHEDULED')
  const completed = matches.filter(m => m.status === 'COMPLETED').reverse()

  const glassCard = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '16px',
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: `radial-gradient(circle at 15% 10%, rgba(255,255,255,0.08), transparent 40%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.06), transparent 35%), linear-gradient(180deg, ${colors.bg1} 0%, ${colors.bg2} 50%, ${colors.bg1} 100%)`,
      color: colors.text,
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(5,13,9,0.8)', backdropFilter: 'blur(10px)',
        padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <a href="/home" style={{ color: colors.text, textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>← Home</a>
        <a href="/request-match" style={{
          background: colors.gold, color: '#111', padding: '8px 18px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'
        }}>Request a Match</a>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '30px', marginBottom: '30px' }}>Matches</h1>

        {loading ? (
          <p style={{ color: colors.muted }}>Loading...</p>
        ) : (
          <>
            <h2 style={{ color: colors.gold, fontSize: '20px', marginBottom: '14px' }}>Upcoming</h2>
            {upcoming.length === 0 ? (
              <p style={{ color: colors.muted, marginBottom: '30px' }}>No upcoming matches scheduled.</p>
            ) : (
              upcoming.map((m) => (
                <div key={m.id} style={glassCard}>
                  <h3 style={{ margin: '0 0 8px' }}>vs {m.opponent_team_name}</h3>
                  <p style={{ color: colors.muted, fontSize: '14px', margin: '2px 0' }}>{m.match_date} · {m.match_time || 'Time TBD'}</p>
                  <p style={{ color: colors.muted, fontSize: '14px', margin: '2px 0' }}>📍 {m.venue}</p>
                </div>
              ))
            )}

            <h2 style={{ color: colors.gold, fontSize: '20px', margin: '30px 0 14px' }}>Results</h2>
            {completed.length === 0 ? (
              <p style={{ color: colors.muted }}>No completed matches yet.</p>
            ) : (
              completed.map((m) => (
                <div key={m.id} style={glassCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
                    <div>
                      <h3 style={{ margin: '0 0 6px' }}>vs {m.opponent_team_name}</h3>
                      <p style={{ color: colors.gold, fontSize: '15px', margin: 0, fontWeight: 'bold' }}>🏆 {m.winner}</p>
                    </div>
                    <span style={{ color: colors.muted }}>{expandedId === m.id ? '▲' : '▼'}</span>
                  </div>

                  <p style={{ fontSize: '14px', color: colors.text, marginTop: '8px' }}>
                    {m.team1_score} vs {m.team2_score}
                  </p>

                  {expandedId === m.id && (
                    <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px', fontSize: '13px' }}>
                      {m.player_of_match && <p><strong>Player of the Match:</strong> {m.player_of_match}</p>}
                      {m.match_summary && <p style={{ color: colors.muted }}>{m.match_summary}</p>}

                      {m.our_batting?.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <strong>Our Batting</strong>
                          <ul style={{ paddingLeft: '18px', margin: '6px 0' }}>
                            {m.our_batting.map((p, i) => <li key={i}>{p.name} — {p.runs} ({p.balls} balls)</li>)}
                          </ul>
                        </div>
                      )}
                      {m.our_bowling?.length > 0 && (
                        <div>
                          <strong>Our Bowling</strong>
                          <ul style={{ paddingLeft: '18px', margin: '6px 0' }}>
                            {m.our_bowling.map((p, i) => <li key={i}>{p.name} — {p.overs} ov, {p.wickets} wkts</li>)}
                          </ul>
                        </div>
                      )}
                      {m.opponent_batting?.length > 0 && (
                        <div>
                          <strong>{m.opponent_team_name} Batting</strong>
                          <ul style={{ paddingLeft: '18px', margin: '6px 0' }}>
                            {m.opponent_batting.map((p, i) => <li key={i}>{p.name} — {p.runs} ({p.balls} balls)</li>)}
                          </ul>
                        </div>
                      )}
                      {m.opponent_bowling?.length > 0 && (
                        <div>
                          <strong>{m.opponent_team_name} Bowling</strong>
                          <ul style={{ paddingLeft: '18px', margin: '6px 0' }}>
                            {m.opponent_bowling.map((p, i) => <li key={i}>{p.name} — {p.overs} ov, {p.wickets} wkts</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </main>
  )
}