import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

async function updateCoins(telegramId: string, amount: number) {
	const { error } = await supabase.rpc('increment_coins', { p_telegram_id: telegramId, p_amount: amount })
	if (error) console.error(error)
}

export default function Tasks() {
	const { telegramId } = useAuth()
	const [loading, setLoading] = useState(false)

	async function handlePopup() {
		if (!telegramId) return
		setLoading(true)
		try {
			await (window as any).show_9651692('pop')
			await updateCoins(telegramId, 500)
			alert('🎉 Congrats! You earned 500 coins.')
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	async function handleInterstitial() {
		if (!telegramId) return
		setLoading(true)
		try {
			await (window as any).show_9651692()
			await updateCoins(telegramId, 500)
			alert('🎉 Congrats! You earned 500 coins.')
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-4">
			<h1 className="text-xl font-semibold">Tasks</h1>
			<div className="flex gap-3">
				<button disabled={loading} onClick={handlePopup} className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50">Show Rewarded Popup</button>
				<button disabled={loading} onClick={handleInterstitial} className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">Show Rewarded Interstitial</button>
			</div>
			<p className="text-sm text-gray-400">Earn coins by completing tasks</p>
		</div>
	)
}