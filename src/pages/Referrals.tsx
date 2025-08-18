import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

export default function Referrals() {
	const { telegramId } = useAuth()
	const [invited, setInvited] = useState<any[]>([])
	const [refLink, setRefLink] = useState('')

	useEffect(() => {
		(async () => {
			if (!telegramId) return
			const { data: user } = await supabase.from('users').select('id').eq('telegram_id', telegramId).single()
			const { data } = await supabase.from('referrals').select('new_user_id, users!referrals_new_user_id_fkey(username)').eq('referrer_id', user?.id)
			setInvited(data ?? [])
			setRefLink(window.location.origin + `/?ref=${telegramId}`)
		})()
	}, [telegramId])

	return (
		<div className="space-y-4">
			<h1 className="text-xl font-semibold">Referrals</h1>
			<div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
				<div className="text-sm text-gray-300">Your referral link</div>
				<div className="mt-1 select-all break-all text-white">{refLink}</div>
			</div>
			<div className="rounded-lg border border-gray-800 bg-gray-900">
				<div className="border-b border-gray-800 px-4 py-2 text-sm text-gray-300">Invited users</div>
				{invited.map((r, i) => (
					<div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
						<div className="text-gray-300">{i + 1}. {r.users?.username ?? 'anon'}</div>
					</div>
				))}
			</div>
		</div>
	)
}