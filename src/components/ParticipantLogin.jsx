import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, KeyRound, ArrowLeft, ChevronRight } from 'lucide-react';

const ParticipantLogin = ({
    eventTitle,
    themeColor,
    onBack,
    onLogin,
    formData,
    setFormData,
    msg,
    setMsg,
    showBranch = true,
    showTeamOption = false,
    rules = [],
    accessCode // New prop for dynamic validation
}) => {
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Keep names and roll numbers uppercase for consistency
        const processedValue = (name === 'name' || name === 'rollNo' || name === 'teammateRollNo')
            ? value.toUpperCase()
            : value;

        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : processedValue,
            };

            // Branch logic for B.TECH
            if (name === 'course') {
                if (processedValue === 'B.TECH') {
                    // Check if current branch is NOT a B.Tech branch
                    const btechBranches = ['CSE', 'ECE', 'CIVIL', 'ME'];
                    if (!btechBranches.includes(prev.branch)) {
                        updated.branch = 'CSE';
                    }
                } else if (processedValue === 'B.PHARM' || processedValue === 'PHARM D') {
                    updated.branch = 'PHARMACY';
                } else {
                    updated.branch = processedValue;
                }
            }
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use the passed accessCode prop for validation
        if (formData.accessCode !== accessCode) {
            setMsg('INVALID ACCESS CODE');
            setTimeout(() => setMsg(''), 2000);
            return;
        }
        onLogin();
    };

    const colors = {
        red: {
            border: 'border-red-600',
            bg: 'bg-red-600',
            text: 'text-red-500',
            focus: 'focus:border-red-600',
            glow: 'shadow-red-600/20'
        },
        yellow: {
            border: 'border-yellow-500',
            bg: 'bg-yellow-500',
            text: 'text-yellow-500',
            focus: 'focus:border-yellow-500',
            glow: 'shadow-yellow-500/20'
        },
        emerald: {
            border: 'border-emerald-600',
            bg: 'bg-emerald-600',
            text: 'text-emerald-500',
            focus: 'focus:border-emerald-600',
            glow: 'shadow-emerald-600/20'
        },
        cyan: {
            border: 'border-cyan-400',
            bg: 'bg-cyan-400',
            text: 'text-cyan-400',
            focus: 'focus:border-cyan-400',
            glow: 'shadow-cyan-400/20'
        }
    };

    const theme = colors[themeColor] || colors.red;

    return (
        <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className={`relative z-10 w-full max-w-5xl bg-[#0a0a0f]/95 border border-white/10 backdrop-blur-3xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden grid lg:grid-cols-[1.2fr_1fr]`}
        >
            {/* Left Panel: Form */}
            <div className="p-12 lg:p-16 border-r border-white/5">
                <div className="flex items-center justify-between mb-12">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors gaming-font text-[10px] uppercase tracking-widest group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK
                    </button>
                    <div className={`px-4 py-1.5 ${theme.bg} text-black font-black gaming-font text-[10px] uppercase tracking-widest rounded-full shadow-lg ${theme.glow} italic`}>
                        SYSTEM AUTHENTICATION
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-4xl font-black gaming-font tracking-tighter mb-2 uppercase italic text-white">ORSA <span className={theme.text}>2026</span></h2>
                    <p className="text-gray-500 text-[10px] tracking-widest uppercase font-bold opacity-60">Identity verification required for {eventTitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] gaming-font ml-1">FULL NAME</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="OPERATOR NAME"
                            className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-base ${theme.focus} focus:outline-none placeholder:text-white/5 uppercase font-mono transition-all`}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] gaming-font ml-1">COURSE</label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleInputChange}
                                className={`w-full bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 text-base ${theme.focus} focus:outline-none appearance-none font-mono text-white`}
                                required
                            >
                                <option value="">SELECT</option>
                                <option value="B.TECH">B.TECH</option>
                                <option value="B.PHARM">B.PHARM</option>
                                <option value="MBA">MBA</option>
                                <option value="PHARM D">PHARM D</option>
                                <option value="M.TECH">M.TECH</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] gaming-font ml-1">YEAR</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                className={`w-full bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 text-base ${theme.focus} focus:outline-none appearance-none font-mono text-white`}
                                required
                            >
                                <option value="">SELECT</option>
                                <option value="1">1ST YEAR</option>
                                <option value="2">2ND YEAR</option>
                                <option value="3">3RD YEAR</option>
                                <option value="4">4TH YEAR</option>
                            </select>
                        </div>
                    </div>

                    {showBranch && formData.course === 'B.TECH' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] gaming-font ml-1">BRANCH</label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleInputChange}
                                className={`w-full bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 text-base ${theme.focus} focus:outline-none appearance-none font-mono text-white`}
                                required
                            >
                                <option value="CSE">CSE / CSM / CSD / IT</option>
                                <option value="ECE">ECE</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="ME">ME</option>
                                <option value="MINING">MINING</option>
                            </select>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] gaming-font ml-1">ID NUMBER</label>
                            <input
                                name="rollNo"
                                value={formData.rollNo}
                                onChange={handleInputChange}
                                placeholder="ROLL_ID"
                                className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-base ${theme.focus} font-mono uppercase focus:outline-none`}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] gaming-font ml-1">ACCESS CODE</label>
                            <div className="relative">
                                <input
                                    name="accessCode"
                                    type="password"
                                    value={formData.accessCode}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-12 text-base ${theme.focus} font-mono focus:outline-none`}
                                    required
                                />
                                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            </div>
                        </div>
                    </div>

                    {showTeamOption && (
                        <>
                            <div
                                className="flex items-center gap-3 p-5 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
                                onClick={() => handleInputChange({ target: { name: 'isTeam', type: 'checkbox', checked: !formData.isTeam } })}
                            >
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.isTeam ? theme.bg + ' border-transparent' : 'border-white/20'}`}>
                                    {formData.isTeam && <Users size={14} className="text-black font-bold" />}
                                </div>
                                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest italic">Activating Team Protocol?</span>
                            </div>

                            <AnimatePresence>
                                {formData.isTeam && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] gaming-font ml-1">ALLY 1 ID</label>
                                        <input
                                            name="teammateRollNo"
                                            value={formData.teammateRollNo}
                                            onChange={handleInputChange}
                                            placeholder="ALLY_ID_02"
                                            className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-base ${theme.focus} font-mono uppercase focus:outline-none`}
                                            required
                                            autoFocus
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}

                    <div className="pt-4">
                        <p className={`h-6 ${theme.text} text-center text-xs font-black uppercase tracking-[0.3em] animate-pulse italic mb-4`}>
                            {msg}
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className={`w-full py-6 ${theme.bg} text-black font-black gaming-font rounded-2xl text-xl tracking-[0.3em] shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:translate-y-1 uppercase italic flex items-center justify-center gap-3 group`}
                        >
                            ENTER THE ARENA <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </motion.button>
                    </div>
                </form>
            </div>

            {/* Right Panel: Information/Visuals */}
            <div className={`hidden lg:flex flex-col p-16 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden h-full`}>
                <div className="relative z-10 h-full flex flex-col">
                    <div className="mb-12">
                        <h3 className="text-white gaming-font text-[14px] uppercase tracking-[0.5em] mb-12 italic border-b border-white/10 pb-4 font-black">MISSION RULES</h3>
                        <div className="space-y-10">
                            {rules && rules.map((rule, idx) => (
                                <div key={idx} className="flex gap-6 items-start">
                                    <div className={`w-12 h-12 rounded-2xl ${theme.bg}/10 border border-${themeColor}-600/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/50`}>
                                        <span className={`${theme.text} font-black gaming-font text-lg`}>0{idx + 1}</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-300 text-[11px] leading-relaxed italic uppercase font-bold tracking-widest">{rule}</p>
                                    </div>
                                </div>
                            ))}
                            {(!rules || rules.length === 0) && (
                                <div className="flex gap-6 items-start">
                                    <div className={`w-12 h-12 rounded-2xl ${theme.bg}/10 border border-${themeColor}-600/20 flex items-center justify-center flex-shrink-0`}>
                                        <Users className={theme.text} size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white font-black gaming-font text-[10px] tracking-widest mb-1 italic">TEAM ENFORCEMENT</p>
                                        <p className="text-gray-500 text-xs leading-relaxed italic">Maximum 2 operators per unit. Single entry per ID.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="p-8 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-3xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-3 h-3 rounded-full ${theme.bg} animate-ping`} />
                                <span className="text-gray-400 gaming-font text-[10px] uppercase tracking-[0.3em] italic">System Status: Nominal</span>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 1.5 + i, repeat: Infinity, ease: 'linear' }}
                                            className={`h-full w-1/3 ${theme.bg} opacity-20`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative background logo */}
                <div className={`absolute -bottom-20 -right-20 opacity-[0.03] scale-150 rotate-12 pointer-events-none`}>
                    <Users size={400} />
                </div>
            </div>
        </motion.div>
    );
};

export default ParticipantLogin;
