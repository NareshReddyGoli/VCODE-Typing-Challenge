export const WORD_LIST = [
  'apple', 'river', 'train', 'cloud', 'mouse', 'table', 'power', 'glass', 
  'stone', 'dream', 'tiger', 'chair', 'ocean', 'music', 'green', 'bread', 
  'light', 'water', 'earth', 'fire', 'wind', 'moon', 'star', 'sun', 'night', 
  'day', 'time', 'world', 'life', 'love', 'hope', 'peace', 'war', 'home', 
  'house', 'door', 'wall', 'floor', 'roof', 'tree', 'flower', 'grass', 'road', 
  'city', 'town', 'state', 'line', 'shape', 'form', 'size', 'color', 'sound', 
  'voice', 'song', 'dance', 'play', 'game', 'ball', 'team', 'goal', 'wish', 
  'want', 'need', 'have', 'give', 'take', 'make', 'break', 'fix', 'build', 
  'help', 'hurt', 'heal', 'sick', 'well', 'strong', 'weak', 'fast', 'slow', 
  'quick', 'speed', 'race', 'run', 'walk', 'jump', 'sit', 'lie', 'sleep', 
  'wake', 'eat', 'drink', 'cook', 'food', 'meal', 'sweet', 'sour', 'bitter', 
  'salty', 'spicy', 'hot', 'cold', 'warm', 'cool', 'ice', 'snow', 'rain', 
  'breeze', 'month', 'week', 'hour', 'often', 'rarely', 'close', 'far', 'near', 
  'big', 'small', 'tiny', 'huge', 'open', 'closed', 'free', 'found', 'lost', 
  'here', 'there', 'above', 'below', 'over', 'next', 'past', 'story', 'tale', 
  'myth', 'truth', 'lie', 'fact', 'learn', 'teach', 'school', 'class', 'test', 
  'exam', 'grade', 'pass', 'fail', 'gift', 'party', 'trip', 'tour', 'stay', 
  'leave', 'come', 'go', 'first', 'last', 'start', 'end', 'part', 'half', 
  'share', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 
  'eight', 'nine', 'ten', 'add', 'plus', 'minus', 'count', 'number', 'piece', 
  'whole', 'round', 'sharp', 'soft', 'hard', 'smooth', 'rough', 'clean', 'dirty', 
  'bright', 'dark', 'quiet', 'loud', 'clear', 'faint', 'fresh', 'old', 'new', 
  'young', 'alive', 'dead', 'calm', 'angry', 'happy', 'sad', 'glad', 'mad', 
  'afraid', 'brave', 'bold', 'shy', 'proud', 'humble', 'kind', 'cruel', 'nice', 
  'mean', 'good', 'bad', 'right', 'wrong', 'true', 'false', 'real', 'fake', 
  'sure', 'doubt', 'trust', 'faith', 'fear', 'worry', 'care', 'ignore', 'notice', 
  'watch', 'look', 'see', 'hear', 'listen', 'speak', 'talk', 'whisper', 'shout', 
  'yell', 'scream', 'cry', 'laugh', 'giggle', 'smile', 'frown', 'grin', 'stare', 
  'glance', 'peek', 'search', 'find', 'seek', 'hunt', 'chase', 'follow', 'lead', 
  'guide', 'direct', 'point', 'aim', 'shoot', 'throw', 'catch', 'grab', 'hold', 
  'keep', 'lose', 'save', 'waste', 'spend', 'earn', 'win', 'lose', 'fight', 
  'battle', 'struggle', 'effort', 'try', 'attempt', 'succeed', 'fail', 'pass', 
  'accept', 'reject', 'agree', 'disagree', 'argue', 'debate', 'discuss', 'mention', 
  'refer', 'imply', 'suggest', 'offer', 'propose', 'request', 'demand', 'command', 
  'order', 'obey', 'disobey', 'refuse', 'allow', 'permit', 'forbid', 'prevent', 
  'protect', 'defend', 'attack', 'invade', 'retreat', 'surrender', 'yield', 'resist', 
  'persist', 'continue', 'stop', 'start', 'begin', 'finish', 'end', 'complete', 
  'incomplete', 'partial', 'total', 'full', 'empty', 'rich', 'poor', 'cheap', 
  'expensive', 'free', 'costly', 'valuable', 'worthless', 'useful', 'useless', 
  'helpful', 'harmful', 'safe', 'dangerous', 'risky', 'secure', 'stable', 'unstable', 
  'steady', 'shaky', 'firm', 'loose', 'tight', 'relaxed', 'tense', 'calm', 'agitated'
];

export function generateShuffledWordList(): string[] {
  const shuffled = [...WORD_LIST];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateTypingText(wordCount: number = 140): string {
  const words = generateShuffledWordList();
  // Ensure we have a multiple of 7 words for complete lines
  const adjustedCount = Math.ceil(wordCount / 7) * 7;
  return words.slice(0, adjustedCount).join(' ');
}
