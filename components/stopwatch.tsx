"use client";
import { useState, useEffect } from "react";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [code, setCode] = useState("");
  const correctCode = "1234"; // Change this to your escape room code

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const startGame = () => {
    setTime(0);
    setRunning(true);
  };

  const checkCode = () => {
    if (code === correctCode) {
      setRunning(false); // Stop the timer only if the correct code is entered
      alert(`✅ Correct Code! Game Over. Time: ${formatTime(time)}`);
    } else {
      alert("❌ Wrong Code! Try again."); // Timer keeps running
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <h1 className="text-2xl font-bold">Escape Room Timer</h1>
      <div className="text-4xl font-mono">{formatTime(time)}</div>
      <button 
        onClick={startGame} 
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={running}
      >
        Start Game
      </button>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter Code"
        className="border p-2 rounded"
      />
      <button 
        onClick={checkCode} 
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit Code
      </button>
    </div>
  );
}
