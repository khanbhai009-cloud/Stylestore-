import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import Withdraw from './pages/Withdraw'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'

export default function AppRoutes({ isAdmin }: { isAdmin: boolean }) {
	return (
		<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/tasks" element={<Tasks />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/withdraw" element={<Withdraw />} />
			<Route path="/leaderboard" element={<Leaderboard />} />
			{isAdmin && <Route path="/admin" element={<Admin />} />}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}