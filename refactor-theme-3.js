const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { regex: /\bbg-gray-200\b/g, replace: "bg-border-strong" },
  { regex: /\bbg-violet-50\b/g, replace: "bg-primary-light" },
  { regex: /\btext-violet-600\b/g, replace: "text-primary" },
  { regex: /\bbg-fuchsia-50\b/g, replace: "bg-primary-light" },
  { regex: /\btext-fuchsia-600\b/g, replace: "text-primary" },
  { regex: /\bfrom-indigo-600/g, replace: "from-primary" },
  { regex: /\bto-indigo-800/g, replace: "to-primary-dark" },
  { regex: /\bring-indigo-200\b/g, replace: "ring-primary-light" }
];

function processDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

try {
  processDir(srcDir);
  console.log("Tertiary phase migration complete.");
} catch (e) {
  console.error("Error:", e);
}
