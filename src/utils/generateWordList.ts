export const WORD_LIST = [
  'apple', 'river', 'train', 'cloud', 'forest', 'mouse', 'table', 'power', 
  'glass', 'yellow', 'stone', 'dream', 'silver', 'tiger', 'chair', 'ocean', 
  'music', 'green', 'bread', 'light', 'water', 'earth', 'fire', 'wind', 
  'moon', 'star', 'sun', 'night', 'day', 'time', 'space', 'world', 'life', 
  'love', 'hope', 'peace', 'war', 'home', 'house', 'door', 'window', 'wall', 
  'floor', 'roof', 'garden', 'tree', 'flower', 'grass', 'road', 'street', 
  'city', 'town', 'village', 'country', 'nation', 'state', 'border', 'line', 
  'circle', 'square', 'triangle', 'shape', 'form', 'size', 'color', 'sound', 
  'voice', 'song', 'dance', 'play', 'game', 'sport', 'ball', 'team', 'player', 
  'winner', 'loser', 'score', 'point', 'goal', 'dream', 'wish', 'want', 'need', 
  'have', 'give', 'take', 'make', 'break', 'fix', 'build', 'create', 'destroy', 
  'help', 'hurt', 'heal', 'sick', 'well', 'healthy', 'strong', 'weak', 'fast', 
  'slow', 'quick', 'speed', 'race', 'run', 'walk', 'jump', 'sit', 'stand', 
  'lie', 'sleep', 'wake', 'eat', 'drink', 'cook', 'food', 'meal', 'breakfast', 
  'lunch', 'dinner', 'dessert', 'sweet', 'sour', 'bitter', 'salty', 'spicy', 
  'hot', 'cold', 'warm', 'cool', 'ice', 'snow', 'rain', 'storm', 'wind', 'breeze', 
  'summer', 'winter', 'spring', 'fall', 'season', 'month', 'week', 'day', 'hour', 
  'minute', 'second', 'moment', 'instant', 'forever', 'always', 'never', 'sometimes', 
  'often', 'rarely', 'seldom', 'frequently', 'usually', 'normally', 'generally', 
  'specifically', 'exactly', 'precisely', 'approximately', 'roughly', 'about', 
  'almost', 'nearly', 'close', 'far', 'near', 'distance', 'length', 'width', 
  'height', 'depth', 'weight', 'heavy', 'light', 'thick', 'thin', 'wide', 'narrow', 
  'big', 'small', 'large', 'tiny', 'huge', 'giant', 'microscopic', 'visible', 
  'hidden', 'secret', 'open', 'closed', 'locked', 'unlocked', 'free', 'trapped', 
  'escaped', 'caught', 'found', 'lost', 'missing', 'present', 'absent', 'here', 
  'there', 'everywhere', 'nowhere', 'somewhere', 'anywhere', 'inside', 'outside', 
  'above', 'below', 'under', 'over', 'between', 'among', 'through', 'across', 
  'around', 'beside', 'next', 'before', 'after', 'during', 'until', 'since', 
  'already', 'still', 'yet', 'now', 'then', 'later', 'soon', 'early', 'late', 
  'past', 'present', 'future', 'history', 'story', 'tale', 'legend', 'myth', 
  'truth', 'lie', 'fact', 'fiction', 'reality', 'fantasy', 'imagination', 'memory', 
  'forget', 'remember', 'learn', 'teach', 'student', 'teacher', 'school', 'class', 
  'lesson', 'homework', 'test', 'exam', 'grade', 'score', 'pass', 'fail', 'graduate', 
  'degree', 'diploma', 'certificate', 'award', 'prize', 'gift', 'present', 'surprise', 
  'party', 'celebration', 'festival', 'holiday', 'vacation', 'trip', 'journey', 
  'adventure', 'expedition', 'voyage', 'travel', 'tour', 'visit', 'stay', 'leave', 
  'arrive', 'depart', 'enter', 'exit', 'come', 'go', 'return', 'repeat', 'again', 
  'first', 'last', 'beginning', 'end', 'start', 'finish', 'complete', 'incomplete', 
  'whole', 'part', 'piece', 'section', 'segment', 'fragment', 'portion', 'share', 
  'half', 'quarter', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 
  'ninth', 'tenth', 'hundred', 'thousand', 'million', 'billion', 'number', 'count', 
  'calculate', 'add', 'subtract', 'multiply', 'divide', 'equal', 'plus', 'minus', 
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 
  'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 
  'eighty', 'ninety', 'hundred', 'thousand', 'million', 'billion'
];

export function generateShuffledWordList(): string[] {
  const shuffled = [...WORD_LIST];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateTypingText(wordCount: number = 100): string {
  const words = generateShuffledWordList();
  return words.slice(0, wordCount).join(' ');
}
