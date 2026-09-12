'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RequestMatch() {
  const [opponentTeamName, setOpponentTeamName] = useState('')
  const [captainName, setCaptainName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [proposedDate, setProposedDate] = useState('')
  const [proposedTime, setProposedTime] = useState('')
  const [additionalMessage, setAdditionalMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase.from('match_requests').insert([
      {
        opponent_team_name: opponentTeamName,
        captain_name: captainName,
        phone_number: whatsappNumber,
        proposed_date: proposedDate,
        proposed_time: proposedTime,
        additional_message: additionalMessage,
        status: 'REQUESTED',
      },
    ])

    setSubmitting(false)

    if (error) {
      alert('Error submitting request: ' + error.message)
    } else {
      setSubmitted(true)
    }
  }

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '12px' }
  const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }

  if (submitted) {
    return (
      <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '15px' }}>✅ Request Submitted!</h1>
        <p>Thank you! Your match request has been sent. Our admin will review it and get back to you soon.</p>
        <a href="/home" style={{ color: '#0070f3', marginTop: '20px', display: 'inline-block' }}>← Back to Home</a>
      </main>
    )
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>🏏 Request a Match</h1>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Opponent Team Name *</label>
        <input type="text" value={opponentTeamName} onChange={(e) => setOpponentTeamName(e.target.value)} required style={inputStyle} />

        <label style={labelStyle}>Captain Name</label>
        <input type="text" value={captainName} onChange={(e) => setCaptainName(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>WhatsApp Number *</label>
        <input type="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} required placeholder="03xxxxxxxxx" style={inputStyle} />

        <label style={labelStyle}>Proposed Date</label>
        <input type="date" value={proposedDate} onChange={(e) => setProposedDate(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Proposed Time</label>
        <input type="text" value={proposedTime} onChange={(e) => setProposedTime(e.target.value)} placeholder="e.g. Shaam 5 baje" style={inputStyle} />

        <label style={labelStyle}>Additional Message</label>
        <textarea value={additionalMessage} onChange={(e) => setAdditionalMessage(e.target.value)} rows={4} style={inputStyle} />

        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          {submitting ? 'Submitting...' : 'Submit Match Request'}
        </button>
      </form>
    </main>
  )
}