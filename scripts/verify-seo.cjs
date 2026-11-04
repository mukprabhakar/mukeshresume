const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getFiles(path.join(__dirname, '../dist'));
console.log('Total HTML files to verify in dist:', htmlFiles.length);

let errors = 0;
const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const relPath = path.relative(path.join(__dirname, '../dist'), file).replace(/\\/g, '/');
  if (relPath === '404.html') continue;

  const content = fs.readFileSync(file, 'utf8');

  // 1. Count H1 tags
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length !== 1) {
    console.error(`[H1 ERROR] ${relPath}: found ${h1Matches.length} <h1> tags`);
    errors++;
  }

  // 2. Check Canonical
  const canonicalMatch = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                         content.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (!canonicalMatch) {
    console.error(`[CANONICAL ERROR] ${relPath}: missing canonical tag`);
    errors++;
  } else {
    const canonical = canonicalMatch[1];
    let expectedSlug = relPath.replace(/\/index\.html$/, '').replace(/^index\.html$/, '');
    let expectedCanonical = 'https://mukprabhakar.in' + (expectedSlug ? '/' + expectedSlug : '/');
    if (canonical !== expectedCanonical) {
      console.error(`[CANONICAL MISMATCH] ${relPath}: canonical is "${canonical}", expected "${expectedCanonical}"`);
      errors++;
    }
  }

  // 3. Check Title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    if (titles.has(title)) {
      console.warn(`[DUPLICATE TITLE] ${relPath} shares title with ${titles.get(title)}: "${title}"`);
      errors++;
    } else {
      titles.set(title, relPath);
    }
  } else {
    console.error(`[MISSING TITLE] ${relPath}`);
    errors++;
  }

  // 4. Check Meta Description
  const descMatch = content.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                    content.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  if (descMatch) {
    const desc = descMatch[1].trim();
    if (descriptions.has(desc)) {
      console.warn(`[DUPLICATE DESC] ${relPath} shares description with ${descriptions.get(desc)}: "${desc.slice(0, 40)}..."`);
      errors++;
    } else {
      descriptions.set(desc, relPath);
    }
  } else {
    console.error(`[MISSING DESC] ${relPath}`);
    errors++;
  }
}

if (errors === 0) {
  console.log(`\n🎉 PERFECT AUDIT! All ${htmlFiles.length} HTML files verified:`);
  console.log(' - Exactly 1 <h1> tag per document');
  console.log(' - 100% Valid self-referencing canonical links (https://mukprabhakar.in/...)');
  console.log(' - Unique document <title> tags');
  console.log(' - Unique <meta name="description"> tags');
} else {
  console.log(`\nVerification finished with ${errors} issues found.`);
}
