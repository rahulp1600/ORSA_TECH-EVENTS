import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, ChevronRight, Trophy, ArrowLeft, KeyRound, Lightbulb, AlertTriangle, Users, Timer } from 'lucide-react';
import ParticipantLogin from './ParticipantLogin';

import { TECH_PICTO_SET_1, TECH_PICTO_SET_2, PHARMACY_PICTO_CHALLENGES, MBA_PICTO_CHALLENGES } from '../data/techPictoData';
import { saveGameResult } from '../firebase';

const ACCESS_CODE = "picto2468";

const TechPicto = ({ onBack, onFinish }) => {
    const [phase, setPhase] = useState('login'); // 'login', 'game', 'result'
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        course: '',
        year: '',
        branch: 'CSE',
        isTeam: false,
        teammateRollNo: '',
        accessCode: ''
    });
    const [challenges, setChallenges] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [attempts, setAttempts] = useState(2);
    const [userInput, setUserInput] = useState("");
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [timer, setTimer] = useState(0);
    const [msg, setMsg] = useState('');
    const [warningCount, setWarningCount] = useState(0);


    // --- SECURITY FEATURES ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && phase === 'game') {
                setWarningCount(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 2) {
                        setMsg('🚫 SESSION TERMINATED: MULTIPLE TAB SWITCHES!');
                        finishPicto(score, correctCount);
                    } else {
                        setMsg('⚠️ WARNING 1/2: TAB SWITCHING DETECTED! NEXT WILL TERMINATE.');
                    }
                    return newCount;
                });
            }
        };

        const handleBlur = () => {
            if (phase === 'game') {
                setMsg(prev => prev.includes('WARNING') ? prev : '⚠️ WARNING: FOCUS LOST!');
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
        window.addEventListener("blur", handleBlur); // Added Blur detection
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
        let liveTimer;
        if (phase === 'game' && startTime) {
            liveTimer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setTimer(elapsed);
                if (elapsed >= 2400) { // 40 minutes
                    clearInterval(liveTimer);
                    finishPicto(score, correctCount);
                }
            }, 1000);
        }
        return () => clearInterval(liveTimer);
    }, [phase, startTime, score, correctCount]);




    const handleAnswer = (e) => {
        if (e) e.preventDefault();

        // Strip all spaces and convert to uppercase for robust matching
        const cleanInput = userInput.replace(/\s+/g, '').toUpperCase();
        const cleanTarget = challenges[currentIdx].target.replace(/\s+/g, '').toUpperCase();

        const correct = cleanInput === cleanTarget;

        // Calculate new score locally to handle React state updates
        let points = 0;
        let newScore = score;
        let newCorrectCount = correctCount;

        if (correct) {
            points = 2;
            if (attempts === 1) points = 1;
            newScore = score + points;
            newCorrectCount = correctCount + 1;

            setScore(newScore);
            setCorrectCount(newCorrectCount);
            proceed(newScore, newCorrectCount);
        } else {
            const nextAttempts = attempts - 1;
            if (nextAttempts <= 0) {
                // Incorrect after all attempts
                // newScore is same as old score
                proceed(newScore, newCorrectCount);
            } else {
                setAttempts(nextAttempts);
                setMsg("INCORRECT ATTEMPT - TRY AGAIN");
                setTimeout(() => setMsg(''), 2000);
            }
        }
    };

    const proceed = (currentScore, currentCorrect) => {
        if (currentIdx < challenges.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setAttempts(2);
            setUserInput("");
        } else {
            finishPicto(currentScore, currentCorrect);
        }
    };

    const finishPicto = (finalScore = score, finalCorrect = correctCount) => {
        const finishTime = Date.now();
        setEndTime(finishTime);
        setPhase('result');

        const timeTaken = Math.floor((finishTime - startTime) / 1000);
        const maxScore = challenges.length * 2;
        const cgpa = maxScore > 0 ? ((finalScore / maxScore) * 10).toFixed(2) : "0.00";

        saveGameResult('techpicto', {
            name: formData.name,
            rollNo: formData.rollNo,
            course: formData.course,
            year: formData.year,
            branch: formData.branch,
            isTeam: formData.isTeam,
            teammateRollNo: formData.teammateRollNo,
            score: finalScore,
            correctCount: finalCorrect,
            totalQuestions: challenges.length,
            timeTaken: timeTaken,
            cgpa: cgpa,
            accessCode: formData.accessCode
        });
    };

    const handleSkip = () => {
        if (currentIdx < challenges.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setAttempts(2);
            setUserInput("");
            setMsg("CHALLENGE SKIPPED");
            setTimeout(() => setMsg(''), 1000);
        } else {
            finishPicto();
        }
    };

    const handleManualSubmit = () => {
        if (window.confirm("Are you sure you want to submit your assessment now?")) {
            finishPicto();
        }
    };


    const formatTime = (t) => {
        const m = Math.floor(t / 60);
        const s = t % 60;
        return { mins: m.toString().padStart(2, '0'), secs: s.toString().padStart(2, '0') };
    };

    const getCGPA = () => {
        const maxScore = challenges.length * 2;
        if (maxScore === 0) return "0.00";
        return ((score / maxScore) * 10).toFixed(2);
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
            <div className="scanlines" />

            <AnimatePresence mode="wait">
                {phase === 'login' && (
                    <ParticipantLogin
                        eventTitle="Tech Picto"
                        themeColor="yellow"
                        onBack={onBack}
                        onLogin={() => {
                            let bank = [...TECH_PICTO_SET_1]; // Default to Set 1

                            if (formData.course === 'B.PHARM' || formData.course === 'PHARM D' || formData.course === 'M.PHARM') {
                                bank = [...PHARMACY_PICTO_CHALLENGES];
                            } else if (formData.course === 'MBA') {
                                bank = [...MBA_PICTO_CHALLENGES];
                            } else if (formData.course === 'B.TECH' && formData.branch === 'CSE') {
                                const year = parseInt(formData.year);
                                if (year > 1) {
                                    bank = [...TECH_PICTO_SET_2];
                                }
                            }

                            // Jumble Feature: Shuffle the bank
                            const shuffledBank = bank.sort(() => Math.random() - 0.5);

                            setChallenges(shuffledBank);
                            setStartTime(Date.now());
                            setPhase('game');
                        }}
                        formData={formData}
                        setFormData={setFormData}
                        msg={msg}
                        setMsg={setMsg}
                        accessCode={ACCESS_CODE}
                        showTeamOption={true}
                        rules={[
                            'Connect visual data points to decrypt technical concepts',
                            'Analyze 7 technical pictogram sequences',
                            'Identify core computing concepts correctly',
                            '2 attempts per challenge before automated skip',
                            'Team collaboration protocol active (Max 2 Pilots)'
                        ]}
                    />
                )}

                {phase === 'game' && (
                    <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl relative z-10 flex flex-col items-center">
                        {/* Header Row */}
                        <div className="w-full max-w-5xl flex justify-between items-end mb-12 px-2">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-4xl font-black gaming-font italic text-yellow-500 tracking-tighter leading-none">TECH PICTO</h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-[10px] text-gray-600 font-mono tracking-[0.5em] uppercase">CHALLENGE {currentIdx + 1} / {challenges.length}</p>
                                    <div className="flex items-center gap-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                                        <Timer size={14} className="animate-pulse" />
                                        <div className="flex items-baseline gap-0.5 gaming-font">
                                            <span className="text-xl font-black italic tracking-widest">{formatTime(Math.max(0, 2400 - timer)).mins}</span>
                                            <span className="text-[10px] font-black opacity-40 uppercase">m</span>
                                            <span className="text-xl font-black italic tracking-widest ml-1">{formatTime(Math.max(0, 2400 - timer)).secs}</span>
                                            <span className="text-[10px] font-black opacity-40 uppercase">s</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attempt Dots in Header */}
                            <div className="flex flex-col items-center gap-2 pb-1">
                                <span className="text-[9px] text-gray-600 gaming-font uppercase tracking-widest font-black">ATTEMPTS</span>
                                <div className="flex gap-2">
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className={`w-2.5 h-2.5 rounded-full border border-white/10 transition-all duration-500 ${i < attempts ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-red-900/40'}`} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-[9px] text-gray-600 gaming-font uppercase tracking-widest mb-1 font-black">SCORE</span>
                                <span className="text-4xl font-black gaming-font text-white leading-none shadow-[0_0_20px_rgba(255,255,255,0.05)] border-b-2 border-yellow-500/20 pb-1 italic">{score}</span>
                            </div>
                        </div>


                        {/* Main Arena */}
                        <div className="w-full bg-[#0a0a0f]/95 border border-white/10 rounded-[2.5rem] p-12 lg:p-16 shadow-2xl backdrop-blur-3xl relative flex flex-col items-center justify-center space-y-12 overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 blur-[120px] pointer-events-none" />

                            {/* Images Section */}
                            <div className="w-full flex flex-wrap items-center justify-center gap-4 lg:gap-8">
                                {challenges[currentIdx] && challenges[currentIdx].images.map((img, i) => (
                                    <React.Fragment key={i}>
                                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }} className="relative group w-28 lg:w-40 xl:w-48 aspect-square rounded-2xl overflow-hidden border-2 border-white/5 hover:border-yellow-500/50 hover:scale-105 transition-all duration-500 shadow-2xl">
                                            <div className="absolute top-2 left-2 z-10 bg-yellow-500 font-black text-[8px] px-1.5 py-0.5 rounded text-black uppercase italic tracking-tighter border border-black/10">Part_0{i + 1}</div>
                                            <img src={img} alt="Pictogram Part" className="w-full h-full object-cover transition-all duration-700" loading="eager" />
                                        </motion.div>
                                        {i < challenges[currentIdx].images.length && (
                                            <div className="text-2xl font-light text-gray-800 opacity-50 px-1">
                                                {i === challenges[currentIdx].images.length - 1 ? '=' : '+'}
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                                <div className="w-28 lg:w-40 xl:w-48 aspect-square rounded-2xl border-4 border-dashed border-white/5 flex items-center justify-center bg-white/[0.02] shadow-inner">
                                    <span className="text-7xl font-black text-white/5 select-none font-mono">?</span>
                                </div>
                            </div>

                            {/* Input and Action Section */}
                            <form onSubmit={handleAnswer} className="w-full max-w-xl flex flex-col items-center space-y-10">
                                <div className="w-full relative">
                                    <input
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder="IDENTIFY THE CONCEPT..."
                                        className="w-full bg-black/40 border-b-2 border-white/5 p-5 text-3xl font-black text-center text-white focus:outline-none focus:border-yellow-500 transition-all placeholder:text-white/5 uppercase font-mono tracking-[0.2em] italic shadow-inner"
                                        autoFocus
                                    />
                                    <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
                                </div>

                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-4 flex items-center justify-center">
                                        {msg && <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse italic">{msg}</p>}
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={handleSkip}
                                            className="px-6 py-3 rounded-xl border border-white/5 text-gray-500 hover:text-white hover:bg-white/5 text-[10px] gaming-font uppercase transition-all tracking-widest"
                                        >
                                            Skip Pattern
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleManualSubmit}
                                            className="px-6 py-3 rounded-xl border border-red-900/40 text-red-500 hover:bg-red-500/10 text-[10px] gaming-font uppercase transition-all tracking-widest"
                                        >
                                            End Session
                                        </button>
                                    </div>
                                </div>

                                <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full max-w-sm py-5 bg-yellow-500 text-black font-black gaming-font rounded-xl uppercase tracking-[0.3em] italic shadow-xl shadow-yellow-500/20 text-xl hover:bg-yellow-400 transition-all">SUBMIT SOLUTION</motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {phase === 'result' && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-xl bg-[#0a0a0f] border-2 border-yellow-500 rounded-[3rem] p-12 text-center shadow-[0_0_80px_rgba(234,179,8,0.2)] backdrop-blur-3xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 shadow-[0_0_15px_#eab308]" />
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-32 h-32 bg-yellow-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border-4 border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
                            <Trophy size={64} className="text-yellow-500" />
                        </motion.div>
                        <h1 className="text-5xl font-black gaming-font text-white mb-2 tracking-tighter italic uppercase">CHALLENGE COMPLETE</h1>
                        <p className="text-yellow-500 gaming-font text-[10px] mb-12 tracking-[0.5em] font-black uppercase italic opacity-80">Decryption Success Protocol</p>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-gray-500 gaming-font uppercase tracking-widest mb-1 font-black italic">CGPA SCORE</p>
                                <p className="text-4xl font-black text-white gaming-font">{getCGPA()}</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-gray-500 gaming-font uppercase tracking-widest mb-1 font-black italic">TIME TAKEN</p>
                                <div className="flex items-baseline justify-center gap-1 gaming-font text-yellow-500">
                                    <span className="text-4xl font-black italic tracking-tighter">{formatTime(timer).mins}</span>
                                    <span className="text-[10px] font-black opacity-40 uppercase">MIN</span>
                                    <span className="text-4xl font-black italic tracking-tighter ml-1">{formatTime(timer).secs}</span>
                                    <span className="text-[10px] font-black opacity-40 uppercase">SEC</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-12 text-left bg-black/40 p-8 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-gray-500 uppercase tracking-widest font-black italic">PILOT ID:</span>
                                <span className="font-bold text-white tracking-widest italic">{formData.rollNo}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-3 mt-3">
                                <span className="text-gray-500 uppercase tracking-widest font-black italic">PATTERNS_SECURED::</span>
                                <span className="font-bold text-yellow-500 tracking-widest italic">{correctCount} / {challenges.length}</span>
                            </div>
                            {formData.isTeam && (
                                <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-3 mt-3">
                                    <span className="text-gray-500 uppercase tracking-widest font-black italic">ALLIANCE:</span>
                                    <span className="font-bold text-yellow-500 tracking-widest italic">{formData.teammateRollNo}</span>
                                </div>
                            )}
                        </div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onFinish} className="w-full py-6 bg-yellow-500 text-black font-black gaming-font rounded-2xl uppercase tracking-[0.4em] italic shadow-lg hover:bg-yellow-400 transition-all text-lg">Return to Base</motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TechPicto;
