import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
	const auth = useAuth()

	useEffect(() => {
		if (auth.banned) {
			alert('🚫 You are banned')
		}
	}, [auth.banned])

	return (
		<div className="space-y-4">
			<h1 className="text-xl font-semibold">Dashboard</h1>
			<div className="grid grid-cols-2 gap-3">
				<div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
					<div className="text-sm text-gray-400">Coins</div>
					<div className="text-2xl font-bold">{auth.coins}</div>
				</div>
				<div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
					<div className="text-sm text-gray-400">Referrals</div>
					<div className="text-2xl font-bold">{auth.referrals}</div>
				</div>
			</div>
			<div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
				<div>Username: <span className="text-white">{auth.username ?? '-'}</span></div>
				<div>Status: <span className="text-white">{auth.banned ? 'Banned' : 'Active'}</span></div>
			</div>
		</div>
	)
}