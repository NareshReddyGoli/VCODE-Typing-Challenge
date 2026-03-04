import React, { useEffect, useRef } from "react";
import type { StudentDetails, AttemptResult } from "../types";

interface ResultsPageProps {
  studentDetails: StudentDetails;
  attempts: AttemptResult[];
}

const ResultsPage: React.FC<ResultsPageProps> = ({
  studentDetails,
  attempts,
}) => {
  const highestWPM = attempts.length > 0 ? Math.max(...attempts.map((a) => a.wpm)) : 0;
  const bestAttempt = attempts.length > 0
    ? attempts.reduce((best, cur) => (cur.wpm > best.wpm ? cur : best))
    : null;

  // Guard: prevent double submission (React StrictMode mounts effects twice in dev,
  // and handleContestEnd can fire from both the contest timer AND TypingTest's onContestEnd)
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const submitToGoogleForm = async () => {
      if (hasSubmitted.current) return;  // already sent
      hasSubmitted.current = true;
      const formData = {
        "entry.1818942315": studentDetails.name,
        "entry.1446358748": studentDetails.registrationNumber,
        "entry.2044093306": studentDetails.email,
        "entry.2092975189": studentDetails.mobileNumber,
        "entry.565110897": studentDetails.year,
        "entry.1182587691": studentDetails.section,
        "entry.1670077317": attempts.length.toString(),
        "entry.1260999888": highestWPM.toString(),
      };
      try {
        const GOOGLE_FORM_URL =
          "https://docs.google.com/forms/d/e/1FAIpQLSffQ7Ee3anQ2mev_LYeEXI-ojl3_e6YcwLPkGNAo-J5dCjvGg/formResponse";
        await fetch(GOOGLE_FORM_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
        });
        console.log("Form submitted successfully");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    if (attempts.length > 0) {
      submitToGoogleForm();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const handleStartAgain = () => {
    localStorage.removeItem("typingContestState");
    window.location.reload();
  };

  return (
    <div className="results-page">
      {/* Header */}
      <div className="results-header">
        <h1>
          <span className="gradient-text">Contest Results</span>
        </h1>
        <p className="results-subtext">
          {attempts.length > 0
            ? `${attempts.length} attempt${attempts.length > 1 ? "s" : ""} completed`
            : "Contest session ended"}
        </p>
      </div>

      {/* Student + Score row */}
      <div className="results-grid-top">
        {/* Student Details */}
        <div className="results-card">
          <h2 className="results-card-title">Student Details</h2>
          <div className="results-detail-list">
            <div className="results-detail-row">
              <span className="detail-label">Name</span>
              <span className="detail-value">{studentDetails.name}</span>
            </div>
            <div className="results-detail-row">
              <span className="detail-label">Registration No.</span>
              <span className="detail-value">{studentDetails.registrationNumber}</span>
            </div>
            <div className="results-detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{studentDetails.email}</span>
            </div>
            <div className="results-detail-row">
              <span className="detail-label">Mobile</span>
              <span className="detail-value">{studentDetails.mobileNumber}</span>
            </div>
            <div className="results-detail-row">
              <span className="detail-label">Year</span>
              <span className="detail-value">{studentDetails.year}</span>
            </div>
            <div className="results-detail-row">
              <span className="detail-label">Section</span>
              <span className="detail-value">{studentDetails.section}</span>
            </div>
          </div>
        </div>

        {/* Final Score */}
        <div className="results-card results-score-card">
          <h2 className="results-card-title">Final Score</h2>
          {attempts.length > 0 && bestAttempt ? (
            <div className="score-content">
              <div className="score-main-stat">
                <span className="score-big gradient-text">{highestWPM}</span>
                <span className="score-label">Highest WPM</span>
              </div>
              <div className="score-divider" />
              <div className="score-secondary-stats">
                <div className="score-sec-stat">
                  <span
                    className="score-med"
                    style={{ color: "var(--vcode-secondary)" }}
                  >
                    {bestAttempt.accuracy.toFixed(1)}%
                  </span>
                  <span className="score-label">Best Accuracy</span>
                </div>
                <div className="score-sec-stat">
                  <span
                    className="score-med"
                    style={{ color: "var(--text-color)" }}
                  >
                    {attempts.length}
                  </span>
                  <span className="score-label">Total Attempts</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-attempts-msg">
              <span style={{ fontSize: "3rem" }}>⏰</span>
              <p>No attempts were completed during this session.</p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                The contest ended before any typing test was finished.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Attempt-by-attempt breakdown */}
      <div className="results-card results-attempts-card">
        <h2 className="results-card-title">Attempt Summary</h2>
        {attempts.length > 0 ? (
          <div className="attempts-list">
            {attempts.map((attempt, i) => (
              <div
                key={i}
                className={`attempt-row${attempt.wpm === highestWPM ? " best" : ""}`}
              >
                <div className="attempt-row-left">
                  <span className="attempt-num">Attempt {attempt.attemptNumber}</span>
                  {attempt.wpm === highestWPM && (
                    <span className="best-badge">BEST</span>
                  )}
                </div>
                <div className="attempt-row-right">
                  <span className="attempt-wpm">{attempt.wpm} WPM</span>
                  <span className="attempt-acc">{attempt.accuracy.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="results-empty">No attempts completed during this session.</p>
        )}
      </div>

      {/* Footer */}
      <div className="results-footer">
        {attempts.length > 0 && (
          <p className="results-submitted-note">
            ✓ Your results have been submitted to the contest database.
          </p>
        )}
        <p className="results-thanks">
          Thank you for participating in the <span className="gradient-text">VCODE</span> Typing Contest!
        </p>
        <button className="results-restart-btn" onClick={handleStartAgain}>
          Start New Session
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
