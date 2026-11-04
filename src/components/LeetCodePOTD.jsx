import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { trackEvent } from '../utils/analytics';
import SEOEnhancement from './SEOEnhancement';

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

const PROGRESS_STORAGE_KEY = 'leetcode_potd_understood';

const DIFFICULTY_STYLES = {
  easy: {
    label: 'Easy',
    text: 'text-emerald-400',
    border: 'border-emerald-900/60',
    dot: 'bg-emerald-400',
  },
  medium: {
    label: 'Medium',
    text: 'text-amber-400',
    border: 'border-amber-900/60',
    dot: 'bg-amber-400',
  },
  hard: {
    label: 'Hard',
    text: 'text-rose-400',
    border: 'border-rose-900/60',
    dot: 'bg-rose-400',
  },
};

const LANGUAGE_LABELS = {
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  python: 'Python',
  python3: 'Python',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  go: 'Go',
  ts: 'TypeScript',
  typescript: 'TypeScript',
};

const DETAIL_TABS = [
  { id: 'description', label: '1. Description', help: 'What the problem is really asking' },
  { id: 'walkthrough', label: '2. Walkthrough', help: 'Solve an example by hand, no code yet' },
  { id: 'brute_force', label: '3. Brute Force', help: 'The simplest working solution' },
  { id: 'optimized', label: '4. Optimization', help: 'The key insight that speeds things up' },
  { id: 'code', label: '5. Solution', help: 'Clean, runnable, line-by-line code' },
  { id: 'quiz', label: '6. Quiz & Revision', help: 'Test yourself and recap' },
];

function getDifficultyStyle(difficulty) {
  const key = (difficulty || '').trim().toLowerCase();
  return (
    DIFFICULTY_STYLES[key] || {
      label: difficulty || 'Unknown',
      text: 'text-zinc-400',
      border: 'border-zinc-800',
      dot: 'bg-zinc-500',
    }
  );
}

function getLanguageLabel(lang) {
  const key = (lang || '').toLowerCase();
  return LANGUAGE_LABELS[key] || (lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'Code');
}

function estimateReadMinutes(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function safeLocalStorageGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeLocalStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode, etc.) — fail silently */
  }
}

/**
 * Pulls every fenced code block out of the markdown, grouped by language.
 * When a problem shows brute-force pseudocode AND a final optimized
 * solution in the same language, the LAST block for that language is
 * treated as the "real" submittable solution (pseudocode always comes
 * earlier in the write-up).
 */
function extractCodeBlocks(markdownText = '') {
  const codeBlockRegex = /```(\w+)\r?\n([\s\S]*?)```/g;
  const blocksByLang = {};
  let match;
  while ((match = codeBlockRegex.exec(markdownText)) !== null) {
    const lang = match[1].toLowerCase();
    const code = match[2].trim();
    if (!code) continue;
    if (!blocksByLang[lang]) blocksByLang[lang] = [];
    blocksByLang[lang].push(code);
  }
  const result = {};
  Object.keys(blocksByLang).forEach((lang) => {
    const blocks = blocksByLang[lang];
    result[lang] = blocks[blocks.length - 1];
  });
  return result;
}

const SOLUTION_HEADING_PATTERN = /^(optimized|final|clean|submittable)?\s*(code|solution)\s*(code)?$/i;

function getSectionGroup(headingTitle) {
  const t = headingTitle.toLowerCase();
  if (
    t.includes('simple language') ||
    t.includes('analogy') ||
    t.includes('concepts') ||
    t.includes('understand the input') ||
    t.includes('understand the output')
  ) {
    return 'description';
  }
  if (t.includes('brute force')) {
    return 'brute_force';
  }
  if (t.includes('manually') || t.includes('think like a programmer') || t.includes('dry run')) {
    return 'walkthrough';
  }
  if (
    t.includes('better approach') ||
    t.includes('insight') ||
    t.includes('complexity') ||
    t.includes('revision')
  ) {
    return 'optimized';
  }
  if (
    t.includes('code') ||
    t.includes('line by line') ||
    t.includes('examples') ||
    t.includes('edge cases')
  ) {
    return 'code';
  }
  if (
    t.includes('mistakes') ||
    t.includes('recognize') ||
    t.includes('interview') ||
    t.includes('challenge') ||
    t.includes('quiz')
  ) {
    return 'quiz';
  }
  return 'description';
}

