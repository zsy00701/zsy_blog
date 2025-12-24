import { remark } from 'remark';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import { addIdsToHeadings } from './toc';

// 预处理 markdown，修复引用块内的 LaTeX 公式
function preprocessMarkdown(markdown: string): string {
  const lines = markdown.split('\n');
  const result: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // 检查是否是引用块内的公式开始: > $$
    const blockquoteFormulaMatch = line.match(/^(>\s*)\$\$\s*$/);
    
    if (blockquoteFormulaMatch) {
      // 收集引用块内的公式
      const formulaLines: string[] = [];
      i++;
      
      // 收集直到遇到 > $$ 结束
      while (i < lines.length) {
        const currentLine = lines[i];
        const endMatch = currentLine.match(/^(>\s*)\$\$\s*$/);
        
        if (endMatch) {
          // 公式结束，输出处理后的公式
          result.push('');
          result.push('$$');
          formulaLines.forEach(fl => {
            // 移除引用前缀 "> "
            const content = fl.replace(/^>\s*/, '');
            result.push(content);
          });
          result.push('$$');
          result.push('');
          i++;
          break;
        } else {
          // 收集公式内容
          formulaLines.push(currentLine);
          i++;
        }
      }
    } else {
      result.push(line);
      i++;
    }
  }
  
  return result.join('\n');
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processedMarkdown = preprocessMarkdown(markdown);
  
  const result = await remark()
    .use(remarkMath, {
      singleDollarTextMath: true
    })
    .use(remarkGfm)
    .use(remarkRehype, { 
      allowDangerousHtml: true,
    })
    .use(rehypeRaw)
    .use(rehypeHighlight, { 
      detect: true,
      ignoreMissing: true 
    })
    .use(rehypeKatex, {
      strict: false,
      throwOnError: false,
      trust: true,
      macros: {
        "\\R": "\\mathbb{R}",
        "\\N": "\\mathbb{N}",
        "\\Z": "\\mathbb{Z}",
        "\\E": "\\mathbb{E}",
        "\\P": "\\mathbb{P}",
        "\\C": "\\mathbb{C}",
        "\\Q": "\\mathbb{Q}",
        "\\argmax": "\\operatorname{argmax}",
        "\\argmin": "\\operatorname{argmin}",
        "\\softmax": "\\operatorname{softmax}",
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processedMarkdown);
    
  const htmlContent = result.toString();
  return addIdsToHeadings(htmlContent);
}
