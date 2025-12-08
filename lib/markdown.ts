import { remark } from 'remark';
import html from 'remark-html';
import { addIdsToHeadings } from './toc';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  const htmlContent = result.toString();
  return addIdsToHeadings(htmlContent);
}