/**
 * Splits a POTD write-up into { intro, description, brute_force,
 * walkthrough, optimized, code, quiz } — each an array of
 * { title, content } sections, in original order.
 */
function parseMarkdownIntoGroups(content = '') {
  const groups = {
    description: [],
    brute_force: [],
    walkthrough: [],
    optimized: [],
    code: [],
    quiz: [],
  };

  const parts = content.split(/\n(?=##\s)/);
  const intro = (parts[0] || '').trim();
  if (intro) {
    groups.description.push({ title: 'Overview', content: intro });
  }

  parts.slice(1).forEach((part) => {
    const lines = part.trim().split('\n');
    const firstLine = lines[0] || '';
    if (!firstLine.startsWith('## ')) return;
    const headingTitle = firstLine.replace('## ', '').trim();
    const headingContent = lines.slice(1).join('\n');
    const groupKey = getSectionGroup(headingTitle);
    groups[groupKey].push({ title: headingTitle, content: headingContent });
  });

  return groups;
}

function getPlainText(node) {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getPlainText).join('');
  if (node.props && node.props.children) return getPlainText(node.props.children);
  return '';
}

/* -------------------------------------------------------------------------- */
/*  Small presentational components                                          */
/* -------------------------------------------------------------------------- */

const CopyButton = ({ text, label = 'Copy Code' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : label}
      className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 hover:text-white transition border border-zinc-800 hover:border-zinc-600 px-2.5 py-1 rounded bg-zinc-950 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
    >
      {copied ? 'Copied!' : label}
    </button>
  );
};

const CodeEditor = ({ code, language }) => {
  const lines = code.split('\n');
  return (
    <div className="relative border border-zinc-900 rounded-lg overflow-hidden bg-black font-mono text-xs leading-relaxed">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-950 text-zinc-400">
        <span className="text-[10px] uppercase font-bold tracking-widest">{language} Solution</span>
        <CopyButton text={code} />
      </div>
      <div className="flex overflow-x-auto p-4 max-h-[500px]">
        <div className="text-zinc-500 pr-4 border-r border-zinc-900 text-right select-none min-w-[2.5rem]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="pl-4 text-zinc-300 select-text flex-1">
          {lines.map((line, i) => (
            <div key={i}>{line || ' '}</div>
          ))}
        </pre>
      </div>
    </div>
  );
};

