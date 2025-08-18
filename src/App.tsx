import { useEffect, useMemo, useState } from 'react'
import AppRoutes from './routes'

function useTelegramUser() {
  const [telegramId, setTelegramId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    tg?.ready?.()
    const initDataUnsafe = tg?.initDataUnsafe
    if (initDataUnsafe?.user) {
      setTelegramId(String(initDataUnsafe.user.id))
      setUsername(initDataUnsafe.user.username ?? null)
    } else {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('tg_id')
      const un = params.get('tg_user')
      if (id) setTelegramId(id)
      if (un) setUsername(un)
    }
  }, [])

  return { telegramId, username }
}

function App() {
  const { telegramId, username } = useTelegramUser()
  const isAdmin = useMemo(() => {
    if (!telegramId && !username) return false
    return telegramId === '6779644494' || username === 'imFINISHER' || username === '@imFINISHER'
  }, [telegramId, username])

  return (
    <div className="min-h-dvh bg-gray-950 text-gray-100">
      <nav className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="font-semibold tracking-wide">Earnifiy</div>
          <div className="flex gap-3 text-sm text-gray-300">
            <a href="/" className="hover:text-white">Dashboard</a>
            <a href="/tasks" className="hover:text-white">Tasks</a>
            <a href="/withdraw" className="hover:text-white">Withdraw</a>
            <a href="/leaderboard" className="hover:text-white">Leaderboard</a>
            {isAdmin && <a href="/admin" className="text-emerald-400 hover:text-emerald-300">Admin</a>}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-4 py-4">
        <AppRoutes isAdmin={isAdmin} />
      </main>
    </div>
  )
}

export default App
