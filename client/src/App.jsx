import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import Settings from './pages/Settings';
import ApplicationDetail from './pages/ApplicationDetail'
import AppLayout from './components/Layout/AppLayout';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Layout — AppLayout handles auth redirect internally */}
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="board" element={<Board />} />
                <Route path="settings" element={<Settings />} />
                <Route path="application/:id" element={<ApplicationDetail />} />
            </Route>

            <Route
                path="*"
                element={<div>404 Page Not Found</div>}
            />
        </Routes>
    );
}

export default App;