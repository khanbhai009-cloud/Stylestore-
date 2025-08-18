export type User = {
	id: number
	telegram_id: string
	username: string | null
	coins: number
	banned: boolean
	referrals: number
}

export type Task = {
	id: number
	type: string
	title: string
	reward: number
	link: string | null
}

export type Withdrawal = {
	id: number
	user_id: number
	wallet: string
	coins: number
	usdt_value: number
	status: 'pending' | 'approved' | 'rejected'
	txid: string | null
	rejection_reason: string | null
}

export type Referral = {
	id: number
	referrer_id: number
	new_user_id: number
}

export type Setting = {
	id: number
	exchange_rate: number
}