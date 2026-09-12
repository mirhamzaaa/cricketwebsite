'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [bio, setBio] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
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
    fetchCoaches()
  }

  async function fetchCoaches() {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setCoaches(data)
    setLoading(false)
  }

  async function uploadPhoto() {
    if (!photoFile) return photoUrl

    setUploading(true)
    const fileExt = photoFile.name.split('.').pop()
    const fileName = `coach-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

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

    const coachData = { name, role, bio, photo_url: finalPhotoUrl }

    if (editingId) {
      const { error } = await supabase.from('coaches').update(coachData).eq('id', editingId)
      if (error) {
        alert('Error updating coach: ' + error.message)
        return
      }
    } else {
      const { error } = await supabase.from('coaches').insert([coachData])
      if (error) {
        alert('Error adding coach: ' + error.message)
        return
      }
    }

    resetForm()
    fetchCoaches()
  }

  function handleEdit(coach) {
    setEditingId(coach.id)
    setName(coach.name || '')
    setRole(coach.role || '')
    setBio(coach.bio || '')
    setPhotoUrl(coach.photo_url || '')
    setPhotoFile(null)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this coach?')) return
    const { error } = await supabase.from('coaches').delete().eq('id', id)
    if (!error) fetchCoaches()
  }

  function resetForm() {
    setEditingId(null)
    setName('')
    setRole('')
    setBio('')
    setPhotoUrl('')
    setPhotoFile(null)
  }

  if (loading) {
    return <p style={{ padding: '40px', fontFamily: 'Arial' }}>Loading...</p>
  }

  const inputStyle = { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white', color: 'black' }
  const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>🧑‍🏫 Manage Coaches</h1>
        <a href="/admin/dashboard" style={{ color: '#0070f3' }}>← Back to Dashboard</a>
      </div>

      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>{editingId ? 'Edit Coach' : 'Add New Coach'}</h3>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Coach Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="">Select role</option>
            <option value="Head Coach">Head Coach</option>
            <option value="Batting Coach">Batting Coach</option>
            <option value="Bowling Coach">Bowling Coach</option>
            <option value="Fielding Coach">Fielding Coach</option>
            <option value="Fitness Trainer">Fitness Trainer</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} style={inputStyle} />
          {photoUrl && !photoFile && (
            <img src={photoUrl} alt="Current" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginTop: '8px' }} />
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Short Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={inputStyle} />
        </div>

        <button type="submit" disabled={uploading} style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
          {uploading ? 'Uploading...' : editingId ? 'Update Coach' : 'Add Coach'}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} style={{ padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </form>

      <h3 style={{ marginBottom: '15px' }}>All Coaches ({coaches.length})</h3>

      {coaches.length === 0 ? (
        <p>No coaches added yet.</p>
      ) : (
        coaches.map((coach) => (
          <div key={coach.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {coach.photo_url && (
                <img src={coach.photo_url} alt={coach.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div>
                <strong>{coach.name}</strong>
                <br />
                <span style={{ fontSize: '13px', color: '#666' }}>{coach.role || 'N/A'}</span>
              </div>
            </div>
            <div>
              <button onClick={() => handleEdit(coach)} style={{ padding: '6px 12px', marginRight: '8px', backgroundColor: '#f0a500', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(coach.id)} style={{ padding: '6px 12px', backgroundColor: '#e00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  )
}