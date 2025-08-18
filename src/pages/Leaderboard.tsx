import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Leaderboard() {
	const [byCoins, setByCoins] = useState<any[]>([])
	const [byRefs, setByRefs] = useState<any[]>([])

	useEffect(() => {
		(async () => {
			const { data: coins } = await supabase.from('users').select('username, coins').order('coins', { ascending: false }).limit(20)
			setByCoins(coins ?? [])
			const { data: refs } = await supabase.from('users').select('username, referrals').order('referrals', { ascending: false }).limit(20)
			setByRefs(refs ?? [])
		})()
	}, [])

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Leaderboard</h1>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<section>
					<h2 className="mb-2 text-sm font-medium text-gray-300">Top by Coins</h2>
					<div className="divide-y divide-gray-800 rounded-lg border border-gray-800 bg-gray-900">
						{byCoins.map((u, i) => (
							<div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
								<div className="text-gray-300">{i + 1}. {u.username ?? 'anon'}</div>
								<div className="font-semibold text-white">{u.coins}</div>
							</div>
						))}
					</div>
				</section>
				<section>
					<h2 className="mb-2 text-sm font-medium text-gray-300">Top by Referrals</h2>
					<div className="divide-y divide-gray-800 rounded-lg border border-gray-800 bg-gray-900">
						{byRefs.map((u, i) => (
							<div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
								<div className="text-gray-300">{i + 1}. {u.username ?? 'anon'}</div>
								<div className="font-semibold text-white">{u.referrals}</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	)
}