export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(html: string): TocItem[] {
  const toc: TocItem[] = [];
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, '');

    if (level <= 3) {
      toc.push({ id, text, level });
    }
  }

  return toc;
}

export function addIdsToHeadings(html: string): string {
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;

  return html.replace(headingRegex, (_match, level, content) => {
    const text = content.replace(/<[^>]*>/g, '');
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

