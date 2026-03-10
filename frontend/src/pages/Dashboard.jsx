import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplicationsCount, syncEmails, getLoginUrl } from '../api';

function Dashboard({ isAuthenticated }) {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, direct: 0, portal: 0 });
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchStats();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await getApplicationsCount();
            setStats({
                total: response.data.total_applications,
                direct: response.data.direct_count,
                portal: response.data.portal_count
            });
            setError(null);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!isAuthenticated) {
            window.location.href = getLoginUrl();
            return;
        }

        setSyncing(true);
        setSyncResult(null);
        setError(null);

        try {
            const response = await syncEmails();
            setSyncResult(response.data);
            await fetchStats();
        } catch (err) {
            console.error('Sync failed:', err);
            setError(err.response?.data?.detail || 'Failed to sync emails. Please try again.');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center pt-8 pb-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                    <span className="text-white">Your Job </span>
                    <span className="gradient-text">Applications</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Automatically track and organize your job applications from your <b>Sent</b> items and <b>Job Portals</b> in your inbox.
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/companies?source=Direct')}
                    className="glass-card-hover p-8 text-center cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">SENT BOX</div>
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    {loading ? <div className="h-10 w-20 mx-auto rounded shimmer mb-2" /> :
                        <div className="text-4xl font-extrabold text-white mb-1 tabular-nums">{stats.direct}</div>
                    }
                    <p className="text-gray-400 font-medium text-xs uppercase tracking-wider">Direct Applications (Sent)</p>
                </button>

                <button
                    onClick={() => navigate('/companies?source=Portal')}
                    className="glass-card-hover p-8 text-center cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">INBOX</div>
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                    {loading ? <div className="h-10 w-20 mx-auto rounded shimmer mb-2" /> :
                        <div className="text-4xl font-extrabold text-white mb-1 tabular-nums">{stats.portal}</div>
                    }
                    <p className="text-gray-400 font-medium text-xs uppercase tracking-wider">Portal Applications (Inbox)</p>
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="btn-primary flex items-center gap-3 text-sm"
                    id="sync-emails-btn"
                >
                    {syncing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Syncing Emails...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>{isAuthenticated ? 'Sync Emails' : 'Connect Gmail & Sync'}</span>
                        </>
                    )}
                </button>

                <button
                    onClick={() => navigate('/companies')}
                    className="btn-secondary flex items-center gap-2 text-sm"
                    id="view-companies-btn"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>View All Companies</span>
                </button>
            </div>

            {/* Sync Result */}
            {syncResult && (
                <div className="max-w-lg mx-auto animate-slide-up">
                    <div className="glass-card p-6 border-emerald-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-emerald-400">Sync Complete</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                                <span className="text-gray-400">Emails Processed</span>
                                <span className="font-semibold text-white">{syncResult.total_processed}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                                <span className="text-gray-400">New Applications</span>
                                <span className="font-semibold text-emerald-400">{syncResult.new_applications}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                                <span className="text-gray-400">Duplicates Skipped</span>
                                <span className="font-semibold text-amber-400">{syncResult.duplicates_skipped}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                                <span className="text-gray-400">Errors</span>
                                <span className="font-semibold text-red-400">{syncResult.errors}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="max-w-lg mx-auto animate-slide-up">
                    <div className="glass-card p-6 border-red-500/20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-400 text-sm">Sync Failed</h3>
                                <p className="text-gray-400 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">Gmail Integration</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Securely scans your sent emails for job application patterns.
                    </p>
                </div>

                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">AI-Powered Extraction</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Uses Google Gemini to extract company names, roles, and contacts.
                    </p>
                </div>

                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">Duplicate Detection</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Automatically prevents duplicate application entries.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
