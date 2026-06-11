import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {

    const { user, loading } = useAuth();

    // While checking auth
    if (loading) {
        return <h2>Loading...</h2>;
    }

    // If not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If logged in
    return children;
};

export default ProtectedRoute;