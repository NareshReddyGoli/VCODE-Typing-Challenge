import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { formatTime } from "../utils/calculateWPM";
import { generateTypingText } from "../utils/generateWordList";
import type { AttemptResult } from "../types";

interface TypingTestProps {
  contestTimeRemaining: number;
  attemptNumber: number;
  onSubmitAttempt: (result: AttemptResult) => void;
  onContestEnd: () => void;
}

const TypingTest: React.FC<TypingTestProps> = ({
  contestTimeRemaining,
  attemptNumber,
  onSubmitAttempt,
  onContestEnd,
}) => {
  const [words, setWords] = useState<string[]>(() =>
    generateTypingText(60).split(" ")
  );
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [wordStatuses, setWordStatuses] = useState<
    Array<"pending" | "correct" | "incorrect">
  >([]);
  const [charStatuses, setCharStatuses] = useState<string[][]>([]);

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStats, setCurrentStats] = useState({ wpm: 0, accuracy: 100 });

  // Use refs for values needed inside timer callbacks to avoid stale closures
  const correctCharsRef = useRef(0);
  const incorrectCharsRef = useRef(0);
  const totalTypedRef = useRef(0);
  const startTimeRef = useRef<Date | null>(null);
  const isFinishedRef = useRef(false);

  // Also keep state versions for rendering
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [caretPos, setCaretPos] = useState({ left: 0, top: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const endAttemptRef = useRef<() => void>(() => { });

  // Helper: update a char counter in both ref and state
  const addCorrect = (n: number) => { correctCharsRef.current += n; setCorrectChars(correctCharsRef.current); };
  const addIncorrect = (n: number) => { incorrectCharsRef.current += n; setIncorrectChars(incorrectCharsRef.current); };
  const addTotal = (n: number) => { totalTypedRef.current += n; setTotalTypedChars(totalTypedRef.current); };

  // Init statuses whenever words change
  useEffect(() => {
    setWordStatuses(words.map(() => "pending"));
    setCharStatuses(words.map((w) => w.split("").map(() => "pending")));
  }, [words]);

  // Combined: auto-scroll FIRST then compute caret (must be one effect)
  useLayoutEffect(() => {
    if (!activeWordRef.current || !wordsRef.current) return;
    const container = wordsRef.current;
    const wordEl = activeWordRef.current;

    // Step 1 — scroll if active word slipped below visible area
    const cRect = container.getBoundingClientRect();
    const wRect = wordEl.getBoundingClientRect();
    if (wRect.bottom > cRect.bottom - 4) {
      container.scrollTop += wRect.height + 8;
    }

    // Step 2 — measure caret AFTER scroll so scrollTop is fresh
    const containerRect = container.getBoundingClientRect();
    const allLetters = wordEl.querySelectorAll<HTMLElement>(".typletter, .typletter-extra");

    let left = 0, top = 0;
    if (allLetters.length === 0) {
      const wr = wordEl.getBoundingClientRect();
      left = wr.left - containerRect.left;
      top = wr.top - containerRect.top + container.scrollTop;
    } else if (currentInput.length === 0) {
      const lr = allLetters[0].getBoundingClientRect();
      left = lr.left - containerRect.left;
      top = lr.top - containerRect.top + container.scrollTop;
    } else {
      const idx = Math.min(currentInput.length, allLetters.length) - 1;
      const lr = (allLetters[idx] ?? allLetters[allLetters.length - 1]).getBoundingClientRect();
      left = lr.right - containerRect.left;
      top = lr.top - containerRect.top + container.scrollTop;
    }
    setCaretPos({ left, top });
  }, [currentInput, currentWordIndex]);

  // Contest global timeout
  useEffect(() => {
    if (contestTimeRemaining <= 0) {
      endAttemptRef.current();
      onContestEnd();
    }
  }, [contestTimeRemaining, onContestEnd]);

  // Per-attempt 60-second timer — uses endAttemptRef to avoid stale closure
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((t) => {
          const next = t - 1;
          if (next <= 0) {
            endAttemptRef.current();
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeRemaining]);

  // Live WPM/accuracy display while typing
  useEffect(() => {
    if (startTime && isActive) {
      const elapsed = (Date.now() - startTime.getTime()) / 60000;
      const wpm = elapsed > 0 ? Math.round(correctChars / 5 / elapsed) : 0;
      const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;
      setCurrentStats({ wpm, accuracy });
    }
  }, [correctChars, totalTypedChars, startTime, isActive]);

  // ── Attempt end — reads from REFS so it always has the latest values ────────
  // Using refs prevents the "final word chars missing" bug where setState
  // hasn't committed before handleAttemptEnd runs inside advanceWord.
  const handleAttemptEnd = useCallback(() => {
    if (!startTimeRef.current || isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFinished(true);
    setIsActive(false);

    const elapsed = (Date.now() - startTimeRef.current.getTime()) / 60000;
    const cc = correctCharsRef.current;
    const tt = totalTypedRef.current;
    const wpm = elapsed > 0 ? Math.round(cc / 5 / elapsed) : 0;
    const accuracy = tt > 0 ? Math.round((cc / tt) * 100) : 100;

    // Sync display stats with final values
    setCurrentStats({ wpm, accuracy });
    onSubmitAttempt({ attemptNumber, wpm, accuracy, timestamp: new Date() });
  }, [attemptNumber, onSubmitAttempt]);

  useEffect(() => { endAttemptRef.current = handleAttemptEnd; }, [handleAttemptEnd]);

  // ── Shared word-advance logic ───────────────────────────────────────────────
  // Reads wordStatuses directly to avoid stale closure; updates refs immediately
  const advanceWord = useCallback((typedValue: string, currentWord: string, currentIdx: number, currentWS: typeof wordStatuses, currentCS: typeof charStatuses) => {
    const isCorrect = typedValue === currentWord;
    const correctIn = typedValue.split("").filter((c, i) => c === currentWord[i]).length;
    const incorrectIn = typedValue.length - correctIn;

    // Update refs immediately (before state commits)
    correctCharsRef.current += correctIn;
    incorrectCharsRef.current += incorrectIn;
    totalTypedRef.current += typedValue.length;

    // Update state for rendering
    setCorrectChars(correctCharsRef.current);
    setIncorrectChars(incorrectCharsRef.current);
    setTotalTypedChars(totalTypedRef.current);

    const newWS = [...currentWS];
    newWS[currentIdx] = isCorrect ? "correct" : "incorrect";
    setWordStatuses(newWS);

    if (currentIdx < words.length - 1) {
      setCurrentWordIndex(currentIdx + 1);
      setCurrentInput("");

      // Update charStatuses: clear for next word
      const newCS = [...currentCS];
      newCS[currentIdx + 1] = words[currentIdx + 1].split("").map(() => "pending");
      setCharStatuses(newCS);
    } else {
      // Last word — call handleAttemptEnd which reads from refs, so it sees updated values
      handleAttemptEnd();
    }
  }, [words, handleAttemptEnd]);

  // ── Input change ────────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const value = e.target.value;
    const currentWord = words[currentWordIndex];

    if (!startTimeRef.current && value.length > 0) {
      const now = new Date();
      startTimeRef.current = now;
      setStartTime(now);
      setIsActive(true);
    }

    // Auto-advance when typed text exactly matches the word
    if (value === currentWord) {
      advanceWord(value, currentWord, currentWordIndex, wordStatuses, charStatuses);
      return;
    }

    // Update char status display for current word
    const newCharStatuses = [...charStatuses];
    const wordCharStatus = currentWord.split("").map((char, i) => {
      if (i >= value.length) return "pending";
      return value[i] === char ? "correct" : "incorrect";
    });
    const extraChars = value.length > currentWord.length ? value.slice(currentWord.length) : "";
    newCharStatuses[currentWordIndex] = [
      ...wordCharStatus,
      ...extraChars.split("").map(() => "extra"),
    ];
    setCharStatuses(newCharStatuses);
    setCurrentInput(value);
  };

  // ── Key handler ─────────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      resetAttempt();
      return;
    }
    if (e.key === " ") {
      e.preventDefault();
      if (currentInput.trim().length === 0) return;
      advanceWord(currentInput, words[currentWordIndex], currentWordIndex, wordStatuses, charStatuses);
      return;
    }
    if (e.key === "Backspace" && currentInput === "" && currentWordIndex > 0) {
      const prevWord = words[currentWordIndex - 1];
      setCurrentWordIndex(currentWordIndex - 1);
      setCurrentInput(prevWord);
      const ns = [...wordStatuses];
      ns[currentWordIndex - 1] = "pending";
      setWordStatuses(ns);
    }
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const resetAttempt = () => {
    const newWords = generateTypingText(60).split(" ");
    // Reset refs
    correctCharsRef.current = 0;
    incorrectCharsRef.current = 0;
    totalTypedRef.current = 0;
    startTimeRef.current = null;
    isFinishedRef.current = false;
    // Reset state
    setWords(newWords);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setWordStatuses(newWords.map(() => "pending"));
    setCharStatuses(newWords.map((w) => w.split("").map(() => "pending")));
    setStartTime(null);
    setTimeRemaining(60);
    setIsActive(false);
    setIsFinished(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setTotalTypedChars(0);
    setCurrentStats({ wpm: 0, accuracy: 100 });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => { inputRef.current?.focus(); }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // Attempt finished view
  // ════════════════════════════════════════════════════════════════════════════
  if (isFinished) {
    return (
      <div className="typing-page">
        <div className="typing-topbar">
          <div className="topbar-left">
            <span className="topbar-label">contest</span>
            <span className="topbar-contest-time" style={{ color: contestTimeRemaining <= 30 ? "var(--error-color)" : "var(--vcode-primary)" }}>
              {formatTime(contestTimeRemaining)}
            </span>
          </div>
          <div className="topbar-right">
            <span className="topbar-label">attempt #{attemptNumber}</span>
          </div>
        </div>

        <div className="attempt-results-card">
          <h2 className="attempt-results-title">Attempt #{attemptNumber} Complete</h2>
          <div className="attempt-stats-grid">
            <div className="attempt-stat-block">
              <span className="stat-label">wpm</span>
              <span className="stat-val wpm-val">{currentStats.wpm}</span>
            </div>
            <div className="attempt-stat-block">
              <span className="stat-label">accuracy</span>
              <span className="stat-val acc-val">{currentStats.accuracy}%</span>
            </div>
            <div className="attempt-stat-block">
              <span className="stat-label">correct</span>
              <span className="stat-val correct-val">{correctChars}</span>
            </div>
            <div className="attempt-stat-block">
              <span className="stat-label">errors</span>
              <span className="stat-val error-val">{incorrectChars}</span>
            </div>
          </div>
          <div className="attempt-meta">
            Contest time remaining:{" "}
            <strong style={{ color: "var(--main-color)" }}>{formatTime(contestTimeRemaining)}</strong>
          </div>
          {contestTimeRemaining > 0 ? (
            <button className="next-test-btn" onClick={resetAttempt}>Next Attempt →</button>
          ) : (
            <p style={{ color: "var(--sub-color)", fontSize: "0.9rem" }}>
              Contest time is up. Check your final results.
            </p>
          )}
          <div className="hint-row"><kbd>tab</kbd>&nbsp;to restart</div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Main typing view
  // ════════════════════════════════════════════════════════════════════════════
  const timerColor = timeRemaining <= 10 ? "var(--error-color)" : "var(--main-color)";

  return (
    <div className="typing-page" onClick={() => inputRef.current?.focus()}>
      {/* Top bar */}
      <div className="typing-topbar">
        <div className="topbar-left">
          <span className="topbar-label">contest</span>
          <span className="topbar-contest-time" style={{ color: contestTimeRemaining <= 30 ? "var(--error-color)" : "var(--vcode-primary)" }}>
            {formatTime(contestTimeRemaining)}
          </span>
        </div>
        <div className="topbar-center">
          <span className="topbar-label">🌐 english</span>
          <span className="topbar-divider">|</span>
          <span className="topbar-label">
            <span style={{ color: "var(--main-color)" }}>{currentWordIndex + 1}</span>
            <span style={{ color: "var(--sub-color)" }}>&nbsp;/ {words.length}</span>
          </span>
        </div>
        <div className="topbar-right">
          <span className="topbar-label">attempt #{attemptNumber}</span>
        </div>
      </div>

      {/* Live stats bar — slides in when typing starts */}
      <div className={`live-stats-bar${isActive ? " visible" : ""}`}>
        <div className="live-stat">
          <span className="live-stat-val" style={{ color: timerColor }}>{timeRemaining}</span>
          <span className="live-stat-label">sec</span>
        </div>
        <div className="live-stat">
          <span className="live-stat-val">{currentStats.wpm}</span>
          <span className="live-stat-label">wpm</span>
        </div>
        <div className="live-stat">
          <span className="live-stat-val">{currentStats.accuracy}</span>
          <span className="live-stat-label">acc %</span>
        </div>
      </div>

      {/* Words area */}
      <div className="words-outer">
        <div ref={wordsRef} className="words-container" id="wordsWrapper">
          <div className="typing-caret smooth" style={{ left: `${caretPos.left}px`, top: `${caretPos.top}px` }} />
          <div id="words">
            {words.map((word, wi) => {
              const isCurrent = wi === currentWordIndex;
              const isPast = wi < currentWordIndex;
              const wStatus = wordStatuses[wi];
              const chars = charStatuses[wi] || word.split("").map(() => "pending");
              let wordClass = "word";
              if (isCurrent) wordClass += " active";
              if (isPast && wStatus === "incorrect") wordClass += " error";
              return (
                <span key={wi} ref={isCurrent ? activeWordRef : null} className={wordClass}>
                  {word.split("").map((char, ci) => {
                    const cs = chars[ci] || "pending";
                    let lc = "typletter";
                    if (isPast) lc += wStatus === "correct" ? " correct" : " incorrect";
                    else if (isCurrent) {
                      if (cs === "correct") lc += " correct";
                      else if (cs === "incorrect") lc += " incorrect";
                    }
                    return <span key={ci} className={lc}>{char}</span>;
                  })}
                  {isCurrent && currentInput.length > word.length &&
                    currentInput.slice(word.length).split("").map((ch, i) => (
                      <span key={`x${i}`} className="typletter typletter-extra">{ch}</span>
                    ))
                  }
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ position: "fixed", left: "-9999px", opacity: 0 }}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        disabled={isFinished}
        aria-label="typing input"
      />

      {!isActive && (
        <div className="hint-row" style={{ marginTop: "2rem" }}>
          <kbd>tab</kbd>&nbsp;to restart&nbsp;&nbsp;·&nbsp;&nbsp;start typing to begin
        </div>
      )}
    </div>
  );
};

export default TypingTest;
