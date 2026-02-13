import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, X, Search, FileDown, ShieldCheck, Gamepad2, Code2, Bug, Search as SearchIcon, Trash2 } from 'lucide-react';
import { getLeaderboardData, subscribeToLeaderboard, deleteGameResult } from '../firebase';

const AdminDashboard = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('coderush');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('timeTaken'); // 'timeTaken', 'cgpa'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

    const tabs = [
        { id: 'coderush', label: 'Code Rush', icon: Code2, color: 'emerald' },
        { id: 'techpicto', label: 'Tech Picto', icon: Gamepad2, color: 'blue' },
        { id: 'codedebugging', label: 'Code Debugging', icon: Bug, color: 'red' },
        { id: 'wordhunt', label: 'Word Hunt', icon: SearchIcon, color: 'cyan' }
    ];

    useEffect(() => {
        setLoading(true);
        // Subscribe to real-time updates
        const unsubscribe = subscribeToLeaderboard(activeTab, (results) => {
            setData(results);
            setLoading(false);
        });

        // Cleanup subscription on unmount or tab change
        return () => {
            unsubscribe();
        };
    }, [activeTab]);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the entry for ${name}?`)) {
            const success = await deleteGameResult(activeTab, id);
            if (!success) {
                alert("Failed to delete the entry. Please try again.");
            }
        }
    };

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc'); // Default to asc (usually time) for new sort, can adjust if needed
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const sortedData = [...data].filter(item =>
    (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => {
        if (sortBy === 'timeTaken') {
            if (a.timeTaken !== b.timeTaken) {
                return sortOrder === 'asc' ? a.timeTaken - b.timeTaken : b.timeTaken - a.timeTaken;
            }
            return b.cgpa - a.cgpa; // Higher CGPA wins tie-break
        } else if (sortBy === 'cgpa') {
            if (a.cgpa !== b.cgpa) {
                return sortOrder === 'asc' ? a.cgpa - b.cgpa : b.cgpa - a.cgpa;
            }
            return a.timeTaken - b.timeTaken; // Lower time wins tie-break
        }
        return 0;
    });

    const exportToCSV = () => {
        const headers = ['Rank', 'Name', 'Roll No', 'Course', 'Branch', 'Year', 'Time (s)', 'CGPA', 'Teammate'];
        const rows = sortedData.map((item, idx) => [
            idx + 1,
            item.name,
            item.rollNo,
            item.course,
            item.branch,
            item.year,
            item.timeTaken,
            item.cgpa,
            item.teammateRollNo || '-'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${activeTab}_results_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-600/50">
                            <ShieldCheck size={32} className="text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black gaming-font tracking-widest uppercase italic">Admin Dashboard</h1>
                            <p className="text-gray-500 text-xs uppercase tracking-[0.3em]">Event Judgement System V1.0</p>
                        </div>
                    </div>
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all gaming-font uppercase tracking-widest text-xs font-bold ${activeTab === tab.id
                                ? `bg-${tab.color}-600/20 border-${tab.color}-500 text-${tab.color}-400 shadow-[0_0_20px_rgba(var(--color-${tab.color}),0.2)]`
                                : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Name or Roll No..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <div className="px-6 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs uppercase tracking-widest font-bold">Live Updates</span>
                    </div>
                    <button onClick={exportToCSV} className="px-6 bg-green-600/20 border border-green-500/50 text-green-400 rounded-xl hover:bg-green-600/30 transition-colors flex items-center gap-2 ml-auto gaming-font uppercase text-xs font-bold tracking-widest">
                        <FileDown size={18} /> Export CSV
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-widest gaming-font font-bold">
                                    <th className="p-4 pl-6">Rank</th>
                                    <th className="p-4">Participant</th>
                                    <th className="p-4">Roll No</th>
                                    <th className="p-4">Branch/Year</th>
                                    <th className="p-4 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleSort('timeTaken')}>
                                        Time (m:s) {sortBy === 'timeTaken' && (sortOrder === 'asc' ? '▲' : '▼')}
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleSort('cgpa')}>
                                        CGPA {sortBy === 'cgpa' && (sortOrder === 'desc' ? '▼' : '▲')}
                                    </th>
                                    <th className="p-4">Teammate</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="8" className="p-8 text-center text-gray-500 animate-pulse">Fetching Realtime Data...</td></tr>
                                ) : sortedData.length === 0 ? (
                                    <tr><td colSpan="8" className="p-8 text-center text-gray-500">No records found.</td></tr>
                                ) : sortedData.map((row, idx) => (
                                    <tr key={row.id} className={`hover:bg-white/5 transition-colors group ${idx < 3 ? 'bg-white/[0.02]' : ''}`}>
                                        <td className="p-4 pl-6 font-mono text-gray-500 group-hover:text-white transition-colors border-r border-white/5 w-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {idx === 0 && <Trophy size={16} className="text-yellow-400" />}
                                                {idx === 1 && <Trophy size={16} className="text-gray-400" />}
                                                {idx === 2 && <Trophy size={16} className="text-orange-400" />}
                                                <span className={idx < 3 ? 'font-black text-white' : ''}>{idx + 1}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-white capitalize">
                                            <div className="flex flex-col">
                                                <span>{row.name}</span>
                                                {idx < 3 && <span className="text-[10px] text-purple-400 uppercase tracking-tighter">Winner #{idx + 1}</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-cyan-400 text-sm">{row.rollNo}</td>
                                        <td className="p-4 text-xs text-gray-400">{row.course} - {row.branch} ({row.year})</td>
                                        <td className="p-4 font-mono text-yellow-400">{formatTime(row.timeTaken)}</td>
                                        <td className="p-4 font-bold">{row.cgpa}</td>
                                        <td className="p-4 text-xs text-gray-500">{row.teammateRollNo || '-'}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(row.id, row.name)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete Entry"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-4 text-center text-[10px] text-gray-600 uppercase tracking-widest gaming-font">
                    End of Report • ORSA 2026 SysLog
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
