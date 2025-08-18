import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

function Stat({ label, value }: { label: string, value: number | string }) {
	return (
		<div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
			<div className="text-sm text-gray-400">{label}</div>
			<div className="text-2xl font-bold">{value}</div>
		</div>
	)
}

export default function Admin() {
	const { isAdmin } = useAuth()
	const [stats, setStats] = useState({ total: 0, active: 0, banned: 0, coins: 0 })

	useEffect(() => {
		(async () => {
			const { count: totalCount } = await supabase.from('users').select('id', { count: 'exact', head: true })
			const { count: bannedCount } = await supabase.from('users').select('id', { count: 'exact', head: true }).eq('banned', true)
			const { count: activeCount } = await supabase.from('users').select('id', { count: 'exact', head: true }).eq('banned', false)
			const { data: coinsSum } = await supabase.from('users').select('coins')
			const coins = (coinsSum ?? []).reduce((a: number, b: any) => a + Number(b.coins ?? 0), 0)
			setStats({ total: Number(totalCount ?? 0), active: Number(activeCount ?? 0), banned: Number(bannedCount ?? 0), coins })
		})()
	}, [])

	if (!isAdmin) return <div className="p-4">Unauthorized</div>

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Admin Panel</h1>
			<div className="grid grid-cols-2 gap-3">
				<Stat label="Total Users" value={stats.total} />
				<Stat label="Active Users" value={stats.active} />
				<Stat label="Banned Users" value={stats.banned} />
				<Stat label="Coins Distributed" value={stats.coins} />
			</div>
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Managers</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="rounded border border-gray-800 bg-gray-900 p-4">Task Manager (todo)</div>
					<div className="rounded border border-gray-800 bg-gray-900 p-4">Exchange Manager (todo)</div>
					<div className="rounded border border-gray-800 bg-gray-900 p-4">User Manager (todo)</div>
					<div className="rounded border border-gray-800 bg-gray-900 p-4">Withdrawals Manager (todo)</div>
				</div>
			</div>
		</div>
	)
}