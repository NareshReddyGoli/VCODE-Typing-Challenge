export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  correctWords: number;
  totalWords: number;
}

export function calculateWPM(
  typedText: string,
  targetText: string,
  timeInSeconds: number
): TypingStats {
  if (timeInSeconds === 0) {
    return {
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      correctWords: 0,
      totalWords: 0
    };
  }

  const targetWords = targetText.split(' ');
  const typedWords = typedText.split(' ');
  
  let correctChars = 0;
  let incorrectChars = 0;
  let correctWords = 0;
  
  const minLength = Math.min(typedText.length, targetText.length);
  
  for (let i = 0; i < minLength; i++) {
    if (typedText[i] === targetText[i]) {
      correctChars++;
    } else {
      incorrectChars++;
    }
  }
  
  incorrectChars += Math.max(0, typedText.length - targetText.length);
  
  for (let i = 0; i < Math.min(typedWords.length, targetWords.length); i++) {
    if (typedWords[i] === targetWords[i]) {
      correctWords++;
    }
  }
  
  const totalChars = correctChars + incorrectChars;
  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
  
  const standardWordLength = 5;
  const minutes = timeInSeconds / 60;
  const wordsTyped = correctChars / standardWordLength;
  const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
  
  return {
    wpm,
    accuracy: Math.round(accuracy * 100) / 100,
    correctChars,
    incorrectChars,
    totalChars,
    correctWords,
    totalWords: targetWords.length
  };
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
