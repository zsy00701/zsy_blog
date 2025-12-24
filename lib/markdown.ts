import { remark } from 'remark';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import { addIdsToHeadings } from './toc';

// 预处理 markdown，修复常见的 LaTeX 和格式问题
function preprocessMarkdown(markdown: string): string {
  let processed = markdown;
  
  // 1. 移除公式块前面的缩进空格（保持 $$ 在行首）
  processed = processed.replace(/^[ \t]+\$\$/gm, '$$');
  
  // 2. 处理引用块内的块级公式
  // 将 > $$ 开始的公式块提取出来
  const lines = processed.split('\n');
  const result: string[] = [];
  let inBlockquoteFormula = false;
  let formulaBuffer: string[] = [];
  let blockquotePrefix = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检查是否是引用块内的公式开始 (> $$)
    const blockquoteFormulaStart = line.match(/^(>\s*)+\$\$\s*$/);
    const blockquoteFormulaInline = line.match(/^(>\s*)+\$\$(.+)\$\$\s*$/);
    
    if (blockquoteFormulaInline) {
      // 单行公式在引用块内: > $$ ... $$
      const content = blockquoteFormulaInline[2];
      result.push('');
      result.push('$$' + content + '$$');
      result.push('');
    } else if (blockquoteFormulaStart && !inBlockquoteFormula) {
      // 多行公式开始
      inBlockquoteFormula = true;
      blockquotePrefix = blockquoteFormulaStart[1];
      formulaBuffer = ['$$'];
    } else if (inBlockquoteFormula) {
      // 检查公式结束
      const endMatch = line.match(/^(>\s*)*\$\$\s*$/);
      if (endMatch) {
        formulaBuffer.push('$$');
        result.push('');
        result.push(...formulaBuffer);
        result.push('');
        inBlockquoteFormula = false;
        formulaBuffer = [];
      } else {
        // 移除引用前缀，保留公式内容
        const contentMatch = line.match(/^(>\s*)*(.*)$/);
        if (contentMatch) {
          formulaBuffer.push(contentMatch[2]);
        }
      }
    } else {
      result.push(line);
    }
  }
  
  // 如果公式没有正确关闭，保留原样
  if (inBlockquoteFormula && formulaBuffer.length > 0) {
    result.push(...formulaBuffer);
  }
  
  processed = result.join('\n');
  
  // 3. 确保独立的 $$ 公式块前后有空行
  processed = processed.replace(/([^\n])\n\$\$/g, '$1\n\n$$');
  processed = processed.replace(/\$\$\n([^\n$])/g, '$$\n\n$1');
  
  // 4. 修复 LaTeX 中的特殊字符问题
  // 处理 \text{} 中的空格
  processed = processed.replace(/\\text\{([^}]*)\}/g, (match, content) => {
    return '\\text{' + content.replace(/ /g, '\\ ') + '}';
  });
  
  return processed;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processedMarkdown = preprocessMarkdown(markdown);
  
  const result = await remark()
    .use(remarkMath, {
      singleDollarTextMath: true  // 启用单 $ 行内公式
    })
    .use(remarkGfm)
    .use(remarkRehype, { 
      allowDangerousHtml: true,
    })
    .use(rehypeRaw)  // 处理 HTML
    .use(rehypeHighlight, { 
      detect: true,
      ignoreMissing: true 
    })
    .use(rehypeKatex, {
      strict: false,
      throwOnError: false,
      trust: true,
      output: 'htmlAndMathml',  // 同时输出 HTML 和 MathML，提高兼容性
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
        "\\sigmoid": "\\operatorname{sigmoid}",
        "\\tanh": "\\operatorname{tanh}",
        "\\ReLU": "\\operatorname{ReLU}",
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processedMarkdown);
    
  const htmlContent = result.toString();
  return addIdsToHeadings(htmlContent);
}
