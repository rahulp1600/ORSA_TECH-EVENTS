import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const AdminLogin = ({ onLogin, onCancel }) => {
    const [rollNo, setRollNo] = useState('');
    const [securityKey, setSecurityKey] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rollNo === 'srichara' && securityKey === 'orsatech26') {
            onLogin();
        } else {
            setError('ACCESS DENIED: Invalid Credentials');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0a0a0f] border border-cyan-500/30 p-8 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <ShieldCheck size={32} className="text-cyan-400" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-black text-white gaming-font tracking-widest uppercase italic">Admin Access</h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">Authorized Personnel Only</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 gaming-font uppercase tracking-widest block mb-1 ml-1">Admin ID</label>
                        <input
                            type="text"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors font-mono tracking-wider"
                            placeholder="Enter Roll No"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 gaming-font uppercase tracking-widest block mb-1 ml-1">Security Key</label>
                        <input
                            type="password"
                            value={securityKey}
                            onChange={(e) => setSecurityKey(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors font-mono tracking-wider"
                            placeholder="Enter Key"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] gaming-font uppercase tracking-widest text-center animate-pulse font-bold">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3 rounded-lg gaming-font uppercase tracking-widest transition-all mt-2"
                    >
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
