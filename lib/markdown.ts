import { remark } from 'remark';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkImages from 'remark-images';
import { addIdsToHeadings } from './toc';

// 预处理 markdown，修复一些常见的 LaTeX 问题
function preprocessMarkdown(markdown: string): string {
  let processed = markdown;
  
  // 处理引用块内的公式：将 > $$ 转换为正常的 $$
  // 匹配引用块内的块级公式
  processed = processed.replace(/^(>\s*)+\$\$/gm, '$$');
  processed = processed.replace(/^(>\s*)+(.+)$/gm, (match, prefix, content) => {
    // 如果在公式块内（$$ 到 $$ 之间），移除引用前缀
    return match;
  });
  
  // 确保 $$ 公式块前后有空行
  processed = processed.replace(/([^\n])\n\$\$/g, '$1\n\n$$');
  processed = processed.replace(/\$\$\n([^\n])/g, '$$\n\n$1');
  
  return processed;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processedMarkdown = preprocessMarkdown(markdown);
  
  const result = await remark()
    .use(remarkMath, {
      singleDollarTextMath: true  // 启用单 $ 行内公式
    })
    .use(remarkGfm)
    .use(remarkImages)
    .use(remarkRehype, { 
      allowDangerousHtml: true,
    })
    .use(rehypeHighlight, { 
      detect: true,
      ignoreMissing: true 
    })
    .use(rehypeKatex, {
      strict: false,  // 宽松模式，忽略未知命令
      throwOnError: false,  // 不抛出错误
      trust: true,  // 信任输入
      macros: {
        // 定义一些常用宏
        "\\R": "\\mathbb{R}",
        "\\N": "\\mathbb{N}",
        "\\Z": "\\mathbb{Z}",
        "\\E": "\\mathbb{E}",
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processedMarkdown);
    
  const htmlContent = result.toString();
  return addIdsToHeadings(htmlContent);
}

