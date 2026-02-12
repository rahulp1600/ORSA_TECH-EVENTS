import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Timer, Trophy, ArrowLeft } from 'lucide-react';
import ParticipantLogin from './ParticipantLogin';

import { WORD_HUNT_BANK as BANK } from '../data/wordHuntData';
import { saveGameResult } from '../firebase';

const ACCESS_CODE = "word2468";

const WordHunt = ({ onBack, onFinish }) => {
    const [phase, setPhase] = useState('login'); // 'login', 'loading', 'game', 'result'
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
    const [msg, setMsg] = useState('');

    const [words, setWords] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [grid, setGrid] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [completedCells, setCompletedCells] = useState([]);
    const [foundIndices, setFoundIndices] = useState(new Set());
    const [startTime, setStartTime] = useState(null);
    const [timer, setTimer] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [score, setScore] = useState(0);
    // Removed startCell state, using direct selection array logic

    const generatePuzzle = (wordList) => {
        const size = 12; // Increased to 12x12 for better fitting of long technical words
        let gridArr;
        let success = false;
        let mainAttempts = 0;

        const sortedWords = [...wordList].sort((a, b) => b[0].length - a[0].length);
        const dirs = [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]];

        while (!success && mainAttempts < 50) {
            mainAttempts++;
            gridArr = Array.from({ length: size }, () => Array(size).fill(''));
            success = true;

            for (const [word] of sortedWords) {
                let placed = false;
                let wordAttempts = 0;
                while (!placed && wordAttempts < 500) {
                    let [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
                    let r = Math.floor(Math.random() * size);
                    let c = Math.floor(Math.random() * size);
                    let ok = true;
                    for (let i = 0; i < word.length; i++) {
                        let nr = r + dr * i, nc = c + dc * i;
                        if (nr < 0 || nr >= size || nc < 0 || nc >= size || (gridArr[nr][nc] && gridArr[nr][nc] !== word[i])) {
                            ok = false; break;
                        }
                    }
                    if (ok) {
                        for (let i = 0; i < word.length; i++) gridArr[r + dr * i][c + dc * i] = word[i];
                        placed = true;
                    }
                    wordAttempts++;
                }
                if (!placed) {
                    success = false;
                    break; // Restart the whole grid generation
                }
            }
        }

        for (let r = 0; r < size; r++)
            for (let c = 0; c < size; c++)
                if (!gridArr[r][c]) gridArr[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));

        setGrid(gridArr);
    };

    const [isDragging, setIsDragging] = useState(false);
    // Remove complex start/end cell logic, use simple array state 'selectedCells' directly.
    // We also need 'direction' state to persist across non-drag interactions
    const [direction, setDirection] = useState(null);

    // Helper to clear selection
    const clearSelection = useCallback(() => {
        setSelectedCells([]);
        setDirection(null);
        setIsDragging(false);
    }, []);

    // Core Logic: Attempt to add cell (r, c) to selection
    const attemptSelect = useCallback((r, c) => {
        if (!words[currentIdx]) return;
        const targetWord = words[currentIdx][0];

        setSelectedCells(prev => {
            // 1. New Selection
            if (prev.length === 0) {
                // Allow ANY starting letter (per user request)
                return [{ r, c, char: grid[r][c] }];
            }

            const last = prev[prev.length - 1];

            // Ignore if same as last cell (duplicate event)
            if (last.r === r && last.c === c) return prev;

            // 2. Check Adjacency & Direction
            const dr = r - last.r;
            const dc = c - last.c;

            // Must be adjacent
            if (Math.abs(dr) > 1 || Math.abs(dc) > 1) {
                clearSelection();
                return [];
            }

            // Determine or Validate Direction
            let newDir = direction;
            if (prev.length === 1) {
                newDir = { dr, dc };
                setDirection(newDir);
            } else {
                // Must match existing direction
                if (direction && (Math.abs(dr - direction.dr) > 0.1 || Math.abs(dc - direction.dc) > 0.1)) {
                    clearSelection();
                    return [];
                }
            }

            // 3. Check Prefix Match (Strict against Target)
            // Construct the candidate string to verify if it's a valid prefix of the target
            const newChar = grid[r][c];
            const currentStr = prev.map(s => s.char).join('');
            const candidateStr = currentStr + newChar;

            if (!targetWord.startsWith(candidateStr)) {
                clearSelection();
                return [];
            }

            // 4. Valid Step - Add
            const newSel = [...prev, { r, c, char: newChar }];

            // 5. Check Completion
            if (newSel.length === targetWord.length) {
                // Word Completed!
                const solvedIdx = currentIdx;

                // Process win after small delay to show full selection
                setTimeout(() => {
                    setFoundIndices(oldFound => {
                        const nextFound = new Set(oldFound);
                        nextFound.add(solvedIdx);

                        const cellKeys = newSel.map(s => `${s.r}-${s.c}`);
                        setCompletedCells(completed => [...new Set([...completed, ...cellKeys])]);
                        setScore(nextFound.size);

                        if (nextFound.size === words.length) {
                            const finishTime = Date.now();
                            setEndTime(finishTime);
                            setPhase('result');
                            const timeTaken = Math.floor((finishTime - startTime) / 1000);
                            saveGameResult('wordhunt', {
                                ...formData,
                                score: nextFound.size,
                                totalWords: words.length,
                                timeTaken,
                                cgpa: ((nextFound.size / words.length) * 10).toFixed(2)
                            });
                        } else {
                            setCurrentIdx(curr => curr + 1);
                        }
                        return nextFound;
                    });

                    // Clear selection
                    setDirection(null);
                    setSelectedCells([]);
                }, 100);

                return newSel;
            }

            return newSel;
        });
    }, [grid, words, currentIdx, direction, clearSelection, saveGameResult, formData, startTime]);

    const handleMouseDown = (r, c) => {
        if (phase !== 'game') return;
        setIsDragging(true);
        attemptSelect(r, c);
    };

    const handleMouseEnter = (r, c) => {
        if (phase !== 'game') return;
        if (isDragging) {
            attemptSelect(r, c);
        }
    };

    const handleTouchStart = (e, r, c) => {
        if (phase !== 'game') return;
        setIsDragging(true);
        attemptSelect(r, c);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const cell = el?.closest('[data-pos]');
        if (cell && cell.dataset.pos) {
            const [tr, tc] = cell.dataset.pos.split('-').map(Number);
            attemptSelect(tr, tc);
        }
    };

    useEffect(() => {
        const handleEnd = () => {
            setIsDragging(false);
            // DO NOT CLEAR SELECTION ON MOUSE UP
        };
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd, { passive: false });
        return () => {
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };
    }, []);

    // --- SECURITY FEATURES ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && phase === 'game') {
                setMsg('TAB SWITCH DETECTED! THIS INCIDENT HAS BEEN LOGGED.');
                setTimeout(() => setMsg(''), 5000);
            }
        };

        const handleKeyDown = (e) => {
            if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) {
                e.preventDefault();
                setMsg('INSPECT ELEMENT IS DISABLED!');
                setTimeout(() => setMsg(''), 3000);
            }
        };

        const preventRightClick = (e) => e.preventDefault();

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("contextmenu", preventRightClick);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("contextmenu", preventRightClick);
        };
    }, [phase]);

    useEffect(() => {
        let interval;
        if (phase === 'game' && startTime) {
            interval = setInterval(() => setTimer(Math.floor((Date.now() - startTime) / 1000)), 1000);
        }
        return () => clearInterval(interval);
    }, [phase, startTime]);

    const formatTime = (t) => {
        const m = Math.floor(t / 60);
        const s = t % 60;
        return { mins: m.toString().padStart(2, '0'), secs: s.toString().padStart(2, '0') };
    };

    const getCGPA = () => {
        const total = words.length || 15;
        return ((score / total) * 10).toFixed(2);
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="scanlines pointer-events-none" />
            {phase !== 'game' && (
                <button onClick={onBack} className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors gaming-font text-sm">
                    <ArrowLeft size={16} /> BACK TO TERMINAL
                </button>
            )}

            <AnimatePresence mode="wait">
                {phase === 'login' && (
                    <div className="flex flex-col items-center gap-6 w-full max-w-5xl">
                        <ParticipantLogin
                            eventTitle="Word Hunt"
                            themeColor="cyan"
                            onBack={onBack}
                            onLogin={() => {
                                setPhase('loading');
                                setTimeout(() => {
                                    let key = formData.branch;
                                    if (formData.course === 'B.TECH' || formData.course === 'B.PHARM' || formData.course === 'PHARM D' || formData.course === 'MBA') {
                                        const prefix = (formData.course === 'MBA') ? 'MBA' : (formData.course === 'B.TECH' ? formData.branch : 'PHARMACY');
                                        let yearSuffix = formData.year;
                                        key = `${prefix}_${yearSuffix}`;
                                    }
                                    const branchWords = [...(BANK[key] || BANK[formData.branch] || BANK.CSE)].sort(() => Math.random() - 0.5).slice(0, 15);
                                    setWords(branchWords);
                                    generatePuzzle(branchWords);
                                    setFoundIndices(new Set());
                                    setCurrentIdx(0);
                                    setCompletedCells([]);
                                    setStartTime(Date.now());
                                    setPhase('game');
                                }, 2000);
                            }}
                            formData={formData}
                            setFormData={setFormData}
                            msg={msg}
                            setMsg={setMsg}
                            showTeamOption={false}
                            rules={[
                                'Locate 15 Technical terms in the grid matrix',
                                'Earn points for each technical term located',
                                'Be quick and hunt the words fast to secure your rank',
                                'Drag or click to select letters in any direction'
                            ]}
                        />
                    </div>
                )}

                {phase === 'loading' && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_20px_rgba(34,211,238,0.2)]" />
                        <p className="gaming-font text-cyan-400 animate-pulse tracking-widest uppercase">Initializing System...</p>
                    </motion.div>
                )}

                {phase === 'game' && (
                    <motion.div key="game" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl grid lg:grid-cols-[1fr_350px] gap-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="px-6 py-2 bg-black/60 rounded-xl border border-cyan-400/20 flex items-center gap-4 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                                    <Timer size={16} className="animate-pulse" />
                                    <div className="flex items-baseline gap-1 gaming-font">
                                        <span className="text-2xl font-black italic tracking-widest">{formatTime(timer).mins}</span>
                                        <span className="text-xs font-black opacity-40 uppercase">m</span>
                                        <span className="text-2xl font-black italic tracking-widest ml-1">{formatTime(timer).secs}</span>
                                        <span className="text-xs font-black opacity-40 uppercase">s</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 gaming-font uppercase tracking-widest">Score</p>
                                    <p className="text-white gaming-font text-xl">{foundIndices.size} / {words.length}</p>
                                </div>
                            </div>
                            <div
                                className="grid grid-cols-12 gap-1.5 md:gap-2 mb-6 aspect-square max-w-[550px] mx-auto touch-none"
                            >
                                {grid.map((row, r) => row.map((char, c) => {
                                    const isSelected = selectedCells.some(s => s.r === r && s.c === c);
                                    const isDone = completedCells.includes(`${r}-${c}`);
                                    return (
                                        <div
                                            key={`${r}-${c}`}
                                            onMouseDown={() => handleMouseDown(r, c)}
                                            onMouseEnter={() => handleMouseEnter(r, c)}
                                            onTouchStart={(e) => handleTouchStart(e, r, c)}
                                            onTouchMove={handleTouchMove}
                                            data-pos={`${r}-${c}`}
                                            className={`aspect-square flex items-center justify-center text-sm md:text-lg font-black rounded cursor-pointer transition-all duration-200 select-none ${isSelected ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]' : isDone ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20'}`}
                                        >
                                            {char}
                                        </div>
                                    );
                                }))}
                            </div>
                            <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center">
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Current Word Draft</p>
                                <p className="text-2xl font-black text-white tracking-[0.5em] h-8">{selectedCells.map(s => s.char).join('')}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                                <h3 className="text-cyan-400 gaming-font text-lg mb-4 flex items-center gap-2"><Trophy size={18} /> CLUE</h3>
                                <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                                    <p className="text-gray-300 leading-relaxed italic">"{words[currentIdx]?.[1]}"</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="flex gap-1">{[...Array(words[currentIdx]?.[0].length || 0)].map((_, i) => <div key={i} className="w-4 h-1 bg-white/20 rounded" />)}</div>
                                        <span className="text-[10px] text-gray-500 gaming-font uppercase">{words[currentIdx]?.[0].length || 0} Letters</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex-grow">
                                <h3 className="text-gray-400 gaming-font text-xs mb-4 uppercase tracking-widest">Player Info</h3>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold truncate tracking-tight"><span className="text-gray-500">USER:</span> {formData.name}</p>
                                    <p className="text-sm font-bold truncate tracking-tight"><span className="text-gray-500">COURSE:</span> {formData.course}</p>
                                    <p className="text-sm font-bold truncate tracking-tight"><span className="text-gray-500">ID:</span> {formData.rollNo}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {phase === 'result' && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-2xl text-center shadow-2xl">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)]"><Trophy size={48} className="text-yellow-400" /></motion.div>
                        <h1 className="text-4xl font-black gaming-font text-white mb-2 tracking-widest">MISSION COMPLETED</h1>
                        <p className="text-cyan-400 gaming-font text-sm mb-8 tracking-[0.3em] uppercase">System Overload Successful 🎉</p>
                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-gray-500 gaming-font uppercase tracking-widest mb-1 font-black italic">CGPA SCORE</p>
                                <p className="text-4xl font-black text-white gaming-font">{getCGPA()}</p>
                            </div>
                            <div className="bg-white/5 p-8 rounded-2xl border border-white/5 shadow-inner">
                                <p className="text-xs text-gray-500 gaming-font uppercase tracking-widest mb-2 font-black italic">MISSION TIME</p>
                                <div className="flex items-baseline justify-center gap-2 gaming-font text-cyan-400">
                                    <span className="text-4xl font-black italic tracking-tighter">{formatTime(timer).mins}</span>
                                    <span className="text-[10px] font-black opacity-40 uppercase">MIN</span>
                                    <span className="text-4xl font-black italic tracking-tighter ml-2">{formatTime(timer).secs}</span>
                                    <span className="text-[10px] font-black opacity-40 uppercase">SEC</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 text-left bg-black/40 p-6 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2"><span className="text-gray-500 text-[10px] gaming-font uppercase">Pilot Name</span><span className="font-bold">{formData.rollNo}</span></div>
                            {formData.isTeam && (
                                <div className="flex justify-between items-center border-b border-white/10 pb-2"><span className="text-gray-500 text-[10px] gaming-font uppercase">Ally ID</span><span className="font-bold text-cyan-400">{formData.teammateRollNo}</span></div>
                            )}
                            <div className="flex justify-between items-center border-b border-white/10 pb-2"><span className="text-gray-500 text-[10px] gaming-font uppercase">Course Unit</span><span className="font-bold">{formData.course}</span></div>
                            <div className="flex justify-between items-center pt-2"><span className="text-gray-500 text-[10px] gaming-font uppercase">Execution Status</span><span className="text-cyan-400 font-black tracking-widest uppercase">SUCCESS</span></div>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onFinish} className="w-full py-4 bg-cyan-400 text-black font-black gaming-font rounded-lg uppercase">Return to Events</motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default WordHunt;
