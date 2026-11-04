const fs = require('fs');
const path = require('path');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Markdown to HTML parser with code block shielding and single H1 preservation
function parseMarkdown(md) {
  const frontmatterRegex = /^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = md.match(frontmatterRegex);

  let frontmatter = {};
  let content = md;

  if (match) {
    const frontmatterStr = match[1];
    content = match[2];

    const lines = frontmatterStr.split(/\r?\n/);
    lines.forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim();
        let value = line.slice(colonIdx + 1).trim();
        value = value.replace(/^["']|["']$/g, '');
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
        }
        frontmatter[key] = value;
      }
    });
  }

  const codeBlocks = [];
  const inlineCodes = [];

  // 1. Extract fenced code blocks into placeholders
  let html = content.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (m, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre style="background: #18181b; padding: 1.25rem; border-radius: 8px; overflow-x: auto; border: 1px solid #27272a; margin: 1.5rem 0;"><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`);
    return placeholder;
  });

  // 2. Extract inline code into placeholders
  html = html.replace(/`([^`\r\n]+)`/g, (m, code) => {
    const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
    inlineCodes.push(`<code style="background: #27272a; padding: 0.2rem 0.4rem; border-radius: 4px; color: #10b981; font-size: 0.9em; font-family: monospace;">${escapeHtml(code)}</code>`);
    return placeholder;
  });

  // 3. Strip top-level title header if it duplicates frontmatter title or is redundant
  if (frontmatter.title) {
    const escapedTitle = frontmatter.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`^#\\s+${escapedTitle}\\s*$`, 'im'), '');
  }

  // 4. Transform headers (ensure only 1 h1 per page: body # maps to h2)
  html = html.replace(/^#### (.*$)/gim, '<h4 style="color: #e4e4e7; margin-top: 1.25rem; font-size: 1.1rem; font-weight: 600;">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 style="color: #ffffff; margin-top: 1.5rem; font-size: 1.3rem; font-weight: 700;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="color: #ffffff; border-bottom: 1px solid #27272a; padding-bottom: 0.5rem; margin-top: 2rem; font-size: 1.6rem; font-weight: 700;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="color: #10b981; margin-top: 2rem; font-size: 1.8rem; font-weight: 700; border-bottom: 1px solid #27272a; padding-bottom: 0.5rem;">$1</h2>');

  // 5. Horizontal rules
  html = html.replace(/^---+$/gim, '<hr style="border: 0; border-top: 1px solid #27272a; margin: 2rem 0;" />');

  // 6. Blockquotes
  html = html.replace(/^>\s?(.*$)/gim, '<blockquote style="border-left: 4px solid #10b981; padding-left: 1rem; color: #a1a1aa; font-style: italic; margin: 1.5rem 0;">$1</blockquote>');

  // 7. Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 12px; margin: 1.5rem 0; border: 1px solid #27272a;">');

  // 8. Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #10b981; text-decoration: underline;">$1</a>');

  // 9. Bold & Italic
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([\s\S]*?)\*/g, '<em>$1</em>');
  html = html.replace(/_([\s\S]*?)_/g, '<em>$1</em>');

  // 10. Markdown Tables
  html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (tableBlock) => {
    const rows = tableBlock.trim().split(/\r?\n/).filter(r => !r.match(/^\|?\s*[-:]+[-| :]*\|?$/));
    if (rows.length === 0) return '';
    const tableHtml = rows.map((row, idx) => {
      const cols = row.split('|').slice(1, -1).map(c => c.trim());
      const tag = idx === 0 ? 'th' : 'td';
      const style = idx === 0 ? 'padding: 0.75rem 1rem; background: #18181b; color: #ffffff; border: 1px solid #27272a; font-weight: 700;' : 'padding: 0.75rem 1rem; border: 1px solid #27272a; color: #d4d4d8;';
      return `<tr>${cols.map(c => `<${tag} style="${style}">${c}</${tag}>`).join('')}</tr>`;
    }).join('\n');
    return `<div style="overflow-x: auto; margin: 1.5rem 0;"><table style="width: 100%; border-collapse: collapse; text-align: left;">${tableHtml}</table></div>`;
  });

  // 11. Lists
  html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (m) => {
    return `<ul style="line-height: 1.7; color: #d4d4d8; padding-left: 1.5rem; margin-bottom: 1.5rem;">${m}</ul>`;
  });
  html = html.replace(/<\/ul>\s*<ul[^>]*>/g, '');

  // 12. Paragraphs
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<ul') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<div') || trimmed.startsWith('<hr') || trimmed.startsWith('__CODE_BLOCK_')) {
      return trimmed;
    }
    return `<p style="line-height: 1.8; color: #d4d4d8; margin-bottom: 1.5rem;">${trimmed}</p>`;
  }).join('\n');

  // 13. Restore code blocks and inline code
  codeBlocks.forEach((cb, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, cb);
  });
  inlineCodes.forEach((ic, idx) => {
    html = html.replace(`__INLINE_CODE_${idx}__`, ic);
  });

  return { frontmatter, html };
}

