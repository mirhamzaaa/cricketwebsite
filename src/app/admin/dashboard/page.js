'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/admin/login')
    } else {
      setUser(user)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return <p style={{ padding: '40px', fontFamily: 'Arial' }}>Loading...</p>
  }

  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    transition: 'box-shadow 0.2s',
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>🏏 Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{ padding: '10px 20px', backgroundColor: '#e00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <p style={{ marginBottom: '20px' }}>Welcome, {user?.email}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <a href="/admin/players" style={cardStyle}>
          <h3>🧑‍🤝‍🧑 Players</h3>
          <p>Add, edit, or remove team players</p>
        </a>

        <a href="/admin/coaches" style={cardStyle}>
          <h3>🧑‍🏫 Coaches</h3>
          <p>Manage team coaches and staff</p>
        </a>

        <a href="/admin/requests" style={cardStyle}>
          <h3>📩 Match Requests</h3>
          <p>View and respond to match requests</p>
        </a>

        <a href="/admin/matches" style={cardStyle}>
          <h3>🏟️ Matches</h3>
          <p>Manage scheduled matches and results</p>
        </a>
      </div>
    </main>
  )
}