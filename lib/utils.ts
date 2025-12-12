export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200; // 中文阅读速度约200字/分钟
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, '');
  const wordCount = text.length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function countWords(content: string): number {
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, '');
  return text.length;
}


