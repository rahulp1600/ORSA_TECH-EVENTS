import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, ChevronRight, GraduationCap, Timer, Trophy, ArrowLeft, KeyRound, Code2, Terminal, Play, Cpu, Zap, Users } from 'lucide-react';
import ParticipantLogin from './ParticipantLogin';

import { DEBUG_CHALLENGES as CHALLENGES, normalizeCode } from '../data/codeDebuggingData';
import { saveGameResult } from '../firebase';

const ACCESS_CODE = "debug1234";

const CodeDebugging = ({ onBack, onFinish }) => {
    const [phase, setPhase] = useState('login'); // 'login', 'lang-select', 'loading', 'game', 'result'
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        course: '',
        branch: 'CSE',
        year: '',
        isTeam: false,
        teammateRollNo: '',
        accessCode: ''
    });
    const [selectedLang, setSelectedLang] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [userCode, setUserCode] = useState("");
    const [timer, setTimer] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [score, setScore] = useState(0);
    const [msg, setMsg] = useState('');
    const [compileStatus, setCompileStatus] = useState('idle'); // 'idle', 'compiling', 'success', 'error'
    const [logs, setLogs] = useState([]);
    const [output, setOutput] = useState("");


    const handleLogin = (e) => {
        e.preventDefault();
        if (formData.accessCode !== ACCESS_CODE) {
            setMsg('INVALID ACCESS CODE');
            setTimeout(() => setMsg(''), 2000);
            return;
        }
        setPhase('lang-select');
    };

    const getBankKey = () => {
        const yr = parseInt(formData.year);
        const branch = (formData.branch || 'CSE').toUpperCase();
        const nonTechBranches = ['ME', 'CIVIL', 'MECH', 'ECE', 'PHARMACY', 'MBA', 'PHARM'];

        if (nonTechBranches.includes(branch)) return 'BASIC';

        if (yr === 1) return 'BASIC';
        if (yr === 2) return 'INTERMEDIATE';
        return 'ADVANCED';
    };

    const startLoading = (lang) => {
        setSelectedLang(lang);
        const key = getBankKey();
        const firstChallenge = CHALLENGES[key][lang][0];
        setUserCode(firstChallenge.code);
        setPhase('loading');
        setTimeout(() => {
            setPhase('game');
            setStartTime(Date.now());
            setIsTimerRunning(true);
            setLogs(["System: Environment Initialized", `System: ${lang} Compiler Ready`, `System: ${key} Bank Loaded`, "System: Source file loaded."]);
        }, 2000);
    };

    const handleCompile = () => {
        setCompileStatus('compiling');
        setLogs(prev => [...prev, `[USER]: Building and Executing...`]);
        setOutput("");

        setTimeout(() => {
            const key = getBankKey();
            const currentChallenges = CHALLENGES[key][selectedLang];
            const challenge = currentChallenges[currentLevel];
            const normalized = normalizeCode(userCode, selectedLang);
            const isFixed = challenge.validate(normalized);

            if (isFixed) {
                setScore(prev => prev + 2);
                setCompileStatus('success');
                setLogs(prev => [...prev, `[SUCCESS]: Build successful.`, `[STDOUT]: Execution complete.`]);
                setOutput(challenge.expectedOutput);

                setTimeout(() => {
                    if (currentLevel < currentChallenges.length - 1) {
                        const nextLvl = currentLevel + 1;
                        setCurrentLevel(nextLvl);
                        setUserCode(currentChallenges[nextLvl].code);
                        setCompileStatus('idle');
                        setOutput("");
                        setLogs(prev => [...prev, `System: Level ${nextLvl + 1} loaded.`]);
                    } else {
                        finishMission(score + 2);
                    }
                }, 2000);
            } else {
                setCompileStatus('error');
                setLogs(prev => [...prev, `[ERROR]: Compilation failed. Logic/Syntax error detected.`]);
                setTimeout(() => setCompileStatus('idle'), 2000);
            }
        }, 1500);
    };

    const finishMission = useCallback((finalScore = score) => {
        const finishTime = Date.now();
        setEndTime(finishTime);
        setPhase('result');
        setIsTimerRunning(false);

        const timeTaken = Math.floor((finishTime - startTime) / 1000);
        const key = getBankKey();
        const totalLevels = CHALLENGES[key][selectedLang].length;
        const maxScore = totalLevels * 2;
        const cgpa = maxScore > 0 ? ((finalScore / maxScore) * 10).toFixed(2) : "0.00";

        saveGameResult('codedebugging', {
            name: formData.name,
            rollNo: formData.rollNo,
            course: formData.course,
            year: formData.year,
            branch: formData.branch,
            isTeam: formData.isTeam,
            teammateRollNo: formData.teammateRollNo,
            language: selectedLang,
            difficulty: key,
            score: finalScore,
            totalLevels: totalLevels,
            timeTaken: timeTaken,
            cgpa: cgpa,
            accessCode: formData.accessCode
        });
    }, [formData, startTime, score, selectedLang, saveGameResult]);

    // --- SECURITY FEATURES ---
    // --- SECURITY FEATURES ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && phase === 'game') {
                setMsg('⚠️ WARNING: TAB SWITCH DETECTED! INCIDENT LOGGED.');
            }
        };

        const handleBlur = () => {
            if (phase === 'game') {
                setMsg('⚠️ WARNING: FOCUS LOST! DO NOT MINIMIZE.');
            }
        };

        const handleKeyDown = (e) => {
            if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) {
                e.preventDefault();
                setMsg('INSPECT ELEMENT IS DISABLED!');
            }
        };

        const preventRightClick = (e) => e.preventDefault();

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("contextmenu", preventRightClick);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("contextmenu", preventRightClick);
        };
    }, [phase]);

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer(prev => {
                    const nextTime = prev + 1;
                    if (nextTime >= 1800) { // 30 minutes
                        clearInterval(interval);
                        finishMission();
                    }
                    return nextTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, finishMission]);

    const formatTime = (t) => {
        const m = Math.floor(t / 60);
        const s = t % 60;
        return { mins: m.toString().padStart(2, '0'), secs: s.toString().padStart(2, '0') };
    };

    const getCGPA = () => {
        const key = getBankKey();
        const totalLevels = CHALLENGES[key][selectedLang].length;
        return ((score / (totalLevels * 2)) * 10).toFixed(2);
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
            <div className="scanlines" />

            {phase !== 'game' && phase !== 'loading' && (
                <button onClick={onBack} className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors gaming-font text-xs tracking-widest uppercase">
                    <ArrowLeft size={14} /> Exit to Menu
                </button>
            )}

            <AnimatePresence mode="wait">
                {phase === 'login' && (
                    <ParticipantLogin
                        eventTitle="Code Debugging"
                        themeColor="red"
                        onBack={onBack}
                        onLogin={() => {
                            setStartTime(Date.now());
                            setPhase('lang-select');
                        }}
                        formData={formData}
                        setFormData={setFormData}
                        msg={msg}
                        setMsg={setMsg}
                        accessCode={ACCESS_CODE}
                        showTeamOption={false}
                        rules={[
                            'Correct all logical and syntax errors in the provided source code.',
                            'Manual editing of the code is required (no hints/options).',
                            'Click "RUN COMPILE & TEST" to verify your solution.',
                            'Access next level only after build success and expected output match.',
                            'Time management is key: debug quickly to secure high rank.'
                        ]}
                    />
                )}

                {phase === 'lang-select' && (
                    <motion.div key="lang-select" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-4xl grid md:grid-cols-3 gap-8">
                        {['C', 'JAVA', 'PYTHON'].map((lang) => (
                            <motion.button key={lang} whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.1)' }} whileTap={{ scale: 0.95 }} onClick={() => startLoading(lang)} className="bg-[#0a0a0f] border border-white/5 p-16 rounded-[3rem] backdrop-blur-3xl text-center flex flex-col items-center gap-6 group hover:border-red-600/50 transition-all">
                                <div className="w-24 h-24 bg-red-600/10 rounded-3xl flex items-center justify-center group-hover:bg-red-600 transition-all duration-500">
                                    <Code2 className="text-red-500 group-hover:text-white transition-colors" size={48} />
                                </div>
                                <h3 className="text-3xl font-black gaming-font text-white italic tracking-tighter">{lang}</h3>
                                <div className="w-8 h-1 bg-red-600/20 group-hover:w-16 group-hover:bg-red-600 transition-all" />
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {phase === 'loading' && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 border-4 border-red-600/10 border-t-red-600 rounded-full animate-spin" />
                        <p className="gaming-font text-red-600 animate-pulse tracking-[0.4em] font-black uppercase text-xs italic">Initializing {selectedLang} Compiler...</p>
                    </motion.div>
                )}

                {phase === 'game' && (
                    <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl grid lg:grid-cols-[1fr_380px] gap-8 h-[85vh] relative z-20">
                        <div className="bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl backdrop-blur-3xl">
                            {/* Header */}
                            <div className="bg-white/5 p-5 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-6">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-600/40" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-600/40" />
                                        <div className="w-3 h-3 rounded-full bg-green-600/40" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 gaming-font uppercase tracking-widest italic">{selectedLang}_IDE_V1.0</span>
                                </div>
                                <div className="flex items-center gap-4 min-w-0 flex-1 justify-end">
                                    <div className="flex gap-1.5 overflow-x-auto custom-scrollbar-hide max-w-[300px] py-1 px-2 mask-fade-edges">
                                        {CHALLENGES[getBankKey()][selectedLang].map((_, i) => (
                                            <div key={i} className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[9px] gaming-font transition-all ${i <= currentLevel ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-white/5 text-gray-700'}`}>L{i + 1}</div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCompile}
                                            disabled={compileStatus === 'compiling'}
                                            className={`px-4 py-2 rounded-xl border text-[10px] gaming-font flex items-center gap-2 transition-all tracking-widest uppercase italic ${compileStatus === 'compiling' ? 'bg-gray-900 border-white/5 text-gray-700' : 'bg-red-600 border-red-500 text-white hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                                        >
                                            {compileStatus === 'compiling' ? <div className="w-3 h-3 border-2 border-white/10 border-t-white rounded-full animate-spin" /> : <Play size={10} fill="currentColor" />}
                                            {compileStatus === 'compiling' ? 'Building...' : 'Execute'}
                                        </motion.button>
                                        <div className="px-3 py-1.5 bg-black/60 rounded-xl border border-red-600/20 flex items-center gap-2.5 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                            <Timer size={12} className="animate-pulse" />
                                            <div className="flex items-baseline gap-0.5 gaming-font">
                                                <span className="text-lg font-black italic tracking-widest">{formatTime(Math.max(0, 1800 - timer)).mins}</span>
                                                <span className="text-[8px] font-black opacity-40 uppercase">m</span>
                                                <span className="text-lg font-black italic tracking-widest ml-0.5">{formatTime(Math.max(0, 1800 - timer)).secs}</span>
                                                <span className="text-[8px] font-black opacity-40 uppercase">s</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Editable Code Area */}
                            <div className="flex-1 p-0 relative group flex overflow-hidden">
                                <div className="w-16 bg-white/5 flex flex-col items-center pt-8 text-gray-700 select-none border-r border-white/10 font-mono text-xs leading-relaxed">
                                    {userCode.split('\n').map((_, i) => (
                                        <div key={i} className="flex items-center justify-center font-bold italic" style={{ height: '1.75rem' }}>{i + 1}</div>
                                    ))}
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={userCode}
                                        onChange={(e) => setUserCode(e.target.value)}
                                        className="w-full h-full bg-transparent p-8 pl-4 font-mono text-lg focus:outline-none resize-none text-gray-300 custom-scrollbar block"
                                        spellCheck="false"
                                        style={{ lineHeight: '1.75rem' }}
                                    />
                                    <div className="absolute top-4 right-8 opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="flex items-center gap-2 text-[10px] gaming-font bg-red-600/10 border border-red-600/20 px-3 py-1 rounded-full text-red-500 uppercase italic">
                                            <Terminal size={10} /> Editable Terminal
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Sidebar */}
                        <div className="flex flex-col gap-6 h-full max-h-full">
                            <div className="bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                                <h3 className="text-gray-500 gaming-font text-[10px] mb-6 uppercase tracking-[0.4em] italic">Operator Info</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-700 gaming-font">AGENT::</span>
                                        <span className="font-bold text-white italic truncate max-w-[150px]">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-700 gaming-font">ROLL::</span>
                                        <span className="font-bold text-white italic">{formData.rollNo}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-700 gaming-font">UNIT::</span>
                                        <span className="font-bold text-red-600 italic">{formData.course} - {formData.branch}</span>
                                    </div>
                                    {formData.isTeam && (
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-700 gaming-font">ALLY_ID::</span>
                                            <span className="font-bold text-white italic">{formData.teammateRollNo}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-8 flex flex-col shadow-2xl overflow-hidden">
                                <h3 className="text-gray-500 gaming-font text-[10px] mb-6 uppercase tracking-[0.4em] flex items-center gap-3 italic"><Terminal size={14} className="text-red-600" /> SYSTEM_OUTPUT</h3>
                                <div className="flex-1 bg-black/80 rounded-2xl p-6 font-mono text-xs overflow-auto custom-scrollbar space-y-3 border border-white/5">
                                    {logs.map((log, i) => (
                                        <div key={i} className={`${log.includes('[SUCCESS]') ? 'text-green-500' : log.includes('[ERROR]') ? 'text-red-500' : 'text-gray-500'}`}>
                                            <span className="opacity-20 mr-2">{i + 1}#</span> {log}
                                        </div>
                                    ))}
                                    {output && (
                                        <div className="mt-8 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2">
                                            <p className="text-[10px] text-gray-600 gaming-font uppercase tracking-widest mb-2 font-black italic">Binary Output:</p>
                                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-bold whitespace-pre-wrap">
                                                {output}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {phase === 'result' && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-xl bg-[#0a0a0f] border-2 border-red-600 p-12 rounded-[3.5rem] text-center shadow-2xl">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-32 h-32 bg-red-600/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border-4 border-red-600 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                            <Trophy size={64} className="text-red-500" />
                        </motion.div>
                        <h1 className="text-5xl font-black gaming-font text-white mb-2 tracking-tighter italic">MISSION COMPLETE</h1>
                        <p className="text-red-600 gaming-font text-sm mb-12 tracking-[0.5em] font-black uppercase italic">Vulnerabilities Patched</p>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-gray-500 gaming-font uppercase tracking-widest mb-1 font-black italic">CGPA SCORE</p>
                                <p className="text-4xl font-black text-white gaming-font">{getCGPA()}</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-gray-500 gaming-font uppercase tracking-widest mb-1 font-black italic">MISSION TIME</p>
                                <div className="flex items-baseline gap-2 gaming-font text-red-600">
                                    <span className="text-5xl font-black italic tracking-tighter">{formatTime(timer).mins}</span>
                                    <span className="text-sm font-black opacity-40 uppercase">MIN</span>
                                    <span className="text-5xl font-black italic tracking-tighter ml-2">{formatTime(timer).secs}</span>
                                    <span className="text-sm font-black opacity-40 uppercase">SEC</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 mb-12 text-left bg-white/5 p-8 rounded-3xl border border-white/5">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 uppercase tracking-widest font-black italic">PILOT_ID::</span>
                                <span className="font-bold text-white tracking-widest italic">{formData.rollNo}</span>
                            </div>
                            {formData.isTeam && (
                                <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3">
                                    <span className="text-gray-600 uppercase tracking-widest font-black italic">ALLY_ID::</span>
                                    <span className="font-bold text-red-600 tracking-widest italic">{formData.teammateRollNo}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-sm border-t border-white/5 pt-6">
                                <span className="text-gray-600 uppercase tracking-widest font-black italic">POINTS_SECURED::</span>
                                <span className="font-black text-white text-2xl italic">{score.toFixed(1)} <span className="text-gray-700 mx-2">/</span> {(CHALLENGES[getBankKey()][selectedLang].length * 2).toFixed(1)}</span>
                            </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onFinish} className="w-full py-6 bg-red-600 text-white font-black gaming-font rounded-2xl uppercase tracking-[0.5em] italic shadow-2xl hover:bg-red-500 transition-all">Return to Command</motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-red-600/[0.02] rounded-full blur-[180px] pointer-events-none" />
        </div>
    );
};

export default CodeDebugging;
