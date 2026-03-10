import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplications, deleteApplication } from '../api';
import Table from '../components/Table';
import Pagination from '../components/Pagination';

function Companies({ isAuthenticated }) {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [deleting, setDeleting] = useState(null);
    const [source, setSource] = useState(new URLSearchParams(window.location.search).get('source') || '');
    const pageSize = 20;

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getApplications(currentPage, pageSize, search, source);
            setApplications(response.data.applications);
            setTotalPages(response.data.total_pages);
            setTotal(response.data.total);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, source]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Debounced search
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this application?')) return;
        setDeleting(id);
        try {
            await deleteApplication(id);
            await fetchApplications();
        } catch (err) {
            console.error('Failed to delete:', err);
        } finally {
            setDeleting(null);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200 mb-3"
                        id="back-to-dashboard"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Companies Applied
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {loading ? (
                            <span className="inline-block h-4 w-32 rounded shimmer" />
                        ) : (
                            `${total} application${total !== 1 ? 's' : ''} found`
                        )}
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by company name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-glass pl-11 text-sm"
                        id="search-input"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                            id="clear-search-btn"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Source Filter Tabs */}
            <div className="flex bg-white/[0.03] p-1 rounded-xl w-fit border border-white/[0.06]">
                <button
                    onClick={() => setSource('')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${source === '' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'text-gray-400 hover:text-white'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setSource('Direct')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${source === 'Direct' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'text-gray-400 hover:text-white'}`}
                >
                    Direct (Sent Box)
                </button>
                <button
                    onClick={() => setSource('Portal')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${source === 'Portal' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:text-white'}`}
                >
                    Portal (Inbox)
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="glass-card p-8">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-lg shimmer flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-48 rounded shimmer" />
                                    <div className="h-3 w-32 rounded shimmer" />
                                </div>
                                <div className="h-6 w-24 rounded-lg shimmer" />
                                <div className="h-4 w-20 rounded shimmer" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <Table applications={applications} onDelete={handleDelete} />
            )}

            {/* Pagination */}
            {!loading && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}

export default Companies;
