import React, { useState } from "react";

interface InstructionsPageProps {
  onStartContest: () => void;
}

const InstructionsPage: React.FC<InstructionsPageProps> = ({
  onStartContest,
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleStart = () => {
    if (hasAgreed) {
      onStartContest();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="card-vcode rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-neutral-100">
          <span className="gradient-text">VCODE</span> Typing Contest Rules
        </h1>

        <div className="space-y-4 text-neutral-300 mb-8">
          <div className="flex items-start space-x-3">
            <span
              style={{ color: "var(--vcode-primary)" }}
              className="font-bold"
            >
              •
            </span>
            <p>
              <strong>Total contest duration:</strong>{" "}
              <span style={{ color: "var(--vcode-primary)" }}>10 minutes</span>
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <span
              style={{ color: "var(--vcode-primary)" }}
              className="font-bold"
            >
              •
            </span>
            <p>
              <strong>Each typing test duration:</strong>{" "}
              <span style={{ color: "var(--vcode-primary)" }}>60 seconds</span>
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <span
              style={{ color: "var(--vcode-primary)" }}
              className="font-bold"
            >
              •
            </span>
            <p>
              <strong>Students can attempt the test multiple times</strong>{" "}
              within the 10 minutes
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <span
              style={{ color: "var(--vcode-primary)" }}
              className="font-bold"
            >
              •
            </span>
            <p>
              <strong>The highest WPM</strong> will be considered the final
              score
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-red-400 font-bold">•</span>
            <p>
              <strong>Do NOT refresh the page</strong> during the contest
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-red-400 font-bold">•</span>
            <p>
              <strong>Refreshing may lead to elimination</strong>
            </p>
          </div>


        </div>

        <div className="bg-neutral-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-neutral-400 mb-2">Example text:</p>
          <p className="text-neutral-200 font-mono">
            apple river train cloud forest mouse table power glass yellow stone
            dream silver tiger chair ocean music green bread light
          </p>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <input
            type="checkbox"
            id="rules-checkbox"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label
            htmlFor="rules-checkbox"
            className="text-neutral-300 cursor-pointer select-none"
          >
            I agree to follow the contest rules.
          </label>
        </div>

        <button
          onClick={handleStart}
          disabled={!hasAgreed}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${hasAgreed
              ? "btn-gradient glow-primary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
              : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
            }`}
        >
          Start Contest
        </button>
      </div>
    </div>
  );
};

export default InstructionsPage;
