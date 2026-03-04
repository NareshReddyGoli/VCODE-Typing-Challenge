import { useState, useEffect, useCallback, useRef } from 'react';
import RegistrationForm from './components/RegistrationForm';
import InstructionsPage from './components/InstructionsPage';
import TypingTest from './components/TypingTest';
import ResultsPage from './components/ResultsPage';
import type { StudentDetails, AttemptResult, PageType, ContestState } from './types';

const CONTEST_DURATION_MINUTES = 10;
const CONTEST_DURATION_SECONDS = CONTEST_DURATION_MINUTES * 60;

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('registration');
  const [contestState, setContestState] = useState<ContestState>({
    studentDetails: null,
    attempts: [],
    contestStartTime: null,
    contestEndTime: null,
    currentAttemptStartTime: null,
    isContestActive: false,
    hasAgreedToRules: false
  });
  const [contestTimeRemaining, setContestTimeRemaining] = useState(CONTEST_DURATION_SECONDS);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('typingContestState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setContestState(parsed);
        if (parsed.contestStartTime && parsed.isContestActive) {
          const elapsed = Math.floor((Date.now() - new Date(parsed.contestStartTime).getTime()) / 1000);
          const remaining = Math.max(0, CONTEST_DURATION_SECONDS - elapsed);
          if (remaining > 0) {
            setContestTimeRemaining(remaining);
            if (parsed.studentDetails && parsed.hasAgreedToRules) setCurrentPage('contest');
            else if (parsed.studentDetails) setCurrentPage('instructions');
          } else {
            setCurrentPage('results');
          }
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // ── Callbacks — defined BEFORE the interval effect that references them ────

  const contestEndedRef = useRef(false);
  const handleContestEnd = useCallback(() => {
    if (contestEndedRef.current) return; // guard: prevent double-firing
    contestEndedRef.current = true;
    setContestState(prev => ({ ...prev, isContestActive: false, contestEndTime: new Date() }));
    setCurrentPage('results');
  }, []);

  const handleRegistration = useCallback((details: StudentDetails) => {
    setContestState(prev => ({ ...prev, studentDetails: details }));
    setCurrentPage('instructions');
  }, []);

  const handleStartContest = useCallback(() => {
    const now = new Date();
    setContestState(prev => ({
      ...prev,
      contestStartTime: now,
      contestEndTime: new Date(now.getTime() + CONTEST_DURATION_SECONDS * 1000),
      isContestActive: true,
      hasAgreedToRules: true
    }));
    setCurrentPage('contest');
  }, []);

  const handleAttemptSubmit = useCallback((result: AttemptResult) => {
    setContestState(prev => ({ ...prev, attempts: [...prev.attempts, result] }));
  }, []);

  // ── Contest timer interval ────────────────────────────────────────────────
  // Uses a ref so the interval always calls the latest handleContestEnd,
  // avoiding stale-closure issues.
  const handleContestEndRef = useRef(handleContestEnd);
  useEffect(() => { handleContestEndRef.current = handleContestEnd; }, [handleContestEnd]);

  useEffect(() => {
    if (contestState.isContestActive && contestState.contestStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(contestState.contestStartTime!).getTime()) / 1000);
        const remaining = Math.max(0, CONTEST_DURATION_SECONDS - elapsed);
        setContestTimeRemaining(remaining);
        if (remaining === 0) handleContestEndRef.current();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contestState.isContestActive, contestState.contestStartTime]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('typingContestState', JSON.stringify(contestState));
  }, [contestState]);

  // Warn before unload during active contest
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (contestState.isContestActive) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? The contest is still active.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [contestState.isContestActive]);

  // ── Render ────────────────────────────────────────────────────────────────
  const attemptNumber = contestState.attempts.length + 1;

  const renderPage = () => {
    switch (currentPage) {
      case 'registration':
        return <RegistrationForm onSubmit={handleRegistration} />;
      case 'instructions':
        return <InstructionsPage onStartContest={handleStartContest} />;
      case 'contest':
        return (
          <TypingTest
            contestTimeRemaining={contestTimeRemaining}
            attemptNumber={attemptNumber}
            onSubmitAttempt={handleAttemptSubmit}
            onContestEnd={handleContestEnd}
          />
        );
      case 'results':
        return (
          <ResultsPage
            studentDetails={contestState.studentDetails!}
            attempts={contestState.attempts}
          />
        );
      default:
        return <RegistrationForm onSubmit={handleRegistration} />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;