// Helper to write files to both public and dist
function writeHtmlFile(targetPath, htmlContent) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(targetPath, htmlContent, 'utf8');
}

function deployFile(relPath, htmlContent) {
  writeHtmlFile(path.join(publicDir, relPath), htmlContent);
  if (fs.existsSync(distDir)) {
    writeHtmlFile(path.join(distDir, relPath), htmlContent);
  }
  console.log(`✓ Generated: ${relPath}`);
}

const blogPostsDir = path.join(__dirname, '../src/blog-posts');
const potdDir = path.join(__dirname, '../src/leetcode-potd');
const publicDir = path.join(__dirname, '../public');
const distDir = path.join(__dirname, '../dist');

// ==========================================
// 1. Process Blog Posts & Generate Pages
// ==========================================
const blogFiles = fs.existsSync(blogPostsDir) ? fs.readdirSync(blogPostsDir).filter(f => f.endsWith('.md')) : [];
const posts = [];

blogFiles.forEach(file => {
  const slug = file.replace('.md', '');
  const filePath = path.join(blogPostsDir, file);
  const mdContent = fs.readFileSync(filePath, 'utf8');

  const { frontmatter, html } = parseMarkdown(mdContent);
  const title = frontmatter.title || 'Blog Post';
  const date = frontmatter.date || '2026-03-01';
  const excerpt = frontmatter.excerpt || '';
  const image = frontmatter.image || '';
  const tags = frontmatter.tags || [];

  posts.push({
    slug,
    title,
    date,
    excerpt,
    tags,
    image
  });

  const fullPostHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} | Mukesh Pal Blog</title>
  <meta name="description" content="${escapeHtml(excerpt || title)}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="https://mukprabhakar.in/blog/${slug}" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(excerpt || title)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://mukprabhakar.in/blog/${slug}" />
  ${image ? `<meta property="og:image" content="https://mukprabhakar.in${image.startsWith('/') ? image : '/' + image}" />` : ''}
  <meta property="article:published_time" content="${date}" />
  <meta property="article:author" content="Mukesh Pal" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(excerpt || title)}" />
  <meta name="twitter:url" content="https://mukprabhakar.in/blog/${slug}" />
  ${image ? `<meta name="twitter:image" content="https://mukprabhakar.in${image.startsWith('/') ? image : '/' + image}" />` : ''}
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/blog/${slug}';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0c;
      color: #e4e4e7;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <p><a href="/blog">← Back to Blog</a> | <a href="/">Portfolio Home</a></p>
  </header>

  <article style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <header style="margin-bottom: 2rem;">
      <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; line-height: 1.2; font-weight: 800;">${escapeHtml(title)}</h1>
      <p style="color: #71717a; font-size: 0.95rem; margin-top: 0;">
        Published on <strong>${date}</strong> by <strong>Mukesh Pal</strong>
      </p>
      ${tags.length > 0 ? `<p style="margin-top: 0.5rem;">${tags.map(t => `<span style="background: #27272a; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; margin-right: 0.5rem; color: #a1a1aa;">#${escapeHtml(t)}</span>`).join('')}</p>` : ''}
    </header>

    <div style="font-size: 1.1rem; line-height: 1.8;">
      ${html}
    </div>
  </article>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

  deployFile(`blog/${slug}/index.html`, fullPostHtml);
});

// Sort posts descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// ==========================================
// 2. Blog Main Landing Page
// ==========================================
const blogListHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog - Mukesh Pal | Full-Stack Developer & Tech Blogger</title>
  <meta name="description" content="Read technical articles by Mukesh Pal on React.js, Java Spring Boot, AI, web development, and software engineering." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/blog" />
  
  <meta property="og:title" content="Blog - Mukesh Pal | Full-Stack Developer & Tech Blogger" />
  <meta property="og:description" content="Read technical articles by Mukesh Pal on React.js, Java Spring Boot, AI, web development, and software engineering." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mukprabhakar.in/blog" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/blog';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0c;
      color: #e4e4e7;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">Mukesh Pal Blog & Journal</h1>
    <p style="color: #a1a1aa; margin-top: 0;">Insights on Full-Stack Development, React.js, Java Spring Boot, and AI Architecture</p>
    <p><a href="/">← Back to Portfolio Home</a></p>
  </header>

  <main style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <section>
      ${posts.map(post => `
        <article style="margin-bottom: 3rem; border-bottom: 1px solid #1f1f23; padding-bottom: 2rem;">
          <header>
            <h2 style="margin-bottom: 0.5rem; font-size: 1.75rem;"><a href="/blog/${post.slug}" style="color: #10b981;">${escapeHtml(post.title)}</a></h2>
            <p style="color: #71717a; font-size: 0.9rem; margin-top: 0;">Published on <strong>${post.date}</strong></p>
          </header>
          <p style="line-height: 1.6; color: #d4d4d8;">${escapeHtml(post.excerpt)}</p>
          <p><a href="/blog/${post.slug}">Read Full Article →</a></p>
        </article>
      `).join('')}
    </section>
  </main>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

