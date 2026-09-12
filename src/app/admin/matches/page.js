'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const inputStyle = { padding: '7px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white', color: 'black' }
const smallBtn = { padding: '5px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '13px' }

function ScoreTable({ title, rows, onUpdate, onAdd, onRemove, type }) {
  return (
    <div style={{ marginBottom: '15px' }}>
      <h5 style={{ marginBottom: '8px' }}>{title}</h5>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder={type === 'batting' ? 'Player name' : 'Bowler name'}
            value={row.name}
            onChange={(e) => onUpdate(i, 'name', e.target.value)}
            style={{ ...inputStyle, flex: 2 }}
          />
          {type === 'batting' ? (
            <>
              <input type="number" placeholder="Runs" value={row.runs} onChange={(e) => onUpdate(i, 'runs', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <input type="number" placeholder="Balls" value={row.balls} onChange={(e) => onUpdate(i, 'balls', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            </>
          ) : (
            <>
              <input type="text" placeholder="Overs" value={row.overs} onChange={(e) => onUpdate(i, 'overs', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <input type="number" placeholder="Runs given" value={row.runs} onChange={(e) => onUpdate(i, 'runs', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <input type="number" placeholder="Wickets" value={row.wickets} onChange={(e) => onUpdate(i, 'wickets', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            </>
          )}
          <button onClick={() => onRemove(i)} style={{ ...smallBtn, backgroundColor: '#e00', color: 'white' }}>✕</button>
        </div>
      ))}
      <button onClick={onAdd} style={{ ...smallBtn, backgroundColor: '#0070f3', color: 'white' }}>
        + Add {type === 'batting' ? 'Player' : 'Bowler'}
      </button>
    </div>
  )
}

export default function MatchesPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [resultId, setResultId] = useState(null)

  const [team1Score, setTeam1Score] = useState('')
  const [team2Score, setTeam2Score] = useState('')
  const [winner, setWinner] = useState('')
  const [playerOfMatch, setPlayerOfMatch] = useState('')
  const [matchSummary, setMatchSummary] = useState('')

  const [ourBatting, setOurBatting] = useState([{ name: '', runs: '', balls: '' }])
  const [ourBowling, setOurBowling] = useState([{ name: '', overs: '', runs: '', wickets: '' }])
  const [oppBatting, setOppBatting] = useState([{ name: '', runs: '', balls: '' }])
  const [oppBowling, setOppBowling] = useState([{ name: '', overs: '', runs: '', wickets: '' }])

  const router = useRouter()

  useEffect(() => {
    checkUserAndLoad()
  }, [])

  async function checkUserAndLoad() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin/login')
      return
    }
    fetchMatches()
  }

  async function fetchMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setMatches(data)
    setLoading(false)
  }

  function startResult(match) {
    setResultId(match.id)
    setTeam1Score('')
    setTeam2Score('')
    setWinner('')
    setPlayerOfMatch('')
    setMatchSummary('')
    setOurBatting([{ name: '', runs: '', balls: '' }])
    setOurBowling([{ name: '', overs: '', runs: '', wickets: '' }])
    setOppBatting([{ name: '', runs: '', balls: '' }])
    setOppBowling([{ name: '', overs: '', runs: '', wickets: '' }])
  }

  function cancelResult() {
    setResultId(null)
  }

  function updateRow(list, setList, index, field, value) {
    const updated = list.map((row, i) => i === index ? { ...row, [field]: value } : row)
    setList(updated)
  }

  function addRow(list, setList, emptyRow) {
    setList([...list, emptyRow])
  }

  function removeRow(list, setList, index) {
    setList(list.filter((_, i) => i !== index))
  }

  async function saveResult(match) {
    if (!winner) {
      alert('Please select the winner')
      return
    }

    const { error } = await supabase
      .from('matches')
      .update({
        team1_score: team1Score,
        team2_score: team2Score,
        winner: winner,
        player_of_match: playerOfMatch,
        match_summary: matchSummary,
        our_batting: ourBatting.filter(p => p.name),
        our_bowling: ourBowling.filter(p => p.name),
        opponent_batting: oppBatting.filter(p => p.name),
        opponent_bowling: oppBowling.filter(p => p.name),
        status: 'COMPLETED',
      })
      .eq('id', match.id)

    if (error) {
      alert('Error saving result: ' + error.message)
      return
    }

    alert('Result saved successfully!')
    setResultId(null)
    fetchMatches()
  }

  async function cancelMatch(id) {
    if (!confirm('Cancel this match?')) return
    const { error } = await supabase.from('matches').update({ status: 'CANCELLED' }).eq('id', id)
    if (!error) fetchMatches()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this match permanently?')) return
    const { error } = await supabase.from('matches').delete().eq('id', id)
    if (!error) fetchMatches()
  }

  function statusColor(status) {
    switch (status) {
      case 'SCHEDULED': return '#0070f3'
      case 'COMPLETED': return '#0a0'
      case 'CANCELLED': return '#e00'
      default: return '#999'
    }
  }

  if (loading) {
    return <p style={{ padding: '40px', fontFamily: 'Arial' }}>Loading...</p>
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '850px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>🏟️ Matches</h1>
        <a href="/admin/dashboard" style={{ color: '#0070f3' }}>← Back to Dashboard</a>
      </div>

      {matches.length === 0 ? (
        <p>No matches scheduled yet. Accept a match request first.</p>
      ) : (
        matches.map((match) => (
          <div key={match.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '18px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>vs {match.opponent_team_name}</h3>
              <span style={{ backgroundColor: statusColor(match.status), color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                {match.status}
              </span>
            </div>

            <p style={{ fontSize: '14px', color: '#444', margin: '4px 0' }}>
              <strong>Date:</strong> {match.match_date || 'N/A'} &nbsp; <strong>Time:</strong> {match.match_time || 'N/A'}
            </p>
            <p style={{ fontSize: '14px', color: '#444', margin: '4px 0' }}>
              <strong>Venue:</strong> {match.venue || 'N/A'}
            </p>
            <p style={{ fontSize: '14px', color: '#444', margin: '4px 0' }}>
              <strong>Overs:</strong> {match.overs || 'N/A'} &nbsp; <strong>Fee:</strong> {match.match_fee || 'N/A'}
            </p>

            {match.status === 'COMPLETED' && (
              <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#f0fff0', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', margin: '2px 0' }}><strong>Score:</strong> {match.team1_score} vs {match.team2_score}</p>
                <p style={{ fontSize: '14px', margin: '2px 0' }}><strong>Winner:</strong> 🏆 {match.winner}</p>
                {match.player_of_match && <p style={{ fontSize: '14px', margin: '2px 0' }}><strong>Player of the Match:</strong> {match.player_of_match}</p>}
                {match.match_summary && <p style={{ fontSize: '14px', margin: '2px 0' }}><strong>Summary:</strong> {match.match_summary}</p>}

                {match.our_batting?.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Our Batting:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px', fontSize: '13px' }}>
                      {match.our_batting.map((p, i) => <li key={i}>{p.name} — {p.runs} runs ({p.balls} balls)</li>)}
                    </ul>
                  </div>
                )}
                {match.our_bowling?.length > 0 && (
                  <div>
                    <strong>Our Bowling:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px', fontSize: '13px' }}>
                      {match.our_bowling.map((p, i) => <li key={i}>{p.name} — {p.overs} overs, {p.runs} runs, {p.wickets} wickets</li>)}
                    </ul>
                  </div>
                )}
                {match.opponent_batting?.length > 0 && (
                  <div>
                    <strong>{match.opponent_team_name} Batting:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px', fontSize: '13px' }}>
                      {match.opponent_batting.map((p, i) => <li key={i}>{p.name} — {p.runs} runs ({p.balls} balls)</li>)}
                    </ul>
                  </div>
                )}
                {match.opponent_bowling?.length > 0 && (
                  <div>
                    <strong>{match.opponent_team_name} Bowling:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px', fontSize: '13px' }}>
                      {match.opponent_bowling.map((p, i) => <li key={i}>{p.name} — {p.overs} overs, {p.runs} runs, {p.wickets} wickets</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {resultId === match.id ? (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '10px' }}>Add Match Result</h4>

                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Our Team Total Score</label>
                <input type="text" value={team1Score} onChange={(e) => setTeam1Score(e.target.value)} style={{ ...inputStyle, width: '100%', marginBottom: '10px' }} placeholder="e.g. 180/6 (20 overs)" />

                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{match.opponent_team_name} Total Score</label>
                <input type="text" value={team2Score} onChange={(e) => setTeam2Score(e.target.value)} style={{ ...inputStyle, width: '100%', marginBottom: '15px' }} placeholder="e.g. 165/8 (20 overs)" />

                <ScoreTable
                  title="🏏 Our Batting"
                  rows={ourBatting}
                  type="batting"
                  onUpdate={(i, field, value) => updateRow(ourBatting, setOurBatting, i, field, value)}
                  onAdd={() => addRow(ourBatting, setOurBatting, { name: '', runs: '', balls: '' })}
                  onRemove={(i) => removeRow(ourBatting, setOurBatting, i)}
                />
                <ScoreTable
                  title="🎯 Our Bowling"
                  rows={ourBowling}
                  type="bowling"
                  onUpdate={(i, field, value) => updateRow(ourBowling, setOurBowling, i, field, value)}
                  onAdd={() => addRow(ourBowling, setOurBowling, { name: '', overs: '', runs: '', wickets: '' })}
                  onRemove={(i) => removeRow(ourBowling, setOurBowling, i)}
                />
                <ScoreTable
                  title={`🏏 ${match.opponent_team_name} Batting`}
                  rows={oppBatting}
                  type="batting"
                  onUpdate={(i, field, value) => updateRow(oppBatting, setOppBatting, i, field, value)}
                  onAdd={() => addRow(oppBatting, setOppBatting, { name: '', runs: '', balls: '' })}
                  onRemove={(i) => removeRow(oppBatting, setOppBatting, i)}
                />
                <ScoreTable
                  title={`🎯 ${match.opponent_team_name} Bowling`}
                  rows={oppBowling}
                  type="bowling"
                  onUpdate={(i, field, value) => updateRow(oppBowling, setOppBowling, i, field, value)}
                  onAdd={() => addRow(oppBowling, setOppBowling, { name: '', overs: '', runs: '', wickets: '' })}
                  onRemove={(i) => removeRow(oppBowling, setOppBowling, i)}
                />

                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Winner *</label>
                <select value={winner} onChange={(e) => setWinner(e.target.value)} style={{ ...inputStyle, width: '100%', marginBottom: '10px' }}>
                  <option value="">Select winner</option>
                  <option value="Our Team">Our Team</option>
                  <option value={match.opponent_team_name}>{match.opponent_team_name}</option>
                  <option value="Draw/Tie">Draw/Tie</option>
                </select>

                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Player of the Match</label>
                <input type="text" value={playerOfMatch} onChange={(e) => setPlayerOfMatch(e.target.value)} style={{ ...inputStyle, width: '100%', marginBottom: '10px' }} />

                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Match Summary</label>
                <textarea value={matchSummary} onChange={(e) => setMatchSummary(e.target.value)} rows={3} style={{ ...inputStyle, width: '100%', marginBottom: '10px' }} />

                <button onClick={() => saveResult(match)} style={{ padding: '8px 16px', marginRight: '8px', backgroundColor: '#0a0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Save Result
                </button>
                <button onClick={cancelResult} style={{ padding: '8px 16px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '12px' }}>
                {match.status === 'SCHEDULED' && (
                  <>
                    <button onClick={() => startResult(match)} style={{ padding: '6px 14px', marginRight: '8px', backgroundColor: '#0a0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      Add Result
                    </button>
                    <button onClick={() => cancelMatch(match.id)} style={{ padding: '6px 14px', marginRight: '8px', backgroundColor: '#e00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      Cancel Match
                    </button>
                  </>
                )}
                <button onClick={() => handleDelete(match.id)} style={{ padding: '6px 14px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </main>
  )
}