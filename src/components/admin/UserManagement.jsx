import { useState, useEffect } from 'react'
import { api } from '../../lib/axios'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users')
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleUpdateRole = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, { role })
      fetchUsers()
    } catch (err) {
      alert('Failed to update role')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      fetchUsers()
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">User Management</h2>
          <p className="text-sm text-muted mt-1">Manage system access and roles.</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] px-6 py-3 bg-gray-50 text-xs font-semibold text-muted uppercase tracking-wide border-b border-gray-100">
          <span>Name</span><span>Email</span><span>Role</span><span>Joined</span><span>Actions</span>
        </div>
        
        {loading ? (
          <div className="px-6 py-12 text-center text-muted text-sm">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted text-sm">No users found.</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50 items-center">
              <span className="text-sm font-semibold text-navy">{u.name}</span>
              <span className="text-sm text-muted">{u.email}</span>
              <div>
                <select 
                  value={u.role} 
                  onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold px-2 py-1 outline-none"
                >
                  <option value="STAFF">STAFF</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <span className="text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</span>
              <button 
                onClick={() => handleDelete(u.id)}
                className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors border-none bg-transparent cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
