import { useState, useEffect } from 'react'
import { getHooks, createHook, getRequests, sendTestWebhook, exportRequests } from './api'
import './App.css'

function App() {
  const [hooks, setHooks] = useState([])
  const [selectedHook, setSelectedHook] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newHookName, setNewHookName] = useState('')
  const [testPayload, setTestPayload] = useState('{}')

  useEffect(() => {
    fetchHooks()
  }, [])

  async function fetchHooks() {
    setLoading(true)
    setError('')
    try {
      const data = await getHooks()
      setHooks(data)
    } catch (e) {
      setError('Failed to fetch hooks. Please ensure the backend is running and accessible.')
    }
    setLoading(false)
  }

  async function handleCreateHook(e) {
    e.preventDefault()
    setError('')
    try {
      const hook = await createHook({ name: newHookName })
      setHooks([...hooks, hook])
      setNewHookName('')
    } catch (e) {
      setError('Failed to create hook. Please try again.')
    }
  }

  async function handleSelectHook(hook) {
    setSelectedHook(hook)
    setLoading(true)
    setError('')
    try {
      const reqs = await getRequests(hook.id)
      setRequests(reqs)
    } catch (e) {
      setError('Failed to fetch requests for this hook.')
    }
    setLoading(false)
  }

  async function handleSendTestWebhook(e) {
    e.preventDefault()
    setError('')
    try {
      await sendTestWebhook(selectedHook.id, JSON.parse(testPayload))
      await handleSelectHook(selectedHook)
      setTestPayload('{}')
    } catch (e) {
      setError('Failed to send webhook. Ensure your payload is valid JSON.')
    }
  }

  function handleExportRequests() {
    exportRequests(selectedHook.id)
  }

  // Helper for avatar (first letter or #)
  function getAvatarText(hook) {
    if (hook.name && hook.name.trim()) return hook.name[0].toUpperCase()
    if (hook.id) return '#'
    return '?'
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo">HB</div>
        <h1>HookBoard</h1>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="main-layout">
        <div className="sidebar">
          <h2>Hooks</h2>
          {loading ? <div>Loading...</div> : (
            <ul>
              {hooks.map(hook => (
                <li key={hook.id}>
                  <span className="hook-avatar">{getAvatarText(hook)}</span>
                  <button
                    className={selectedHook && selectedHook.id === hook.id ? 'selected' : ''}
                    onClick={() => handleSelectHook(hook)}
                  >
                    {hook.name || hook.id}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleCreateHook} className="create-hook-form">
            <input
              type="text"
              value={newHookName}
              onChange={e => setNewHookName(e.target.value)}
              placeholder="New hook name"
              required
            />
            <button type="submit">Create Hook</button>
          </form>
        </div>
        <div className="content">
          {selectedHook ? (
            <div className="hook-detail">
              <h2>Hook: {selectedHook.name || selectedHook.id}</h2>
              <button className="export-btn" onClick={handleExportRequests}>Export Requests</button>
              <h3>Send Test Webhook</h3>
              <form onSubmit={handleSendTestWebhook} className="test-webhook-form">
                <textarea
                  value={testPayload}
                  onChange={e => setTestPayload(e.target.value)}
                  rows={4}
                  cols={40}
                  placeholder="JSON payload"
                />
                <button type="submit">Send</button>
              </form>
              <h3>Requests</h3>
              <div className="requests-list">
                <ul>
                  {requests.length === 0 && <li>No requests yet.</li>}
                  {requests.map((req, i) => (
                    <li key={i}>
                      <pre>{JSON.stringify(req, null, 2)}</pre>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="empty-state">Select a hook to view details.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
