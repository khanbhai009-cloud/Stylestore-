import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export type AuthState = {
	telegramId: string | null
	username: string | null
	isAdmin: boolean
	loading: boolean
	banned: boolean
	coins: number
	referrals: number
}

export function useAuth() {
	const [state, setState] = useState<AuthState>({
		telegramId: null,
		username: null,
		isAdmin: false,
		loading: true,
		banned: false,
		coins: 0,
		referrals: 0,
	})

	useEffect(() => {
		async function init() {
			try {
				const tg = (window as any).Telegram?.WebApp
				tg?.ready?.()
				const initDataUnsafe = tg?.initDataUnsafe
				let telegramId: string | null = null
				let username: string | null = null
				if (initDataUnsafe?.user) {
					telegramId = String(initDataUnsafe.user.id)
					username = initDataUnsafe.user.username ?? null
				} else {
					const params = new URLSearchParams(window.location.search)
					telegramId = params.get('tg_id')
					username = params.get('tg_user')
				}

				// Referral capture
				const params = new URLSearchParams(window.location.search)
				const ref = params.get('ref')

				if (telegramId) {
					// Upsert user
					const { data: existing, error: userErr } = await supabase
						.from('users')
						.select('*')
						.eq('telegram_id', telegramId)
						.single()

					if (userErr && userErr.code !== 'PGRST116') {
						console.error(userErr)
					}

					if (!existing) {
						const { data: newUser, error: upErr } = await supabase
							.from('users')
							.insert({ telegram_id: telegramId, username, coins: 0, banned: false, referrals: 0 })
							.select()
							.single()
						if (upErr) console.error(upErr)

						// Record referral
						if (ref) {
							await supabase.from('referrals').insert({ referrer_id: ref, new_user_id: newUser?.id })
							await supabase.from('users').update({ referrals: (newUser?.referrals ?? 0) + 1 }).eq('id', ref)
						}
					}

					// Fetch fresh state
					const { data: user } = await supabase
						.from('users')
						.select('*')
						.eq('telegram_id', telegramId)
						.single()

					setState(s => ({
						...s,
						telegramId,
						username: username ?? null,
						isAdmin: telegramId === '6779644494' || username === 'imFINISHER' || username === '@imFINISHER',
						loading: false,
						banned: Boolean(user?.banned),
						coins: Number(user?.coins ?? 0),
						referrals: Number(user?.referrals ?? 0),
					}))
				} else {
					setState(s => ({ ...s, loading: false }))
				}
			} catch (e) {
				console.error(e)
				setState(s => ({ ...s, loading: false }))
			}
		}
		init()
	}, [])

	return state
}
