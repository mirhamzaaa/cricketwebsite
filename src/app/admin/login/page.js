'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError('Login failed: ' + error.message)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'Arial' }}>
      <form onSubmit={handleLogin} style={{ width: '320px', padding: '30px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          🏏 Admin Login
        </h1>

        {error && (
          <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  )
}