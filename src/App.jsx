import { useEffect, useRef, useState } from 'react'

const PLAYERS = {
  yousef: { name: 'Yousef', accent: 'gold' },
  adham: { name: 'Adham', accent: 'ice' },
}

const MILESTONES = [5, 10, 25, 50, 75, 100, 150, 200]
const FINAL_GOAL = MILESTONES[MILESTONES.length - 1]
const STORAGE_KEY = 'job-race-counts'
const POLL_MS = 15000

function nextMilestone(count) {
  return MILESTONES.find((m) => m > count) ?? null
}

function prevMilestone(count) {
  const passed = MILESTONES.filter((m) => m <= count)
  return passed.length ? passed[passed.length - 1] : 0
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      return { yousef: Math.max(0, p.yousef | 0), adham: Math.max(0, p.adham | 0) }
    }
  } catch {}
  return { yousef: 0, adham: 0 }
}

export default function App() {
  const [counts, setCounts] = useState(loadLocal)
  const [cloud, setCloud] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  // Try the cloud once on load; if it answers, it is the source of truth.
  useEffect(() => {
    let alive = true
    async function pull() {
      try {
        const r = await fetch('/api/counts')
        if (!r.ok) return
        const data = await r.json()
        if (!alive) return
        setCloud(true)
        setCounts({ yousef: data.yousef | 0, adham: data.adham | 0 })
      } catch {}
    }
    pull()
    const id = setInterval(pull, POLL_MS)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts))
  }, [counts])

  function celebrate(name, milestone) {
    clearTimeout(toastTimer.current)
    setToast(`${name} reached ${milestone} applications ✦`)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }

  function bump(key, delta) {
    const next = Math.max(0, counts[key] + delta)
    if (delta > 0 && MILESTONES.includes(next)) celebrate(PLAYERS[key].name, next)
    if (cloud) {
      fetch('/api/counts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: key, count: next }),
      }).catch(() => {})
    }
    setCounts((prev) => ({ ...prev, [key]: next }))
  }

  const total = counts.yousef + counts.adham
  const yShare = total === 0 ? 50 : (counts.yousef / total) * 100
  const leader =
    counts.yousef === counts.adham ? null : counts.yousef > counts.adham ? 'yousef' : 'adham'

  return (
    <div className="stage">
      <header className="masthead">
        <p className="eyebrow">A friendly rivalry</p>
        <h1>The Application Race</h1>
        <p className="subtitle">
          {total} application{total === 1 ? '' : 's'} sent, {FINAL_GOAL * 2 - total > 0 ? 'no one is safe yet' : 'the race is run'}
        </p>
      </header>

      <div className="arena">
        <PlayerPanel
          side="left"
          player={PLAYERS.yousef}
          count={counts.yousef}
          isLeader={leader === 'yousef'}
          onAdd={() => bump('yousef', 1)}
          onRemove={() => bump('yousef', -1)}
        />

        <div className="divider">
          <span className="vs">vs</span>
        </div>

        <PlayerPanel
          side="right"
          player={PLAYERS.adham}
          count={counts.adham}
          isLeader={leader === 'adham'}
          onAdd={() => bump('adham', 1)}
          onRemove={() => bump('adham', -1)}
        />
      </div>

      <section className="tug">
        <div className="tug-labels">
          <span className="gold-text">Yousef · {Math.round(yShare)}%</span>
          <span className="ice-text">{Math.round(100 - yShare)}% · Adham</span>
        </div>
        <div className="tug-bar" role="img" aria-label={`Yousef ${Math.round(yShare)} percent, Adham ${Math.round(100 - yShare)} percent`}>
          <div className="tug-fill gold-fill" style={{ width: `${yShare}%` }} />
          <div className="tug-fill ice-fill" style={{ width: `${100 - yShare}%` }} />
          <div className="tug-needle" style={{ left: `${yShare}%` }} />
        </div>
      </section>

      <footer className="colophon">
        <span className={`sync-dot ${cloud ? 'on' : ''}`} />
        {cloud ? 'Synced to the cloud' : 'Saved on this device'}
      </footer>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function PlayerPanel({ side, player, count, isLeader, onAdd, onRemove }) {
  const next = nextMilestone(count)
  const prev = prevMilestone(count)
  const segPct = next === null ? 100 : ((count - prev) / (next - prev)) * 100

  return (
    <section className={`panel ${side} ${player.accent} ${isLeader ? 'leading' : ''}`}>
      <div className="crown" aria-hidden="true">{isLeader ? '♛' : ' '}</div>
      <h2 className="player-name">{player.name}</h2>

      <div className="count" aria-live="polite">{count}</div>
      <p className="count-label">applications</p>

      <div className="controls">
        <button className="ctl" onClick={onRemove} disabled={count === 0} aria-label={`Remove one from ${player.name}`}>
          −
        </button>
        <button className="ctl add" onClick={onAdd} aria-label={`Add one to ${player.name}`}>
          +
        </button>
      </div>

      <div className="milestone">
        <div className="milestone-track">
          <div className="milestone-fill" style={{ width: `${segPct}%` }} />
        </div>
        <p className="milestone-note">
          {next === null
            ? 'Every milestone conquered ✦'
            : `${next - count} to go until ${next}`}
        </p>
        <div className="badges">
          {MILESTONES.map((m) => (
            <span key={m} className={`badge ${count >= m ? 'earned' : ''}`}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
