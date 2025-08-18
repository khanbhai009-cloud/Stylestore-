import { supabase } from '../lib/supabaseClient'

export async function banUser(userId: number) {
	return supabase.from('users').update({ banned: true }).eq('id', userId)
}

export async function unbanUser(userId: number) {
	return supabase.from('users').update({ banned: false }).eq('id', userId)
}

export async function adjustCoins(userId: number, delta: number) {
	// This should be done via secure RPC/Edge function in production
	return supabase.rpc('adjust_coins', { p_user_id: userId, p_delta: delta })
}

export async function approveWithdrawal(withdrawalId: number, txid: string) {
	return supabase.from('withdrawals').update({ status: 'approved', txid }).eq('id', withdrawalId)
}

export async function rejectWithdrawal(withdrawalId: number, reason: string) {
	return supabase.from('withdrawals').update({ status: 'rejected', rejection_reason: reason }).eq('id', withdrawalId)
}

export async function setExchangeRate(value: number) {
	return supabase.from('settings').upsert({ id: 1, exchange_rate: value })
}