deployFile('blog/index.html', blogListHtml);

// ==========================================
// 3. All Projects Page
// ==========================================
const projectsData = [
  {
    title: 'CodeOra Launchpad',
    tags: ['React.js', 'Java', 'Spring Boot', 'SQL', 'AI/ML'],
    description: 'A SaaS-based ed-tech startup platform where students access AI-generated projects, adaptive quizzes, recruiter portal, and college dashboards. Led development using React.js and Spring Boot with MySQL.'
  },
  {
    title: 'Trigo Medical',
    tags: ['React.js', 'Java', 'Spring Boot', 'SQL', 'WebSockets'],
    description: 'A medical startup that helps users order medicine from local pharmacies with instant delivery, routing logistics, real-time inventory management, and WebSocket tracking.'
  },
  {
    title: 'Crypto Trading Platform',
    tags: ['React.js', 'Java', 'Spring Boot', 'WebSockets'],
    description: 'Designed a crypto trading platform with functionalities for buying, selling, and tracking cryptocurrency prices with sub-second WebSocket updates and historical analysis.'
  },
  {
    title: 'Automated Bus Scheduling System',
    tags: ['Java', 'Spring Boot', 'SQL', 'GIS'],
    description: 'Optimized routing and automated shift duty scheduling system built for the Delhi Transport Corporation (DTC) to reduce delays by 45% using Spring Boot and GIS mapping.'
  },
  {
    title: 'Student Details with Image - IIMT University Incubation Center',
    tags: ['Computer Vision', 'Security', 'AI/ML', 'Surveillance'],
    description: 'Advanced campus safety image processing solution to identify student records from CCTV snapshots, lowering security incident response time by 60%.'
  },
  {
    title: 'Dry Fruit Delight - E-commerce Platform',
    tags: ['E-commerce', 'React.js', 'Node.js', 'MongoDB', 'Wix'],
    description: 'A complete e-commerce platform for premium dry fruits, nuts, seeds, and spices with custom payment integrations, customer reviews, and search optimization.'
  },
  {
    title: 'Just Mewa - Premium E-commerce Store',
    tags: ['E-commerce', 'React.js', 'Next.js', 'Stripe', 'CMS'],
    description: 'Modern, high-conversion rate online store featuring premium organic dry fruits and organic nuts, Stripe checkout, lead forms, and FSSAI certifications.'
  },
  {
    title: 'CRM App with RBAC System',
    tags: ['HTML', 'JavaScript', 'CSS', 'Python', 'Django'],
    description: 'Web-based Customer Relationship Management tool with secure user authentication and role-based access control (RBAC) levels.'
  }
];

const allProjectsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Projects - Mukesh Pal | Full-Stack Developer Portfolio</title>
  <meta name="description" content="Explore full-stack applications built by Mukesh Pal using React, Spring Boot, Node.js, and Python. Startup products, GIS tools, and AI solutions." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/all-projects" />
  
  <meta property="og:title" content="All Projects - Mukesh Pal | Full-Stack Developer Portfolio" />
  <meta property="og:description" content="Explore full-stack applications built by Mukesh Pal using React, Spring Boot, Node.js, and Python. Startup products, GIS tools, and AI solutions." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mukprabhakar.in/all-projects" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/all-projects';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0c;
      color: #e4e4e7;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">All Projects — Mukesh Pal</h1>
    <p style="color: #a1a1aa; margin-top: 0;">Portfolio of full-stack engineering, SaaS startups, and systems development.</p>
    <p><a href="/">← Back to Portfolio Home</a></p>
  </header>

  <main style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <section style="display: grid; gap: 2rem;">
      ${projectsData.map(proj => `
        <article style="background: #18181b; padding: 1.5rem; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 0.5rem; font-size: 1.5rem;">${escapeHtml(proj.title)}</h2>
          <p style="margin-top: 0; margin-bottom: 1rem;">
            ${proj.tags.map(t => `<span style="background: #27272a; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; margin-right: 0.5rem; color: #10b981; font-weight: bold;">${escapeHtml(t)}</span>`).join('')}
          </p>
          <p style="line-height: 1.6; color: #d4d4d8; margin-bottom: 0;">${escapeHtml(proj.description)}</p>
        </article>
      `).join('')}
    </section>
  </main>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

