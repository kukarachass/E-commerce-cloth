"use client";

import {useEffect, useState} from "react";

interface CountdownTimerProps {
    targetDate: Date;
}

function pad(n: number) {
    return String(n).padStart(2, "0");
}

export default function CountdownTimer({targetDate}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});

    useEffect(() => {
        function calc() {
            const diff = Math.max(0, targetDate.getTime() - Date.now());
            const days = Math.floor(diff / 86_400_000);
            const hours = Math.floor((diff % 86_400_000) / 3_600_000);
            const minutes = Math.floor((diff % 3_600_000) / 60_000);
            const seconds = Math.floor((diff % 60_000) / 1_000);
            setTimeLeft({days, hours, minutes, seconds});
        }

        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    const {days, hours, minutes, seconds} = timeLeft;

    return (
        <span className="text-red-500 font-mono">
      {pad(days)}:{pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
    );
}