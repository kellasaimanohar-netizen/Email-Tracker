import { useState } from 'react';

function Table({ applications, onDelete }) {
    const [selectedEmail, setSelectedEmail] = useState(null);
    if (!applications || applications.length === 0) {
        return (
            <div className="glass-card p-12 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No applications found</h3>
                <p className="text-gray-400 text-sm">
                    Sync your emails to start tracking your job applications.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="glass-card overflow-hidden animate-slide-up">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    HR Email
                                </th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    View
                                </th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Source
                                </th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Date Applied
                                </th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {applications.map((app, index) => (
                                <tr
                                    key={app.id}
                                    className="table-row animate-slide-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/20 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-bold text-brand-300">
                                                    {app.company ? app.company.charAt(0).toUpperCase() : '?'}
                                                </span>
                                            </div>
                                            <span className="font-medium text-white text-sm">
                                                {app.company || 'Unknown'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-gray-300 font-mono">
                                            {app.hr_email || '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => setSelectedEmail(app)}
                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Email
                                        </button>
                                    </td>
                                    <td className="py-4 px-6">
                                        {app.source === 'Direct' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                SENT BOX
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                INBOX
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-gray-400">
                                            {app.date
                                                ? new Date(app.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })
                                                : '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => onDelete && onDelete(app.id)}
                                            className="text-gray-500 hover:text-red-400 transition-colors duration-200 p-1.5 rounded-lg hover:bg-red-500/10"
                                            title="Delete application"
                                            id={`delete-btn-${app.id}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Email Modal */}
            {
                selectedEmail && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">{selectedEmail.email_subject || 'No Subject'}</h2>
                                    <p className="text-sm font-medium text-brand-400">
                                        {selectedEmail.company} <span className="text-gray-500 mx-2">•</span> <span className="text-gray-400">{selectedEmail.hr_email}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto bg-black/40 rounded-xl p-5 border border-white/[0.04]">
                                <pre className="text-[13px] leading-relaxed text-gray-300 whitespace-pre-wrap font-sans">
                                    {selectedEmail.email_body || 'No email body extracted.'}
                                </pre>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default Table;
