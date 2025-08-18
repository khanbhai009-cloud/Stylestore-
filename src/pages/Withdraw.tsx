import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

function isValidTRC20(address: string) {
	return /^T[a-zA-Z0-9]{33}$/i.test(address)
}

export default function Withdraw() {
	const { telegramId } = useAuth()
	const [wallet, setWallet] = useState('')
	const [exchangeRate, setExchangeRate] = useState<number>(100)
	const [coins, setCoins] = useState<number>(0)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		(async () => {
			const { data } = await supabase.from('settings').select('exchange_rate').single()
			if (data?.exchange_rate) setExchangeRate(Number(data.exchange_rate))
			const { data: user } = await supabase.from('users').select('coins').eq('telegram_id', telegramId).single()
			if (user?.coins != null) setCoins(Number(user.coins))
		})()
	}, [telegramId])

	const usdtValue = useMemo(() => (coins > 0 && exchangeRate > 0 ? coins / exchangeRate : 0), [coins, exchangeRate])

	async function submit() {
		if (!telegramId) return
		if (!isValidTRC20(wallet)) {
			alert('Invalid USDT TRC20 wallet. It should start with T and be 34 chars.')
			return
		}
		setLoading(true)
		try {
			const { data: user } = await supabase.from('users').select('id').eq('telegram_id', telegramId).single()
			const { error } = await supabase.from('withdrawals').insert({ user_id: user?.id, wallet, coins, usdt_value: usdtValue, status: 'pending' })
			if (error) throw error
			alert('✅ Withdrawal request submitted')
		} catch (e: any) {
			alert('Failed to submit withdrawal: ' + (e?.message ?? 'Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-4">
			<h1 className="text-xl font-semibold">Withdraw</h1>
			<div className="rounded-lg border border-gray-800 bg-gray-900 p-4 space-y-3">
				<label className="block text-sm text-gray-300">USDT TRC20 Wallet</label>
				<input value={wallet} onChange={e => setWallet(e.target.value)} placeholder="T..." className="w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 outline-none focus:border-gray-500" />
				<label className="block text-sm text-gray-300">Coins to withdraw</label>
				<input type="number" value={coins} onChange={e => setCoins(Number(e.target.value))} className="w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 outline-none focus:border-gray-500" />
				<div className="text-sm text-gray-400">Exchange rate: 1 USDT = {exchangeRate} coins</div>
				<div className="text-sm text-gray-200">You will receive ≈ <span className="font-semibold">{usdtValue.toFixed(2)} USDT</span></div>
				<button disabled={loading} onClick={submit} className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">Request Withdrawal</button>
			</div>
		</div>
	)
}