deployFile('all-projects/index.html', allProjectsHtml);

// ==========================================
// 4. Gallery Page
// ==========================================
const galleryData = [
  { title: 'TEDx IIMT Organization Team', category: 'Events', desc: 'Proud member of the TEDx IIMT University organization team, bringing inspiring talks to our community.', img: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018046/1762925094340_qxegbw.jpg' },
  { title: 'With ISRO Scientist Dr. Alok Taori', category: 'Research', desc: 'Meeting with ISRO scientist Dr. Alok Taori during research collaboration at NRSC Hyderabad.', img: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018218/1746639744569_aojopr.jpg' },
  { title: 'ISRO Visit - NRSC Center Hyderabad', category: 'Education', desc: 'Educational visit and scientific collaboration at National Remote Sensing Centre (NRSC) Hyderabad.', img: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018218/1746639762506_lmlter.jpg' },
  { title: 'Award from Coding Ninjas Co-founder', category: 'Achievements', desc: 'Receiving recognition from Anshul Shukla, Co-founder of Coding Ninjas, for technical excellence.', img: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018215/1693138336430_bnzi06.jpg' },
  { title: 'With Entrepreneur Punit Mongoliya', category: 'Entrepreneurship', desc: 'Networking session with entrepreneur Punit Mongoliya discussing SaaS startups and growth.', img: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018217/1726985209533_bp0bah.jpg' },
  { title: 'Russian Embassy Visit - Delhi', category: 'Events', desc: 'Official delegation visit to Russian House and Russian Embassy in New Delhi for international cultural exchange.', img: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775017930/mukesh_russan_ambassi_mmnusg.jpg' },
  { title: 'Project Presentation at Hackathon', category: 'Events', desc: 'Presenting innovative full-stack software solutions during competitive national hackathon.', img: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018219/1759082135749_ljckdi.jpg' },
  { title: 'Startup India Summit', category: 'Entrepreneurship', desc: 'Participating in Startup India summit connecting with tech innovators, founders, and venture partners.', img: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018222/84_jarzee.jpg' },
  { title: 'AI Impact Summit Delhi', category: 'Events', desc: 'Attending AI Impact Summit in New Delhi exploring generative AI, agentic systems, and neural architectures.', img: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018220/81_jpgowa.jpg' }
];

const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Moments in Tech & Gallery | Mukesh Pal</title>
  <meta name="description" content="Visual portfolio and tech journey of Mukesh Pal featuring moments at ISRO NRSC, TEDx, hackathons, and technology conferences." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/gallery" />
  
  <meta property="og:title" content="Moments in Tech & Gallery | Mukesh Pal" />
  <meta property="og:description" content="Visual portfolio and tech journey of Mukesh Pal featuring moments at ISRO NRSC, TEDx, hackathons, and technology conferences." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mukprabhakar.in/gallery" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/gallery';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0c;
      color: #e4e4e7;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">Moments in Tech & Gallery</h1>
    <p style="color: #a1a1aa; margin-top: 0;">A visual record of milestones, conferences, hackathons, and research visits in my engineering journey.</p>
    <p><a href="/">← Back to Portfolio Home</a></p>
  </header>

  <main style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
    <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
      ${galleryData.map(item => `
        <article style="background: #18181b; border-radius: 12px; border: 1px solid #27272a; overflow: hidden;">
          <img src="${item.img}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 200px; object-fit: cover; border-bottom: 1px solid #27272a;" loading="lazy" />
          <div style="padding: 1.25rem;">
            <span style="background: #27272a; color: #10b981; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">${escapeHtml(item.category)}</span>
            <h2 style="color: #ffffff; font-size: 1.25rem; margin: 0.75rem 0 0.5rem 0;">${escapeHtml(item.title)}</h2>
            <p style="color: #a1a1aa; font-size: 0.9rem; line-height: 1.6; margin: 0;">${escapeHtml(item.desc)}</p>
          </div>
        </article>
      `).join('')}
    </section>
  </main>

  <footer style="max-width: 900px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

deployFile('gallery/index.html', galleryHtml);

// ==========================================
// 5. Badges & Certifications Page
// ==========================================
const badgesData = [
  { title: 'Explore AI Level 1', issuer: 'Microsoft MVP and Student Ambassadors Communities', date: '2025-05-29', desc: 'Demonstrating generative AI proficiency and application using Microsoft Copilot.' },
  { title: 'Cloud Skills Challenge Event Host', issuer: 'Microsoft Learn Student Ambassadors', date: '2024-07-25', desc: 'Organizing and hosting gamified Microsoft Learn cloud skills challenges for developer communities.' },
  { title: 'Google Cloud Computing Foundations Certificate', issuer: 'Google Cloud', date: '2024-07-24', desc: 'Foundational cloud engineering, IT infrastructure, and cloud-native application deployment.' },
  { title: 'Data Science Foundations - Level 1', issuer: 'IBM', date: '2023-06-10', desc: 'Big data concepts, predictive analytics algorithms, and enterprise data science workflows.' },
  { title: 'Get Started with Cloud Storage Skill Badge', issuer: 'Google Cloud', date: '2024-08-13', desc: 'Cloud Storage buckets, gsutil CLI commands, object protection, and Bucket Lock policies.' },
  { title: 'Build a Website on Google Cloud Skill Badge', issuer: 'Google Cloud', date: '2024-07-23', desc: 'Deploying web services to Cloud Run, Compute Engine, and Google Kubernetes Engine (GKE).' }
];

const badgesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certifications & Credly Badges | Mukesh Pal</title>
  <meta name="description" content="Explore verified professional certifications and skill badges earned by Mukesh Pal on Credly from Microsoft, Google Cloud, IBM, and more." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/badges" />
  
  <meta property="og:title" content="Certifications & Credly Badges | Mukesh Pal" />
  <meta property="og:description" content="Explore verified professional certifications and skill badges earned by Mukesh Pal on Credly from Microsoft, Google Cloud, IBM, and more." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mukprabhakar.in/badges" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/badges';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0c;
      color: #e4e4e7;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">Certifications & Credly Badges</h1>
    <p style="color: #a1a1aa; margin-top: 0;">Verified technical certifications, cloud credentials, and community honors.</p>
    <p><a href="/">← Back to Portfolio Home</a></p>
  </header>

  <main style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <section style="display: grid; gap: 1.5rem;">
      ${badgesData.map(b => `
        <article style="background: #18181b; padding: 1.5rem; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 0.5rem; font-size: 1.35rem;">${escapeHtml(b.title)}</h2>
          <p style="color: #10b981; font-weight: 600; font-size: 0.9rem; margin-top: 0;">Issuer: ${escapeHtml(b.issuer)} | Issued: ${escapeHtml(b.date)}</p>
          <p style="line-height: 1.6; color: #d4d4d8; margin-bottom: 0;">${escapeHtml(b.desc)}</p>
        </article>
      `).join('')}
    </section>
  </main>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

deployFile('badges/index.html', badgesHtml);

// ==========================================
// 6. GitHub Stats Page
// ==========================================
const githubHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Contributions & Open Source | Mukesh Pal</title>
  <meta name="description" content="Discover GitHub statistics, open source contributions, repositories, and achievements by Mukesh Pal." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/github" />
  
  <meta property="og:title" content="GitHub Contributions & Open Source | Mukesh Pal" />
  <meta property="og:description" content="Discover GitHub statistics, open source contributions, repositories, and achievements by Mukesh Pal." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mukprabhakar.in/github" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/github';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0c;
      color: #e4e4e7;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">GitHub Contributions & Open Source</h1>
    <p style="color: #a1a1aa; margin-top: 0;">Open source software engineering, daily commit history, and public code repositories.</p>
    <p><a href="/">← Back to Portfolio Home</a></p>
  </header>

  <main style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <section style="background: #18181b; padding: 1.5rem; border-radius: 12px; border: 1px solid #27272a; margin-bottom: 2rem;">
      <h2 style="color: #ffffff; margin-top: 0;">Overview & Highlights</h2>
      <ul style="line-height: 1.8; color: #d4d4d8; padding-left: 1.5rem;">
        <li><strong>GitHub Profile:</strong> <a href="https://github.com/mukprabhakar" target="_blank" rel="noopener noreferrer">@mukprabhakar</a></li>
        <li><strong>Primary Languages:</strong> Java, JavaScript, TypeScript, Python, SQL</li>
        <li><strong>Core Frameworks:</strong> React.js, Next.js, Spring Boot, Node.js, Express</li>
        <li><strong>Open Source Projects:</strong> CodeOra Launchpad, Trigo Medical, DTC Bus Scheduling System</li>
      </ul>
    </section>
  </main>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

deployFile('github/index.html', githubHtml);

// ==========================================
// 7. Coding Challenges Page
// ==========================================
const codingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Competitive Programming & Problem Solving | Mukesh Pal</title>
  <meta name="description" content="Competitive programming profile and problem-solving stats of Mukesh Pal across LeetCode, GeeksforGeeks, CodeChef, and HackerRank." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/coding" />
  
  <meta property="og:title" content="Competitive Programming & Problem Solving | Mukesh Pal" />
  <meta property="og:description" content="Competitive programming profile and problem-solving stats of Mukesh Pal across LeetCode, GeeksforGeeks, CodeChef, and HackerRank." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mukprabhakar.in/coding" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/coding';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0c;
      color: #e4e4e7;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">Competitive Programming & Problem Solving</h1>
    <p style="color: #a1a1aa; margin-top: 0;">DSA problem solving track across major coding platforms including LeetCode, CodeChef, and GeeksforGeeks.</p>
    <p><a href="/">← Back to Portfolio Home</a></p>
  </header>

  <main style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <section style="display: grid; gap: 1.5rem;">
      <article style="background: #18181b; padding: 1.5rem; border-radius: 12px; border: 1px solid #27272a;">
        <h2 style="color: #ffffff; margin-top: 0; font-size: 1.4rem;">LeetCode</h2>
        <p style="color: #d4d4d8; line-height: 1.6;">350+ Problems solved with strong focus on Dynamic Programming, Graphs, and Tree Traversals. Daily active participant in LeetCode POTD.</p>
        <p><a href="https://leetcode.com/mukprabhakar" target="_blank" rel="noopener noreferrer">View LeetCode Profile →</a></p>
      </article>

      <article style="background: #18181b; padding: 1.5rem; border-radius: 12px; border: 1px solid #27272a;">
        <h2 style="color: #ffffff; margin-top: 0; font-size: 1.4rem;">GeeksforGeeks</h2>
        <p style="color: #d4d4d8; line-height: 1.6;">200+ Core algorithmic problems solved across data structures, system design basics, and backend problem sets.</p>
        <p><a href="https://www.geeksforgeeks.org/user/mukprabhakar/" target="_blank" rel="noopener noreferrer">View GFG Profile →</a></p>
      </article>

      <article style="background: #18181b; padding: 1.5rem; border-radius: 12px; border: 1px solid #27272a;">
        <h2 style="color: #ffffff; margin-top: 0; font-size: 1.4rem;">CodeChef & HackerRank</h2>
        <p style="color: #d4d4d8; line-height: 1.6;">Contest participation, 5-Star Problem Solving badge on HackerRank, and rating progress in CodeChef division rounds.</p>
      </article>
    </section>
  </main>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

deployFile('coding/index.html', codingHtml);

// ==========================================
// 8. Clients & Testimonials Page
// ==========================================
const clientsData = [
  { name: 'IIMT University', industry: 'Education', desc: 'Provided custom web software and campus security computer vision integrations for the Incubation Center.' },
  { name: 'Oye College', industry: 'EdTech', desc: 'Engineered student enrollment flow, digital course catalog, and high-performance frontend interfaces.' },
  { name: 'RBS Tours and Travels', industry: 'Travel & Tourism', desc: 'Built comprehensive booking, fleet scheduling, and customer quotation portal for luxury travel services.' },
  { name: 'Dry Fruit Delight', industry: 'E-commerce', desc: 'Constructed custom e-commerce shop with product cataloging, payment processing, and SEO architecture.' },
  { name: 'Just Mewa', industry: 'E-commerce', desc: 'Architected high-converting direct-to-consumer store with organic certifications, Stripe gateway, and UX optimizations.' },
  { name: 'CCS University Meerut', industry: 'Education', desc: 'Technical consultation and academic software management solutions.' }
];

const clientsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clients & Testimonials | Mukesh Pal - Full-Stack Developer</title>
  <meta name="description" content="Trusted by companies, startups, and institutions including IIMT University, Oye College, RBS Tours, and e-commerce platforms for custom web and full-stack solutions." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/clients" />
  
  <meta property="og:title" content="Clients & Testimonials | Mukesh Pal - Full-Stack Developer" />
  <meta property="og:description" content="Trusted by companies, startups, and institutions including IIMT University, Oye College, RBS Tours, and e-commerce platforms for custom web and full-stack solutions." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mukprabhakar.in/clients" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/clients';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0c;
      color: #e4e4e7;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">Our Valued Clients & Partnerships</h1>
    <p style="color: #a1a1aa; margin-top: 0;">Empowering innovative organizations with production-grade full-stack systems and digital engineering.</p>
    <p><a href="/">← Back to Portfolio Home</a></p>
  </header>

  <main style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <section style="display: grid; gap: 1.5rem;">
      ${clientsData.map(c => `
        <article style="background: #18181b; padding: 1.5rem; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 0.25rem; font-size: 1.35rem;">${escapeHtml(c.name)}</h2>
          <p style="color: #10b981; font-weight: 600; font-size: 0.85rem; margin-top: 0; text-transform: uppercase;">Industry: ${escapeHtml(c.industry)}</p>
          <p style="line-height: 1.6; color: #d4d4d8; margin-bottom: 0;">${escapeHtml(c.desc)}</p>
        </article>
      `).join('')}
    </section>
  </main>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

deployFile('clients/index.html', clientsHtml);

// ==========================================
// 9. Products Page
// ==========================================
const productsData = [
  { title: 'CodeOra Launchpad', category: 'SaaS', price: '$19/mo', desc: 'A SaaS-based ed-tech platform featuring AI-generated project roadmaps, adaptive quizzes, role-based dashboards, and recruiter portals.' },
  { title: 'Trigo Medical', category: 'SaaS', price: 'Licensing', desc: 'Location-based pharmaceutical delivery platform linking local pharmacies with consumers for sub-hour order fulfillment.' },
  { title: 'Dry Fruit Delight E-Commerce', category: 'E-Commerce', price: 'Turnkey', desc: 'A modern, high-converting retail platform optimized for wholesale and retail organic products with payment gateway integration.' }
];

const productsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Software Products | Mukesh Pal - SaaS & Web Applications</title>
  <meta name="description" content="Explore premium SaaS platforms, e-commerce networks, and software applications built by Mukesh Pal. Featuring CodeOra, Trigo Medical, and Dry Fruit Delight." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/products" />
  
  <meta property="og:title" content="Software Products | Mukesh Pal - SaaS & Web Applications" />
  <meta property="og:description" content="Explore premium SaaS platforms, e-commerce networks, and software applications built by Mukesh Pal." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mukprabhakar.in/products" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/products';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0c;
      color: #e4e4e7;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">Software Products & SaaS Solutions</h1>
    <p style="color: #a1a1aa; margin-top: 0;">Ready-to-deploy software architectures, SaaS platforms, and enterprise tools built by Mukesh Pal.</p>
    <p><a href="/">← Back to Portfolio Home</a></p>
  </header>

  <main style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <section style="display: grid; gap: 1.5rem;">
      ${productsData.map(p => `
        <article style="background: #18181b; padding: 1.5rem; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 0.25rem; font-size: 1.35rem;">${escapeHtml(p.title)}</h2>
          <p style="color: #10b981; font-weight: 600; font-size: 0.85rem; margin-top: 0;">Category: ${escapeHtml(p.category)} | Model: ${escapeHtml(p.price)}</p>
          <p style="line-height: 1.6; color: #d4d4d8; margin-bottom: 0;">${escapeHtml(p.desc)}</p>
        </article>
      `).join('')}
    </section>
  </main>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

deployFile('products/index.html', productsHtml);

// ==========================================
// 10. LeetCode POTD Pages & Posts
// ==========================================
const potdChallenges = [];

if (fs.existsSync(potdDir)) {
  const potdFiles = fs.readdirSync(potdDir).filter(file => file.endsWith('.md'));

  potdFiles.forEach(file => {
    const slug = file.replace('.md', '');
    const filePath = path.join(potdDir, file);
    const mdContent = fs.readFileSync(filePath, 'utf8');

    const { frontmatter, html } = parseMarkdown(mdContent);
    const title = frontmatter.title || 'LeetCode Challenge';
    const date = frontmatter.date || '2026-03-01';
    const excerpt = frontmatter.excerpt || '';
    const difficulty = frontmatter.difficulty || 'Medium';

    potdChallenges.push({
      slug,
      title,
      date,
      excerpt,
      difficulty
    });

    const challengeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} Solution | Mukesh Pal LeetCode POTD</title>
  <meta name="description" content="${escapeHtml(excerpt || title)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/leetcode-potd/${slug}" />
  
  <meta property="og:title" content="${escapeHtml(title)} Solution | Mukesh Pal LeetCode POTD" />
  <meta property="og:description" content="${escapeHtml(excerpt || title)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://mukprabhakar.in/leetcode-potd/${slug}" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/leetcode-potd/${slug}';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #000000;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <p><a href="/leetcode-potd">← Back to LeetCode POTD</a> | <a href="/">Portfolio Home</a></p>
  </header>

  <article style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <header style="margin-bottom: 2rem;">
      <h1 style="color: #ffffff; font-size: 2.2rem; margin-bottom: 0.5rem; line-height: 1.2; font-weight: 800;">${escapeHtml(title)}</h1>
      <p style="color: #a1a1aa; font-size: 0.95rem; margin-top: 0;">
        Difficulty: <strong style="color: #10b981;">${escapeHtml(difficulty)}</strong> | Published on <strong>${date}</strong>
      </p>
    </header>

    <div style="font-size: 1.1rem; line-height: 1.8; color: #d4d4d8;">
      ${html}
    </div>
  </article>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

    deployFile(`leetcode-potd/${slug}/index.html`, challengeHtml);
  });

  // Sort challenges descending
  potdChallenges.sort((a, b) => new Date(b.date) - new Date(a.date));

  // LeetCode POTD main listing page
  const leetcodePotdHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LeetCode POTD | Mukesh Pal - Daily Coding Challenges & Explanations</title>
  <meta name="description" content="Daily coding challenge questions from LeetCode solved with full conceptual explanations, complexity analysis, and verified Java / JavaScript solutions." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mukprabhakar.in/leetcode-potd" />
  
  <meta property="og:title" content="LeetCode POTD | Mukesh Pal - Daily Coding Challenges & Explanations" />
  <meta property="og:description" content="Daily coding challenge questions from LeetCode solved with full conceptual explanations, complexity analysis, and verified Java / JavaScript solutions." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mukprabhakar.in/leetcode-potd" />
  
  <!-- SPA redirect decoder for GitHub Pages -->
  <script>window.location.href = '/?/leetcode-potd';</script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #000000;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    a { color: #10b981; text-decoration: underline; }
  </style>
</head>
<body>
  <header style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem; border-bottom: 1px solid #27272a;">
    <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">LeetCode POTD Solutions</h1>
    <p style="color: #a1a1aa; margin-top: 0;">Daily Problem of the Day breakdowns, dry runs, and verified Java / JavaScript implementations.</p>
    <p><a href="/">← Back to Portfolio Home</a></p>
  </header>

  <main style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
    <section>
      ${potdChallenges.map(c => `
        <article style="margin-bottom: 2rem; border-bottom: 1px solid #27272a; padding-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;"><a href="/leetcode-potd/${c.slug}">${escapeHtml(c.title)}</a></h2>
          <p style="color: #a1a1aa; font-size: 0.9rem; margin-top: 0;">Difficulty: <strong>${escapeHtml(c.difficulty)}</strong> | Date: <strong>${c.date}</strong></p>
          <p style="color: #d4d4d8; line-height: 1.6;">${escapeHtml(c.excerpt)}</p>
          <p><a href="/leetcode-potd/${c.slug}">View Solution & Dry Run →</a></p>
        </article>
      `).join('')}
    </section>
  </main>

  <footer style="max-width: 800px; margin: 4rem auto 0; padding: 2rem 1rem; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 0.9rem;">
    <p>&copy; 2026 Mukesh Pal. All rights reserved. Full-Stack Developer & Co-Founder at CodeByte.</p>
  </footer>
</body>
</html>`;

  deployFile('leetcode-potd/index.html', leetcodePotdHtml);
}

// ==========================================
// 11. Auto-generate Comprehensive sitemap.xml
// ==========================================
const sitemapPages = [
  { url: 'https://mukprabhakar.in/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-09-17' },
  { url: 'https://mukprabhakar.in/blog', priority: '0.9', changefreq: 'daily', lastmod: '2026-09-17' },
  { url: 'https://mukprabhakar.in/all-projects', priority: '0.8', changefreq: 'monthly', lastmod: '2026-09-17' },
  { url: 'https://mukprabhakar.in/gallery', priority: '0.7', changefreq: 'monthly', lastmod: '2026-09-17' },
  { url: 'https://mukprabhakar.in/badges', priority: '0.7', changefreq: 'monthly', lastmod: '2026-09-17' },
  { url: 'https://mukprabhakar.in/github', priority: '0.7', changefreq: 'weekly', lastmod: '2026-09-17' },
  { url: 'https://mukprabhakar.in/coding', priority: '0.7', changefreq: 'weekly', lastmod: '2026-09-17' },
  { url: 'https://mukprabhakar.in/clients', priority: '0.7', changefreq: 'monthly', lastmod: '2026-09-17' },
  { url: 'https://mukprabhakar.in/products', priority: '0.8', changefreq: 'monthly', lastmod: '2026-09-17' },
  { url: 'https://mukprabhakar.in/leetcode-potd', priority: '0.8', changefreq: 'daily', lastmod: '2026-09-17' }
];

posts.forEach(p => {
  sitemapPages.push({
    url: `https://mukprabhakar.in/blog/${p.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: p.date || '2026-09-17'
  });
});

potdChallenges.forEach(c => {
  sitemapPages.push({
    url: `https://mukprabhakar.in/leetcode-potd/${c.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: c.date || '2026-09-17'
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${sitemapPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

deployFile('sitemap.xml', sitemapXml);

console.log('✓ Prerendering completed successfully.');
