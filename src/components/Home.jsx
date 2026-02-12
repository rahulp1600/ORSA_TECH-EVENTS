import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Home = ({ onStart }) => {
    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
            <div className="scanlines" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="z-10 text-center"
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-white/60 tracking-[0.3em] text-xs md:text-sm mb-2 gaming-font"
                >
                    WELCOME TO
                </motion.p>

                <div className="glitch-wrapper mb-4">
                    <h1
                        className="glitch-text text-5xl md:text-8xl font-black text-white tracking-tighter"
                        data-text="ORSA-26"
                    >
                        ORSA-26
                    </h1>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-cyan-400 tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-base mb-12 gaming-font"
                >
                    TECHNICAL EVENTS
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px var(--accent-glow)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="group relative px-12 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold overflow-hidden transition-all duration-300 hover:text-black"
                >
                    <div className="absolute inset-0 w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full -z-10" />
                    <span className="flex items-center gap-2 gaming-font">
                        <Play size={18} fill="currentColor" />
                        ENTER
                    </span>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
                </motion.button>
            </motion.div>

            {/* Admin Access Logo - Top Right Corner */}
            <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-8 right-8 z-50 cursor-pointer group"
                onClick={() => onStart('admin-login')}
            >
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 overflow-hidden bg-white/5 backdrop-blur-sm border-2 border-transparent group-hover:border-cyan-400">
                    <img
                        src="/orsa_logo.png"
                        alt="ORSA Admin"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
                    />
                </div>
            </motion.div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>
        </div>
    );
};

export default Home;
