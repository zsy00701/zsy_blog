import { remark } from 'remark';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkImages from 'remark-images';
import { addIdsToHeadings } from './toc';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkImages)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { 
      detect: true,
      ignoreMissing: true 
    })
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  const htmlContent = result.toString();
  return addIdsToHeadings(htmlContent);
}