/** Full "5. Solution" panel: language switcher + editor, driven by extracted code blocks. */
const SolutionCodePanel = ({ extractedCode }) => {
  const languages = Object.keys(extractedCode || {});
  const [activeLang, setActiveLang] = useState(languages[0]);

  useEffect(() => {
    if (languages.length && !languages.includes(activeLang)) {
      setActiveLang(languages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedCode]);

  if (!languages.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-start gap-3 mb-4 border border-zinc-900 bg-zinc-950/60 rounded-lg px-4 py-3">
        <span className="text-base leading-none mt-0.5">💡</span>
        <p className="text-xs text-zinc-400 leading-relaxed">
          This is the clean, submittable solution. Scroll down for a line-by-line explanation
          of exactly what each part does and why.
        </p>
      </div>

      {languages.length > 1 && (
        <div className="flex flex-wrap border border-zinc-800 p-1 bg-zinc-950 rounded-lg w-fit mb-4">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`py-1 px-3 text-[10px] font-bold uppercase tracking-wider rounded transition ${
                activeLang === lang
                  ? 'bg-white text-black font-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      )}

      <CodeEditor code={extractedCode[activeLang]} language={getLanguageLabel(activeLang)} />
    </div>
  );
};

const DifficultyBadge = ({ difficulty }) => {
  const style = getDifficultyStyle(difficulty);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[9px] border ${style.border} px-2 py-0.5 rounded text-zinc-300 uppercase font-bold tracking-wider`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      <span className={style.text}>{style.label}</span>
    </span>
  );
};

const SkeletonCard = () => (
  <div className="border border-zinc-900 bg-zinc-950 p-6 rounded-lg animate-pulse">
    <div className="h-3 w-24 bg-zinc-900 rounded mb-3" />
    <div className="h-5 w-2/3 bg-zinc-900 rounded mb-3" />
    <div className="h-3 w-1/3 bg-zinc-900 rounded" />
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Markdown rendering rules (shared, defined once so they aren't            */
/*  recreated on every render)                                               */
/* -------------------------------------------------------------------------- */

const markdownComponents = {
  h2: ({ children }) => {
    const text = getPlainText(children).toLowerCase();
    const highlight = text.includes('⭐') || text.includes('key insight');
    return (
      <h2
        className={`text-base uppercase font-bold tracking-wider mt-10 mb-4 pb-2 border-b font-mono ${
          highlight ? 'text-amber-300 border-amber-900/50' : 'text-white border-zinc-900'
        }`}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => (
    <h3 className="text-zinc-400 text-xs uppercase font-bold tracking-widest mt-8 mb-3 font-mono">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-zinc-300 text-sm leading-relaxed mb-5 font-mono font-light max-w-[68ch]">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 space-y-3 my-4 text-zinc-300 text-sm font-mono font-light">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 space-y-3 my-4 text-zinc-300 text-sm font-mono font-light">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
  em: ({ children }) => <em className="text-zinc-200 italic">{children}</em>,
  hr: () => <hr className="border-zinc-900 my-10" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white underline decoration-zinc-600 hover:decoration-white underline-offset-2 transition"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-zinc-700 pl-4 my-5 text-zinc-400 text-sm italic">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto border border-zinc-900 rounded-lg">
      <table className="w-full text-left border-collapse font-mono text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-zinc-950 border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider">
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-zinc-900 bg-black">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-zinc-950 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-3 border-r border-zinc-900 last:border-r-0 whitespace-nowrap">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-zinc-400 border-r border-zinc-900 last:border-r-0">{children}</td>
  ),
  pre: ({ children }) => <>{children}</>,
  code: ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const langName = match ? getLanguageLabel(match[1]) : '';
    return !inline && match ? (
      <div className="relative border border-zinc-900 rounded-lg overflow-hidden my-6 bg-zinc-950">
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-900/40">
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">
            {langName}
          </span>
          <CopyButton text={String(children).replace(/\n$/, '')} />
        </div>
        <pre className="p-4 overflow-x-auto text-zinc-300 font-mono text-xs leading-relaxed">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    ) : (
      <code className="bg-zinc-900/80 px-1.5 py-0.5 rounded text-white font-mono text-[12px]" {...props}>
        {children}
      </code>
    );
  },
};

/** One "## Heading" write-up section, rendered with its own markdown pass. */
const SectionBlock = ({ title, content, highlight }) => (
  <section
    className={
      highlight
        ? 'mb-10 border border-amber-900/40 bg-amber-950/10 rounded-xl p-5 md:p-6'
        : 'mb-10'
    }
  >
    <h2
      className={`text-sm md:text-base uppercase font-bold tracking-wider mb-4 pb-2 border-b font-mono ${
        highlight ? 'text-amber-300 border-amber-900/40' : 'text-white border-zinc-900'
      }`}
    >
      {title}
    </h2>
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

const LeetCodePOTD = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState('description');
  const [understood, setUnderstood] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    loadPOTDChallenges();
    setUnderstood(safeLocalStorageGet(PROGRESS_STORAGE_KEY, {}));
  }, []);

  const loadPOTDChallenges = async () => {
    try {
      setLoading(true);
      const potdFiles = import.meta.glob('/src/leetcode-potd/*.md', { as: 'raw' });
      const loaded = [];

      for (const path in potdFiles) {
        const rawContent = await potdFiles[path]();
        const frontmatterRegex = /^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
        const match = rawContent.match(frontmatterRegex);

        let data = {};
        let markdownContent = rawContent;

        if (match) {
          const frontmatterStr = match[1];
          markdownContent = match[2];

          const extractField = (field) => {
            const regex = new RegExp(`^${field}:\\s*(.*)$`, 'm');
            const m = frontmatterStr.match(regex);
            return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
          };

          const tagsMatch = frontmatterStr.match(/^tags:\s*\[(.*?)\]/m);

          data = {
            title: extractField('title') || 'Untitled Challenge',
            date: extractField('date') || '2026-01-01',
            difficulty: extractField('difficulty') || 'Medium',
            platform: extractField('platform') || 'LeetCode POTD',
            timeComplexity: extractField('timeComplexity') || 'O(n)',
            spaceComplexity: extractField('spaceComplexity') || 'O(1)',
            tags: tagsMatch
              ? tagsMatch[1].split(',').map((t) => t.trim().replace(/^["']|["']$/g, ''))
              : [],
            excerpt: extractField('excerpt') || '',
          };
        }

        const fileSlug = path.split('/').pop().replace('.md', '');

        loaded.push({
          slug: fileSlug,
          ...data,
          content: markdownContent,
        });
      }

      loaded.sort((a, b) => new Date(b.date) - new Date(a.date));
      setChallenges(loaded);
    } catch (error) {
      console.error('Error loading LeetCode POTD challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync route slug with selected challenge state
  useEffect(() => {
    if (challenges.length === 0) return;
    if (!slug) {
      setSelectedChallenge(null);
      return;
    }
    const found = challenges.find((c) => c.slug === slug);
    setSelectedChallenge(found || null);
    setActiveDetailTab('description');
  }, [slug, challenges]);

  // SEO & Schema Markup updates
  useEffect(() => {
    if (selectedChallenge) {
      const pageTitle = `${selectedChallenge.title} Solution | Mukesh Pal LeetCode POTD`;
      const pageDesc =
        selectedChallenge.excerpt ||
        `Detailed time/space complexity explanation and clean code solution for LeetCode ${selectedChallenge.title} in Java and JS.`;

      document.title = pageTitle;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', pageDesc);
      }

      let schemaScript = document.getElementById('leetcode-potd-schema');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'leetcode-potd-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }

      const codeData = extractCodeBlocks(selectedChallenge.content);
      const primaryLang = codeData.javascript && !codeData.java ? 'javascript' : 'java';

      const schemaData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'TechArticle',
            '@id': `https://mukprabhakar.in/leetcode-potd/${selectedChallenge.slug}#article`,
            headline: selectedChallenge.title,
            description: pageDesc,
            datePublished: selectedChallenge.date,
            dateModified: selectedChallenge.date,
            mainEntityOfPage: `https://mukprabhakar.in/leetcode-potd/${selectedChallenge.slug}`,
            author: { '@type': 'Person', name: 'Mukesh Pal', url: 'https://mukprabhakar.in' },
            publisher: {
              '@type': 'Organization',
              name: 'Mukesh Pal Portfolio',
              logo: {
                '@type': 'ImageObject',
                url: 'https://res.cloudinary.com/dddmyjevn/image/upload/q_auto/f_auto/v1775281267/mukeshp_ybprrz.png',
              },
            },
            keywords: `leetcode solution, ${selectedChallenge.tags.join(', ')}, ${selectedChallenge.title}`,
          },
        ],
      };

      Object.keys(codeData).forEach((lang) => {
        schemaData['@graph'].push({
          '@type': 'SoftwareSourceCode',
          '@id': `https://mukprabhakar.in/leetcode-potd/${selectedChallenge.slug}#code-${lang}`,
          programmingLanguage: getLanguageLabel(lang),
          codeSample: codeData[lang],
          name: `${selectedChallenge.title} ${getLanguageLabel(lang)} Solution`,
          description: `Optimal ${getLanguageLabel(lang)} implementation for LeetCode ${selectedChallenge.title}`,
          author: { '@type': 'Person', name: 'Mukesh Pal' },
        });
      });
      void primaryLang;

      schemaScript.textContent = JSON.stringify(schemaData, null, 2);
    } else {
      document.title = 'LeetCode POTD Solutions | Mukesh Pal - Daily Coding Challenges';
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Explore daily coding challenges and solutions from LeetCode. Conceptual breakdowns, Java and JavaScript implementations, and complexity analysis.'
        );
      }

      let schemaScript = document.getElementById('leetcode-potd-schema');
      if (schemaScript) schemaScript.remove();
    }
  }, [selectedChallenge]);

  // Scroll progress bar while reading a challenge
  useEffect(() => {
    if (!selectedChallenge) {
      setScrollProgress(0);
      return;
    }
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedChallenge]);

  const parsedGroups = useMemo(
    () => (selectedChallenge ? parseMarkdownIntoGroups(selectedChallenge.content) : null),
    [selectedChallenge]
  );

  const extractedCode = useMemo(
    () => (selectedChallenge ? extractCodeBlocks(selectedChallenge.content) : {}),
    [selectedChallenge]
  );

  const readMinutes = useMemo(
    () => (selectedChallenge ? estimateReadMinutes(selectedChallenge.content) : 0),
    [selectedChallenge]
  );

  // Sections shown in the "5. Solution" tab, excluding the raw solution
  // heading itself (its code is already rendered by SolutionCodePanel above).
  const codeTabSections = useMemo(() => {
    if (!parsedGroups) return [];
    return parsedGroups.code.filter((s) => !SOLUTION_HEADING_PATTERN.test(s.title.trim()));
  }, [parsedGroups]);

  const filteredChallenges = challenges.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q || c.title.toLowerCase().includes(q) || c.tags.some((tag) => tag.toLowerCase().includes(q));
    if (activeTab === 'all') return matchesSearch;
    return c.difficulty.toLowerCase() === activeTab && matchesSearch;
  });

  const currentIndex = selectedChallenge
    ? challenges.findIndex((c) => c.slug === selectedChallenge.slug)
    : -1;
  const olderChallenge = currentIndex >= 0 ? challenges[currentIndex + 1] : null;
  const newerChallenge = currentIndex > 0 ? challenges[currentIndex - 1] : null;

  const handleChallengeSelect = (challenge) => {
    navigate(`/leetcode-potd/${challenge.slug}`);
    trackEvent('click', 'leetcode_potd', `select_${challenge.slug}`);
    window.scrollTo({ top: 0 });
  };

  const handleBackToList = () => {
    navigate('/leetcode-potd');
    trackEvent('click', 'leetcode_potd', 'back_to_list');
  };

  const toggleUnderstood = useCallback((slugToToggle) => {
    setUnderstood((prev) => {
      const next = { ...prev, [slugToToggle]: !prev[slugToToggle] };
      safeLocalStorageSet(PROGRESS_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-black text-white selection:bg-white selection:text-black font-mono">
      {selectedChallenge && (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-zinc-900 z-50">
          <div
            className="h-full bg-white transition-[width] duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      <SEOEnhancement
        title={
          selectedChallenge
            ? `${selectedChallenge.title} Solution | Mukesh Pal LeetCode POTD`
            : 'LeetCode POTD Solutions | Mukesh Pal - Daily Coding Challenges'
        }
        description={
          selectedChallenge
            ? selectedChallenge.excerpt
            : 'Explore daily coding challenges and solutions from LeetCode. Conceptual breakdowns, Java and JavaScript implementations, and complexity analysis.'
        }
        type="website"
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b border-white pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {selectedChallenge ? (
              <p className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-400 uppercase mb-2">
                LeetCode POTD
              </p>
            ) : (
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase mb-2">
                LeetCode POTD
              </h1>
            )}
            <p className="text-zinc-500 text-xs font-light max-w-xl leading-relaxed">
              Beginner-friendly breakdowns, dry runs, and verified solutions — built so a complete
              beginner can follow along and actually understand the algorithm, not just copy code.
            </p>
          </div>
          <div>
            <span className="text-[10px] border border-zinc-800 px-3 py-1 text-zinc-400 rounded bg-zinc-950 font-bold uppercase tracking-wider">
              {challenges.length} Challenges Solved
            </span>
          </div>
        </div>

        {selectedChallenge && (
          <button
            onClick={handleBackToList}
            className="inline-flex items-center text-xs uppercase tracking-wider font-bold mb-8 border border-zinc-800 hover:border-white px-4 py-2 rounded transition bg-zinc-900 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
          >
            ← Back to challenges list
          </button>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : !selectedChallenge ? (
          /* ---------------------------- Challenge list ---------------------------- */
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex border border-zinc-800 p-1 bg-zinc-950 rounded-lg max-w-xs">
                {['all', 'easy', 'medium', 'hard'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 px-4 rounded text-xs font-bold uppercase tracking-wider transition ${
                      activeTab === tab ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="SEARCH PROBLEMS OR TAGS..."
                  aria-label="Search problems or tags"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 text-white placeholder-zinc-700 border border-zinc-800 focus:border-white focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono uppercase tracking-wider"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((c) => (
                  <div
                    key={c.slug}
                    onClick={() => handleChallengeSelect(c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleChallengeSelect(c)}
                    className="group border border-zinc-800 bg-zinc-950 hover:border-white p-6 rounded-lg transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[10px] text-zinc-500 uppercase">{c.date}</span>
                        <DifficultyBadge difficulty={c.difficulty} />
                        <span className="text-[10px] text-zinc-600">
                          {estimateReadMinutes(c.content)} min read
                        </span>
                        {understood[c.slug] && (
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                            ✓ Understood
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold tracking-tight group-hover:underline text-white truncate">
                        {c.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {c.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-zinc-500">
                            #{tag.replace(/\s+/g, '').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs border border-zinc-800 group-hover:border-white px-4 py-2 text-zinc-400 group-hover:text-white transition uppercase font-bold tracking-wider inline-block rounded-md">
                        View Solution
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-zinc-900 rounded-lg">
                  <p className="text-zinc-500 uppercase text-xs">No LeetCode POTD questions found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ------------------------- Detailed challenge view ------------------------ */
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-zinc-800 pb-6">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-[10px] text-zinc-500 uppercase">{selectedChallenge.date}</span>
                <DifficultyBadge difficulty={selectedChallenge.difficulty} />
                <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded text-zinc-400 uppercase">
                  {selectedChallenge.platform}
                </span>
                <span className="text-[10px] text-zinc-600">{readMinutes} min read</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  {selectedChallenge.title}
                </h1>
                <button
                  onClick={() => toggleUnderstood(selectedChallenge.slug)}
                  className={`shrink-0 text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded border transition ${
                    understood[selectedChallenge.slug]
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                      : 'border-zinc-800 text-zinc-400 hover:border-white hover:text-white'
                  }`}
                >
                  {understood[selectedChallenge.slug] ? '✓ Understood' : 'Mark as Understood'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 border border-zinc-800 p-4 rounded-lg bg-zinc-950 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 uppercase block mb-1">Time Complexity</span>
                  <span className="text-white font-bold">{selectedChallenge.timeComplexity}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block mb-1">Space Complexity</span>
                  <span className="text-white font-bold">{selectedChallenge.spaceComplexity}</span>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div
              className="flex border-b border-zinc-800 overflow-x-auto pb-px gap-1 sticky top-0 bg-black/95 backdrop-blur z-40 -mx-4 px-4 sm:mx-0 sm:px-0"
              role="tablist"
            >
              {DETAIL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeDetailTab === tab.id}
                  title={tab.help}
                  onClick={() => {
                    setActiveDetailTab(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    trackEvent('click', 'leetcode_potd_tab', tab.id);
                  }}
                  className={`py-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition ${
                    activeDetailTab === tab.id
                      ? 'border-white text-white bg-zinc-950/40 font-black'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="relative">
              {activeDetailTab === 'code' && <SolutionCodePanel extractedCode={extractedCode} />}

              {(activeDetailTab === 'code' ? codeTabSections : parsedGroups[activeDetailTab]).length > 0 ? (
                (activeDetailTab === 'code' ? codeTabSections : parsedGroups[activeDetailTab]).map(
                  (section, i) => (
                    <SectionBlock
                      key={`${activeDetailTab}-${i}`}
                      title={section.title}
                      content={section.content}
                      highlight={/⭐|key insight/i.test(section.title)}
                    />
                  )
                )
              ) : activeDetailTab !== 'code' ? (
                <p className="text-zinc-500 text-xs uppercase tracking-wider py-10 text-center">
                  Nothing here yet for this section.
                </p>
              ) : null}
            </div>

            {/* Prev / next navigation */}
            {(olderChallenge || newerChallenge) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-zinc-900">
                {newerChallenge ? (
                  <button
                    onClick={() => handleChallengeSelect(newerChallenge)}
                    className="text-left border border-zinc-800 hover:border-white rounded-lg p-4 transition group"
                  >
                    <span className="text-[10px] text-zinc-500 uppercase block mb-1">Newer ↑</span>
                    <span className="text-sm text-zinc-300 group-hover:text-white truncate block">
                      {newerChallenge.title}
                    </span>
                  </button>
                ) : (
                  <div />
                )}
                {olderChallenge ? (
                  <button
                    onClick={() => handleChallengeSelect(olderChallenge)}
                    className="text-left sm:text-right border border-zinc-800 hover:border-white rounded-lg p-4 transition group"
                  >
                    <span className="text-[10px] text-zinc-500 uppercase block mb-1">Older ↓</span>
                    <span className="text-sm text-zinc-300 group-hover:text-white truncate block">
                      {olderChallenge.title}
                    </span>
                  </button>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-16 text-center border-t border-zinc-900 pt-10">
          <Link
            to="/"
            onClick={() => trackEvent('click', 'leetcode_potd_page', 'back_home')}
            className="inline-flex items-center px-6 py-3 rounded border border-white text-white hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-wider"
          >
            Return to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeetCodePOTD;