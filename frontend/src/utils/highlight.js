/**
 * Tiny, dependency-free syntax highlighter.
 * Produces a flat list of typed tokens per line which <CodeEditor /> renders.
 *
 * Token types: comment | string | number | keyword | function | operator | plain
 */

const KEYWORDS = {
  python: [
    'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or',
    'import', 'from', 'as', 'with', 'try', 'except', 'finally', 'raise', 'lambda', 'yield',
    'pass', 'break', 'continue', 'global', 'nonlocal', 'assert', 'async', 'await', 'is', 'None',
    'True', 'False', 'print', 'input', 'range', 'len', 'int', 'float', 'str', 'list', 'dict',
    'set', 'tuple', 'self',
  ],
  javascript: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch',
    'case', 'default', 'break', 'continue', 'new', 'delete', 'typeof', 'instanceof', 'class',
    'extends', 'super', 'this', 'import', 'export', 'from', 'async', 'await', 'try', 'catch',
    'finally', 'throw', 'null', 'undefined', 'true', 'false', 'void', 'yield', 'static', 'get',
    'set', 'console', 'document', 'window', 'Math', 'JSON', 'Promise', 'Array', 'Object',
  ],
  java: [
    'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static',
    'final', 'void', 'int', 'double', 'float', 'long', 'short', 'byte', 'char', 'boolean',
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue',
    'return', 'new', 'this', 'super', 'try', 'catch', 'finally', 'throw', 'throws', 'import',
    'package', 'true', 'false', 'null', 'String', 'System', 'println', 'var', 'enum', 'record',
  ],
  c: [
    'int', 'char', 'float', 'double', 'void', 'long', 'short', 'unsigned', 'signed', 'if',
    'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return',
    'struct', 'union', 'enum', 'typedef', 'const', 'static', 'extern', 'sizeof', 'goto', 'printf',
    'scanf', 'include', 'define', 'main',
  ],
  cpp: [
    'int', 'char', 'float', 'double', 'void', 'long', 'short', 'unsigned', 'signed', 'if',
    'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return',
    'class', 'struct', 'public', 'private', 'protected', 'virtual', 'override', 'new', 'delete',
    'namespace', 'using', 'template', 'typename', 'try', 'catch', 'throw', 'const', 'auto',
    'include', 'define', 'std', 'cout', 'cin', 'endl', 'main', 'string', 'vector',
  ],
  csharp: [
    'using', 'namespace', 'class', 'struct', 'interface', 'public', 'private', 'protected',
    'internal', 'static', 'readonly', 'const', 'void', 'int', 'double', 'float', 'bool', 'string',
    'var', 'new', 'return', 'if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case',
    'default', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'true',
    'false', 'null', 'get', 'set', 'this', 'base', 'Console',
  ],
  html: [
    'html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr',
    'td', 'th', 'form', 'input', 'button', 'label', 'select', 'option', 'textarea', 'section',
    'header', 'footer', 'nav', 'main', 'article', 'aside', 'h1', 'h2', 'h3', 'h4', 'title',
    'meta', 'link', 'script', 'style', 'class', 'id', 'href', 'src', 'alt', 'type', 'name',
    'placeholder', 'value',
  ],
  css: [
    'color', 'background', 'background-color', 'border', 'border-radius', 'margin', 'padding',
    'display', 'flex', 'grid', 'gap', 'width', 'height', 'font-size', 'font-family', 'font-weight',
    'line-height', 'text-align', 'justify-content', 'align-items', 'box-shadow', 'position',
    'absolute', 'relative', 'fixed', 'transform', 'transition', 'opacity', 'overflow', 'z-index',
    'max-width', 'min-height', 'cursor', 'outline',
  ],
  sql: [
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE',
    'TABLE', 'DROP', 'ALTER', 'ADD', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP',
    'BY', 'ORDER', 'HAVING', 'LIMIT', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'DISTINCT', 'PRIMARY',
    'KEY', 'FOREIGN', 'REFERENCES', 'INDEX', 'UNIQUE', 'DEFAULT', 'COUNT', 'SUM', 'AVG', 'MIN',
    'MAX', 'LIKE', 'IN', 'BETWEEN', 'EXISTS', 'UNION', 'VIEW',
  ],
  text: [],
  markdown: ['#', '---'],
  php: [
    'function', 'return', 'if', 'else', 'elseif', 'foreach', 'for', 'while', 'do', 'switch',
    'case', 'default', 'break', 'continue', 'class', 'public', 'private', 'protected', 'static',
    'new', 'echo', 'print', 'require', 'include', 'try', 'catch', 'throw', 'namespace', 'use',
    'const', 'var', 'array', 'true', 'false', 'null', 'isset', 'empty', 'strlen', 'header',
  ],
};

const UNION = new Set(Object.values(KEYWORDS).flat());

const COMMENT_START = {
  text: [],
  markdown: ['#'],
  python: ['#'],
  javascript: ['//'],
  java: ['//'],
  c: ['//'],
  cpp: ['//'],
  csharp: ['//'],
  html: ['<!--'],
  css: ['/*'],
  sql: ['--'],
  php: ['//', '#'],
};

/**
 * @param {string} line  single line of source code
 * @param {string} lang  one of LANGUAGES
 * @returns {Array<{text:string,type:string}>}
 */
export function tokenizeLine(line, lang = 'JavaScript') {
  const key = normalizeLang(lang);
  const keywords = KEYWORDS[key] || KEYWORDS.javascript;
  const keywordSet = key === '__union' ? UNION : new Set(keywords);
  const commentStarts = COMMENT_START[key] || ['//'];

  const tokens = [];
  // 1) comments  2) strings  3) numbers  4) identifiers
  const re =
    /(\/\/.*$|#[^\n]*|--[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$@][A-Za-z0-9_$]*)|([{}()[\];,.<>=+\-*/%!&|?:]+)/g;

  let last = 0;
  let match;

  const pushPlain = (text) => {
    if (text) tokens.push({ text, type: 'plain' });
  };

  while ((match = re.exec(line)) !== null) {
    pushPlain(line.slice(last, match.index));
    last = re.lastIndex;

    const [full, comment, string, number, ident, punct] = match;

    if (comment) {
      const isComment =
        commentStarts.some((start) => full.startsWith(start)) || full.startsWith('/*') || full.startsWith('<!--');
      if (isComment) {
        tokens.push({ text: full, type: 'comment' });
        continue;
      }
      pushPlain(full);
      continue;
    }
    if (string) {
      tokens.push({ text: string, type: 'string' });
      continue;
    }
    if (number) {
      tokens.push({ text: number, type: 'number' });
      continue;
    }
    if (ident) {
      const rest = line.slice(re.lastIndex);
      if (keywordSet.has(ident)) tokens.push({ text: ident, type: 'keyword' });
      else if (/^\s*\(/.test(rest)) tokens.push({ text: ident, type: 'function' });
      else tokens.push({ text: ident, type: 'plain' });
      continue;
    }
    if (punct) {
      tokens.push({ text: punct, type: 'operator' });
      continue;
    }
    pushPlain(full);
  }

  pushPlain(line.slice(last));
  return tokens;
}

function normalizeLang(lang = '') {
  const l = lang.toLowerCase();
  if (l.includes('text') || l.includes('markdown') || l.includes('plain')) return 'text';
  if (l.includes('python')) return 'python';
  if (l.includes('javascript') || l.includes('js')) return 'javascript';
  if (l.includes('typescript') || l.includes('ts')) return 'javascript';
  if (l.includes('java') && !l.includes('script')) return 'java';
  if (l.includes('c++') || l.includes('cpp')) return 'cpp';
  if (l.includes('c#') || l.includes('csharp')) return 'csharp';
  if (l === 'c') return 'c';
  if (l.includes('html')) return 'html';
  if (l.includes('css')) return 'css';
  if (l.includes('sql')) return 'sql';
  if (l.includes('php')) return 'php';
  return '__union';
}

export const TOKEN_STYLES = {
  comment: 'text-slate-500 italic',
  string: 'text-emerald-300',
  number: 'text-amber-300',
  keyword: 'text-sky-300',
  function: 'text-violet-300',
  operator: 'text-slate-400',
  plain: 'text-slate-200',
};
