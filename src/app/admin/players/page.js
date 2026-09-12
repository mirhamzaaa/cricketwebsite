'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PlayersPage() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState('')
  const [role, setRole] = useState('')
  const [battingStyle, setBattingStyle] = useState('')
  const [bowlingStyle, setBowlingStyle] = useState('')
  const [isCaptain, setIsCaptain] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [squadStatus, setSquadStatus] = useState('Squad')
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
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
    fetchPlayers()
  }

  async function fetchPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setPlayers(data)
    setLoading(false)
  }

  async function uploadPhoto() {
    if (!photoFile) return photoUrl

    setUploading(true)
    const fileExt = photoFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('player-photos')
      .upload(fileName, photoFile)

    setUploading(false)

    if (uploadError) {
      alert('Error uploading photo: ' + uploadError.message)
      return photoUrl
    }

    const { data } = supabase.storage
      .from('player-photos')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const finalPhotoUrl = await uploadPhoto()

    const playerData = {
      name,
      jersey_number: jerseyNumber,
      role,
      batting_style: battingStyle,
      bowling_style: bowlingStyle,
      is_captain: isCaptain,
      photo_url: finalPhotoUrl,
      squad_status: squadStatus,
    }

    if (editingId) {
      const { error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', editingId)

      if (error) {
        alert('Error updating player: ' + error.message)
        return
      }
    } else {
      const { error } = await supabase
        .from('players')
        .insert([playerData])

      if (error) {
        alert('Error adding player: ' + error.message)
        return
      }
    }

    resetForm()
    fetchPlayers()
  }

  function handleEdit(player) {
    setEditingId(player.id)
    setName(player.name || '')
    setJerseyNumber(player.jersey_number || '')
    setRole(player.role || '')
    setBattingStyle(player.batting_style || '')
    setBowlingStyle(player.bowling_style || '')
    setIsCaptain(player.is_captain || false)
    setPhotoUrl(player.photo_url || '')
    setPhotoFile(null)
    setSquadStatus(player.squad_status || 'Squad')
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this player?')) return

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting player: ' + error.message)
    } else {
      fetchPlayers()
    }
  }

  function resetForm() {
    setEditingId(null)
    setName('')
    setJerseyNumber('')
    setRole('')
    setBattingStyle('')
    setBowlingStyle('')
    setIsCaptain(false)
    setPhotoUrl('')
    setPhotoFile(null)
    setSquadStatus('Squad')
  }

  if (loading) {
    return <p style={{ padding: '40px', fontFamily: 'Arial' }}>Loading...</p>
  }

  const inputStyle = { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white', color: 'black' }
  const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>🏏 Manage Players</h1>
        <a href="/admin/dashboard" style={{ color: '#0070f3' }}>← Back to Dashboard</a>
      </div>

      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>{editingId ? 'Edit Player' : 'Add New Player'}</h3>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Player Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            style={inputStyle}
          />
          {photoUrl && !photoFile && (
            <div style={{ marginTop: '8px' }}>
              <img src={photoUrl} alt="Current" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              <p style={{ fontSize: '12px', color: '#666' }}>Current photo (choose a new file to replace)</p>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Jersey Number</label>
          <input type="number" value={jerseyNumber} onChange={(e) => setJerseyNumber(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="">Select role</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-Rounder">All-Rounder</option>
            <option value="Wicket-Keeper">Wicket-Keeper</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Batting Style</label>
          <select value={battingStyle} onChange={(e) => setBattingStyle(e.target.value)} style={inputStyle}>
            <option value="">Select batting style</option>
            <option value="Right-hand Bat">Right-hand Bat</option>
            <option value="Left-hand Bat">Left-hand Bat</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Bowling Style</label>
          <select value={bowlingStyle} onChange={(e) => setBowlingStyle(e.target.value)} style={inputStyle}>
            <option value="">Select bowling style</option>
            <option value="Right-arm Fast">Right-arm Fast</option>
            <option value="Right-arm Medium">Right-arm Medium</option>
            <option value="Right-arm Spin">Right-arm Spin</option>
            <option value="Left-arm Fast">Left-arm Fast</option>
            <option value="Left-arm Spin">Left-arm Spin</option>
            <option value="None">None (Pure Batsman)</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Squad Status</label>
          <select value={squadStatus} onChange={(e) => setSquadStatus(e.target.value)} style={inputStyle}>
            <option value="Playing XI">Playing XI (Current Team)</option>
            <option value="Squad">Squad (Reserve)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="captain"
            checked={isCaptain}
            onChange={(e) => setIsCaptain(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <label htmlFor="captain" style={{ fontSize: '14px', fontWeight: 'bold' }}>Mark as Team Captain</label>
        </div>

        <button type="submit" disabled={uploading} style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
          {uploading ? 'Uploading...' : editingId ? 'Update Player' : 'Add Player'}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} style={{ padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </form>

      <h3 style={{ marginBottom: '15px' }}>All Players ({players.length})</h3>

      {players.length === 0 ? (
        <p>No players added yet.</p>
      ) : (
        players.map((player) => (
          <div key={player.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {player.photo_url && (
                <img src={player.photo_url} alt={player.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div>
                <strong>{player.name}</strong> {player.is_captain && '👑 (Captain)'} — Jersey #{player.jersey_number || 'N/A'}
                <br />
                <span style={{ fontSize: '13px', color: '#666' }}>
                  {player.role || 'N/A'} | {player.batting_style || 'N/A'} | {player.bowling_style || 'N/A'} | <strong>{player.squad_status || 'Squad'}</strong>
                </span>
              </div>
            </div>
            <div>
              <button onClick={() => handleEdit(player)} style={{ padding: '6px 12px', marginRight: '8px', backgroundColor: '#f0a500', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(player.id)} style={{ padding: '6px 12px', backgroundColor: '#e00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  )
}