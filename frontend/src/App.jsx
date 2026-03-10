import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Navbar from './components/Navbar';
import { getAuthStatus } from './api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();

        // Check if redirected from OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'success') {
            setIsAuthenticated(true);
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await getAuthStatus();
            setIsAuthenticated(response.data.authenticated);
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center animate-fade-in">
                    <div className="spinner mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            {/* Background orbs */}
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            <div className="min-h-screen">
                <Navbar
                    isAuthenticated={isAuthenticated}
                    onAuthChange={setIsAuthenticated}
                />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Dashboard isAuthenticated={isAuthenticated} />
                            }
                        />
                        <Route
                            path="/companies"
                            element={
                                <Companies isAuthenticated={isAuthenticated} />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
