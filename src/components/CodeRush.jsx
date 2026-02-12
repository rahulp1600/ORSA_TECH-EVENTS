import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Trophy, ArrowLeft, ChevronRight, Code2, Terminal, Play, GraduationCap, Users, KeyRound, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';
import ParticipantLogin from './ParticipantLogin';

import { CODE_RUSH_SET_1, CODE_RUSH_SET_2 } from '../data/codeRushData';
import { saveGameResult } from '../firebase';
import { normalizeCode } from '../data/codeDebuggingData';

const ACCESS_CODE = "rushcode4321";

const CodeRush = ({ onBack, onFinish }) => {
    const [phase, setPhase] = useState('login'); // 'login', 'game', 'result'
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        course: '',
        year: '',
        branch: 'CSE',
        language: 'Python',
        isTeam: false,
        teammateRollNo: '',
        accessCode: ''
    });
    const [questionBank, setQuestionBank] = useState(CODE_RUSH_SET_1);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [userCode, setUserCode] = useState('');
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const editorRef = useRef(null);

    const questions = questionBank[formData.language] || [];


    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let liveTimer;
        if (phase === 'game') {
            liveTimer = setInterval(() => {
                setTimer(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(liveTimer);
    }, [phase, startTime]);

    const finishGame = (finalScore) => {
        const finishTime = Date.now();
        setEndTime(finishTime);
        setPhase('result');

        const timeTaken = Math.floor((finishTime - startTime) / 1000);
        const cgpa = ((finalScore / 20) * 10).toFixed(2);

        saveGameResult('coderush', {
            name: formData.name,
            rollNo: formData.rollNo,
            course: formData.course,
            year: formData.year,
            branch: formData.branch,
            isTeam: formData.isTeam,
            teammateRollNo: formData.teammateRollNo,
            language: formData.language,
            score: finalScore,
            totalQuestions: questions.length,
            timeTaken: timeTaken,
            cgpa: cgpa,
            accessCode: formData.accessCode
        });
    };

    const handleStart = (e) => {
        e.preventDefault();
        if (formData.accessCode !== ACCESS_CODE) {
            setMsg({ text: 'INVALID ACCESS CODE', type: 'error' });
            setTimeout(() => setMsg({ text: '', type: '' }), 2000);
            return;
        }
        setStartTime(Date.now());
        setPhase('game');
    };

    const validateCode = () => {
        const currentQ = questions[currentIdx];
        const normalized = normalizeCode(userCode, formData.language.toUpperCase());
        const isCorrect = currentQ.solution.test(normalized);

        if (isCorrect) {
            let points = 2;
            if (attempts === 1) points = 1;
            if (attempts === 2) points = 0.5;

            const newScore = score + points;
            setScore(newScore);
            setMsg({ text: 'CORRECT EXECUTION!', type: 'success' });

            setTimeout(() => {
                if (currentIdx < questions.length - 1) {
                    setCurrentIdx(prev => prev + 1);
                    setAttempts(0);
                    setUserCode('');
                    setMsg({ text: '', type: '' });
                } else {
                    finishGame(newScore);
                }
            }, 1000);
        } else {
            if (attempts < 2) {
                setAttempts(prev => prev + 1);
                setMsg({ text: `INCORRECT. ATTEMPT ${attempts + 2}/3`, type: 'error' });
                setTimeout(() => setMsg({ text: '', type: '' }), 1500);
            } else {
                setMsg({ text: 'ATTEMPTS EXHAUSTED. SKIPPING...', type: 'error' });
                setTimeout(() => {
                    if (currentIdx < questions.length - 1) {
                        setCurrentIdx(prev => prev + 1);
                        setAttempts(0);
                        setUserCode('');
                        setMsg({ text: '', type: '' });
                    } else {
                        finishGame(score); // Score didn't change
                    }
                }, 1500);
            }
        }
    };

    const formatTime = (t) => {
        const m = Math.floor(t / 60);
        const s = t % 60;
        return { mins: m.toString().padStart(2, '0'), secs: s.toString().padStart(2, '0') };
    };

    const getCGPA = () => {
        return ((score / 20) * 10).toFixed(2);
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
            <div className="scanlines" />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-600/5 blur-[120px] pointer-events-none" />

            <AnimatePresence mode="wait">
                {phase === 'login' && (
                    <div className="flex flex-col items-center gap-6 w-full max-w-5xl">
                        <ParticipantLogin
                            eventTitle="Code Rush"
                            themeColor="emerald"
                            onBack={onBack}
                            onLogin={() => {
                                let bank = CODE_RUSH_SET_1;
                                if (formData.course === 'B.TECH' && (formData.branch === 'CSE' || formData.branch === 'CSM' || formData.branch === 'CSD')) {
                                    const year = parseInt(formData.year);
                                    if (year > 1) {
                                        bank = CODE_RUSH_SET_2;
                                    }
                                }
                                setQuestionBank(bank);
                                setStartTime(Date.now());
                                setPhase('game');
                            }}
                            formData={formData}
                            setFormData={setFormData}
                            msg={msg.text}
                            setMsg={(text) => setMsg({ text, type: 'error' })}
                            showTeamOption={false}
                            rules={[
                                '10 Progressive coding challenges',
                                'Choice of Language: C, Java, Python',
                                'Attempt 1: 2.0 Points | Attempt 2: 1.0 Point | Attempt 3: 0.5 Points',
                                'Final Rank in CGPA format based on time and accuracy.'
                            ]}
                        />
                        <div className="w-full bg-[#0a0a0f]/90 border border-white/5 backdrop-blur-3xl p-8 rounded-[2rem] shadow-xl space-y-4">
                            <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest gaming-font ml-1">SELECT DEPLOYMENT ENVIRONMENT</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['Python', 'C', 'Java'].map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => setFormData(p => ({ ...p, language: lang }))}
                                        className={`py-4 rounded-xl font-black gaming-font text-sm tracking-widest border transition-all ${formData.language === lang ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-500 hover:border-emerald-600/50'}`}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'game' && (
                    <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Header Area */}
                        <div className="lg:col-span-12 flex justify-between items-center bg-[#0a0a0f] p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
                            <div>
                                <h1 className="text-2xl font-black gaming-font italic text-emerald-600 tracking-tighter">TASK_{currentIdx + 1}</h1>
                                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{questions[currentIdx].title} :: {formData.language}</p>
                            </div>
                            <div className="flex gap-8 items-center">
                                <div className="px-6 py-2 bg-black/60 rounded-xl border border-emerald-600/20 flex items-center gap-4 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                    <Timer size={16} className="animate-pulse" />
                                    <div className="flex items-baseline gap-1 gaming-font">
                                        <span className="text-2xl font-black italic tracking-widest">{formatTime(timer).mins}</span>
                                        <span className="text-xs font-black opacity-40 uppercase">m</span>
                                        <span className="text-2xl font-black italic tracking-widest ml-1">{formatTime(timer).secs}</span>
                                        <span className="text-xs font-black opacity-40 uppercase">s</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] text-gray-500 gaming-font uppercase tracking-widest block">ATTEMPT</span>
                                    <span className="text-xl font-black gaming-font text-white">{attempts + 1}/3</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] text-gray-500 gaming-font uppercase tracking-widest block">CURRENT SCORE</span>
                                    <span className="text-xl font-black gaming-font text-emerald-500">{score.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Prompt Area */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-8 backdrop-blur-xl h-full shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600" />
                                <h3 className="text-emerald-500 font-black gaming-font text-xs uppercase tracking-widest mb-4">SPECIFICATIONS</h3>
                                <p className="text-lg text-gray-200 leading-relaxed font-medium italic">
                                    "{questions[currentIdx].prompt}"
                                </p>
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-gray-500 mb-4">
                                        <Code2 size={16} />
                                        <span className="text-[10px] uppercase font-bold tracking-widest">Expected Result</span>
                                    </div>
                                    <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-emerald-400">
                                        Execution must satisfy logic requirements for {formData.language}.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div className="lg:col-span-8 flex flex-col h-[500px]">
                            <div className="bg-[#0f0f15] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl">
                                <div className="bg-[#1a1a25] px-6 py-3 flex items-center justify-between border-b border-white/5">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono italic">terminal.main.{formData.language.toLowerCase()}</span>
                                </div>
                                <textarea
                                    ref={editorRef}
                                    value={userCode}
                                    onChange={(e) => setUserCode(e.target.value)}
                                    placeholder={`// Write your ${formData.language} code here...`}
                                    className="flex-1 bg-transparent p-8 font-mono text-lg text-emerald-400 focus:outline-none resize-none placeholder:text-emerald-900/40"
                                    spellCheck="false"
                                />
                                <div className="p-6 bg-[#0a0a0f] border-t border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <p className={`text-[10px] gaming-font uppercase italic transition-all ${msg.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {msg.text || (attempts > 0 ? `TRYING AGAIN [${attempts + 1}/3]` : 'READY FOR EXECUTION')}
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={validateCode}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-black gaming-font text-xs tracking-widest flex items-center gap-2 transition-colors italic"
                                    >
                                        EXECUTE <Play size={14} fill="currentColor" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {phase === 'result' && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-2xl bg-[#0a0a0f] border-2 border-emerald-600 rounded-[4rem] p-14 text-center shadow-[0_0_80px_rgba(16,185,129,0.3)] backdrop-blur-3xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600" style={{ boxShadow: '0 0 20px #059669' }} />
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="w-40 h-40 bg-emerald-600/10 rounded-[3.5rem] flex items-center justify-center mx-auto mb-12 border-4 border-emerald-600 shadow-[0_0_80px_rgba(16,185,129,0.4)] rotate-3"
                        >
                            <Trophy size={80} className="text-emerald-500" />
                        </motion.div>
                        <h1 className="text-6xl font-black gaming-font text-white mb-2 tracking-tighter italic">CHALLENGE COMPLETED</h1>
                        <p className="text-emerald-600 gaming-font text-sm mb-14 tracking-[0.6em] font-black uppercase italic">Efficiency Report Generated</p>

                        <div className="grid grid-cols-2 gap-8 mb-14">
                            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                                <p className="text-xs text-gray-500 gaming-font uppercase tracking-widest mb-2 font-black italic">FINAL GRADE</p>
                                <p className="text-5xl font-black text-white gaming-font">{getCGPA()}<span className="text-xs text-gray-600 ml-1">/10</span></p>
                            </div>
                            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                                <p className="text-xs text-gray-500 gaming-font uppercase tracking-widest mb-2 font-black italic">TIME TAKEN</p>
                                <div className="flex items-baseline justify-center gap-2 gaming-font text-emerald-600">
                                    <span className="text-5xl font-black italic tracking-tighter">{formatTime(timer).mins}</span>
                                    <span className="text-sm font-black opacity-40 uppercase">MIN</span>
                                    <span className="text-5xl font-black italic tracking-tighter ml-2">{formatTime(timer).secs}</span>
                                    <span className="text-sm font-black opacity-40 uppercase">SEC</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-14 text-left bg-black/40 p-10 rounded-[2.5rem] border border-white/5 shadow-inner relative">
                            <div className="absolute top-0 right-10 w-px h-full bg-white/5" />
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 uppercase tracking-widest font-black italic">CODER_ID::</span>
                                <span className="font-bold text-white tracking-widest italic">{formData.rollNo}</span>
                            </div>
                            {formData.isTeam && (
                                <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3">
                                    <span className="text-gray-600 uppercase tracking-widest font-black italic">ALLY_ID::</span>
                                    <span className="font-bold text-emerald-600 tracking-widest italic">{formData.teammateRollNo}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3">
                                <span className="text-gray-600 uppercase tracking-widest font-black italic">LANGUAGE_USED::</span>
                                <span className="font-bold text-emerald-600 tracking-widest italic">{formData.language}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-white/5 pt-6">
                                <span className="text-gray-600 uppercase tracking-widest font-black italic">POINTS_SECURED::</span>
                                <span className="font-black text-white text-2xl italic tracking-tighter">{score.toFixed(1)} <span className="text-gray-700 mx-2">/</span> 20.0</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#10b981' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onFinish}
                            className="w-full py-8 bg-emerald-600 text-white font-black gaming-font rounded-3xl uppercase tracking-[0.5em] italic shadow-2xl text-xl transition-colors"
                        >
                            Submit Assessment
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CodeRush;
