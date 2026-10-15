// Auth Context - global auth state management
// TODO: AuthProvider with user state, loading state
// TODO: Implement login, signup, logout functions
// TODO: Auto-check token on mount (call getMe)
// TODO: Export useAuth hook

import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import * as authService from '../services/auth.service';


// 1. Create Context
const AuthContext = createContext();


// 2. Create Provider Component
export const AuthProvider = ({ children }) => {

    const queryClient = useQueryClient();

    // 3. State
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    // 4. Check user on app load
    useEffect(() => {

        const loadUser = async () => {

            try {

                // Check token exists
                const token = localStorage.getItem('token');

                // If no token
                if (!token) {
                    setLoading(false);
                    return;
                }

                // Call backend getMe API
                const data = await authService.getMe();

                // Save user in state
                setUser(data.user);

            } catch (error) {

                // Invalid token
                localStorage.removeItem('token');

                setUser(null);

            } finally {

                setLoading(false);
            }
        };

        loadUser();

    }, []);


    // 5. Login Function
    const login = async (formData) => {

        const data = await authService.login(formData);

        // Save token
        localStorage.setItem(
            'token',
            data.token
        );

        // Wipe any cached data from whoever was logged in before,
        // so dashboard/applications queries refetch fresh for this user
        queryClient.clear();

        // Save user in state
        setUser(data.user);

        return data;
    };


    // 6. Signup Function
    const signup = async (formData) => {

        const data = await authService.signup(formData);

        // Save token
        localStorage.setItem(
            'token',
            data.token
        );

        // Same reason as login() — start this new account with an empty cache
        queryClient.clear();

        // Save user
        setUser(data.user);

        return data;
    };


    // 7. Logout Function
    const logout = () => {

        localStorage.removeItem('token');

        // Clear cached data so it isn't served to whoever logs in next
        queryClient.clear();

        setUser(null);
    };


    // 8. Provider Value
    const value = {
        user,
        loading,
        login,
        signup,
        logout
    };


    // 9. Return Provider
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


// 10. Custom Hook
export const useAuth = () => {
    return useContext(AuthContext);
};

//global shared storage - any component can use from here no need to do prop drilling  it centralized user statte, loader and login/out functions