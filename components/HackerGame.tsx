
import React, { useState, useEffect } from 'react';

const commands = [
    'nmap -sV -p 1-65535 target.com',
    'sqlmap -u "http://test.com/vuln.php?id=1" --dbs',
    'hydra -l user -P passlist.txt ssh://192.168.1.1',
    'john --wordlist=rockyou.txt hash.txt',
    'aircrack-ng -w passwords.txt capture.cap',
];

const HackerGame: React.FC = () => {
    const [currentCommand, setCurrentCommand] = useState('');
    const [typedCommand, setTypedCommand] = useState('');
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(15);
    const [isActive, setIsActive] = useState(false);
    const [result, setResult] = useState('');

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            endGame('Time is up! Access Denied.');
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timer]);

    const startGame = () => {
        setIsActive(true);
        setScore(0);
        setTimer(15);
        setResult('');
        nextCommand();
    };

    const nextCommand = () => {
        const next = commands[Math.floor(Math.random() * commands.length)];
        setCurrentCommand(next);
        setTypedCommand('');
        setTimer(15);
    };

    const endGame = (message: string) => {
        setIsActive(false);
        setResult(message);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTypedCommand(value);
        if (value === currentCommand) {
            setScore((prev) => prev + 1);
            if (score + 1 >= 3) {
                endGame('System Breached! You are a master hacker.');
            } else {
                nextCommand();
            }
        }
    };
    
    return (
        <div className="font-mono text-green-400 p-2 sm:p-4 text-left">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-cyan-300">[ HACKER SIMULATOR ]</h3>
            {!isActive ? (
                <div className="text-center">
                     <p className="mb-4 text-base sm:text-lg">{result || 'Objective: Type the commands exactly as they appear before time runs out. Breach 3 systems to win.'}</p>
                    <button onClick={startGame} className="bg-green-500 text-black px-6 py-2 rounded-md hover:bg-green-400 transition-colors">
                        Start Hacking
                    </button>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-4 text-base sm:text-lg">
                        <p>Score: {score}</p>
                        <p className={`font-bold ${timer < 6 ? 'text-red-500' : ''}`}>{timer}</p>
                    </div>
                    <p className="mb-2 text-gray-400 text-sm sm:text-base">&gt; Command to execute:</p>
                    <p className="bg-gray-800 p-2 rounded select-none break-words">{currentCommand}</p>
                    <div className="flex items-center mt-4">
                        <span className="text-cyan-400 mr-2">$</span>
                        <input
                            type="text"
                            value={typedCommand}
                            onChange={handleInputChange}
                            autoFocus
                            className="w-full bg-transparent border-0 focus:ring-0 text-green-400"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HackerGame;
