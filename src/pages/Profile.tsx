import { useAuth } from '../hooks/useAuth'

export default function Profile() {
	const auth = useAuth()
	return (
		<div className="space-y-4">
			<h1 className="text-xl font-semibold">Profile</h1>
			<div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="text-gray-400">Username</div>
					<div className="text-white">{auth.username ?? '-'}</div>
					<div className="text-gray-400">Coins</div>
					<div className="text-white">{auth.coins}</div>
					<div className="text-gray-400">Referrals</div>
					<div className="text-white">{auth.referrals}</div>
					<div className="text-gray-400">Linked Wallet</div>
					<div className="text-white">Coming soon</div>
				</div>
			</div>
		</div>
	)
}