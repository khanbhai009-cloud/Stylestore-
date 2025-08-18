import { supabase } from '../lib/supabaseClient'

export async function updateCoinsByTelegramId(telegramId: string, amount: number) {
	return supabase.rpc('increment_coins', { p_telegram_id: telegramId, p_amount: amount })
}

export async function requestWithdrawal(userId: number, wallet: string, coins: number, usdtValue: number) {
	return supabase.from('withdrawals').insert({ user_id: userId, wallet, coins, usdt_value: usdtValue, status: 'pending' })
}

export function subscribeWithdrawalStatus(userId: number, onChange: (payload: any) => void) {
	return supabase
		.channel('withdrawals')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals', filter: `user_id=eq.${userId}` }, (payload) => {
			onChange(payload)
		})
		.subscribe()
}