'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MatchRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
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

            <div style={{ marginTop: '12px' }}>
              {req.status !== 'ACCEPTED' && (
                <button
                  onClick={() => updateStatus(req.id, 'ACCEPTED')}
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
          </div>
        ))
      )}
    </main>
  )
}