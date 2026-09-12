'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MatchRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [acceptingId, setAcceptingId] = useState(null)
  const [venue, setVenue] = useState('')
  const [overs, setOvers] = useState('')
  const [matchFee, setMatchFee] = useState('')
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
    fetchRequests()
  }

  async function fetchRequests() {
    const { data, error } = await supabase
      .from('match_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setRequests(data)
    setLoading(false)
  }

  function startAccepting(id) {
    setAcceptingId(id)
    setVenue('')
    setOvers('')
    setMatchFee('')
  }

  function cancelAccepting() {
    setAcceptingId(null)
  }

  async function confirmAccept(request) {
    if (!venue) {
      alert('Please enter a venue')
      return
    }

    // 1. Update request status to ACCEPTED
    const { error: reqError } = await supabase
      .from('match_requests')
      .update({ status: 'ACCEPTED' })
      .eq('id', request.id)

    if (reqError) {
      alert('Error updating request: ' + reqError.message)
      return
    }

    // 2. Create a new match entry
    const { error: matchError } = await supabase.from('matches').insert([
      {
        request_id: request.id,
        opponent_team_name: request.opponent_team_name,
        match_date: request.proposed_date,
        match_time: request.proposed_time,
        venue: venue,
        overs: overs,
        match_fee: matchFee,
        status: 'SCHEDULED',
      },
    ])

    if (matchError) {
      alert('Error creating match: ' + matchError.message)
      return
    }

    alert('Match scheduled successfully!')
    setAcceptingId(null)
    fetchRequests()
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from('match_requests')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('Error updating status: ' + error.message)
    } else {
      fetchRequests()
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this request permanently?')) return

    const { error } = await supabase
      .from('match_requests')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      fetchRequests()
    }
  }

  function statusColor(status) {
    switch (status) {
      case 'REQUESTED': return '#f0a500'
      case 'ACCEPTED': return '#0a0'
      case 'REJECTED': return '#e00'
      default: return '#999'
    }
  }

  if (loading) {
    return <p style={{ padding: '40px', fontFamily: 'Arial' }}>Loading...</p>
  }

  const inputStyle = { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>📩 Match Requests</h1>
        <a href="/admin/dashboard" style={{ color: '#0070f3' }}>← Back to Dashboard</a>
      </div>

      {requests.length === 0 ? (
        <p>No match requests yet.</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '18px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{req.opponent_team_name}</h3>
              <span style={{
                backgroundColor: statusColor(req.status),
                color: 'white',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {req.status}
              </span>
            </div>

            <p style={{ fontSize: '14px', color: '#444', margin: '4px 0' }}>
              <strong>Captain:</strong> {req.captain_name || 'N/A'}
            </p>
            <p style={{ fontSize: '14px', color: '#444', margin: '4px 0' }}>
              <strong>WhatsApp:</strong> {req.phone_number}
            </p>
            <p style={{ fontSize: '14px', color: '#444', margin: '4px 0' }}>
              <strong>Proposed Date:</strong> {req.proposed_date || 'N/A'} &nbsp;
              <strong>Time:</strong> {req.proposed_time || 'N/A'}
            </p>
            {req.additional_message && (
              <p style={{ fontSize: '14px', color: '#444', margin: '4px 0' }}>
                <strong>Message:</strong> {req.additional_message}
              </p>
            )}

            {/* Accept form (shows only when accepting this request) */}
            {acceptingId === req.id ? (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '10px' }}>Enter Match Details</h4>

                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Venue *</label>
                <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} style={inputStyle} placeholder="e.g. City Cricket Ground" />

                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Overs</label>
                <input type="number" value={overs} onChange={(e) => setOvers(e.target.value)} style={inputStyle} placeholder="e.g. 20" />

                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Match Fee</label>
                <input type="text" value={matchFee} onChange={(e) => setMatchFee(e.target.value)} style={inputStyle} placeholder="e.g. Rs. 5000" />

                <button
                  onClick={() => confirmAccept(req)}
                  style={{ padding: '8px 16px', marginRight: '8px', backgroundColor: '#0a0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Confirm & Schedule Match
                </button>
                <button
                  onClick={cancelAccepting}
                  style={{ padding: '8px 16px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '12px' }}>
                {req.status !== 'ACCEPTED' && (
                  <button
                    onClick={() => startAccepting(req.id)}
                    style={{ padding: '6px 14px', marginRight: '8px', backgroundColor: '#0a0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Accept
                  </button>
                )}
                {req.status !== 'REJECTED' && (
                  <button
                    onClick={() => updateStatus(req.id, 'REJECTED')}
                    style={{ padding: '6px 14px', marginRight: '8px', backgroundColor: '#e00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(req.id)}
                  style={{ padding: '6px 14px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
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