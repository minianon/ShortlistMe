const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds
  { regex: /\bbg-white\b/g, replace: "bg-background" },
  { regex: /\bborder-white\b/g, replace: "border-background" },
  { regex: /\bbg-gray-50\b/g, replace: "bg-background-secondary" },
  { regex: /\bbg-gray-100(\/\d+)?\b/g, replace: "bg-background-tertiary$1" },
  { regex: /\bbg-gray-800\b/g, replace: "bg-text" },
  { regex: /\bbg-gray-900\b/g, replace: "bg-text" },

  // Hover backgrounds
  { regex: /\bhover:bg-gray-50\b/g, replace: "hover:bg-background-secondary" },
  { regex: /\bhover:bg-gray-100\b/g, replace: "hover:bg-background-tertiary" },

  // Text
  { regex: /\btext-gray-900\b/g, replace: "text-text" },
  { regex: /\btext-gray-800\b/g, replace: "text-text" },
  { regex: /\btext-gray-700\b/g, replace: "text-text" },
  { regex: /\btext-gray-600\b/g, replace: "text-text-secondary" },
  { regex: /\btext-gray-500\b/g, replace: "text-text-secondary" },
  { regex: /\btext-gray-400\b/g, replace: "text-text-muted" },
  { regex: /\btext-gray-300\b/g, replace: "text-text-muted" },

  // Placeholder
  { regex: /\bplaceholder-gray-400\b/g, replace: "placeholder-text-muted" },
  { regex: /\bplaceholder-gray-500\b/g, replace: "placeholder-text-secondary" },

  // Focus
  { regex: /\bfocus:bg-white\b/g, replace: "focus:bg-background" },

  // Borders
  { regex: /\bborder-gray-200(\/\d+)?\b/g, replace: "border-border-strong$1" },
  { regex: /\bborder-gray-300(\/\d+)?\b/g, replace: "border-border-strong$1" },
  { regex: /\bborder-gray-100(\/\d+)?\b/g, replace: "border-border$1" },
  { regex: /\bfocus:ring-indigo-\d+(\/\d+)?\b/g, replace: "focus:ring-primary$1" },
  
  // Rings
  { regex: /\bring-gray-200\b/g, replace: "ring-border-strong" },
  { regex: /\bring-gray-[13]00\b/g, replace: "ring-border" }
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
  console.log("Secondary phase migration complete.");
} catch (e) {
  console.error("Error:", e);
}
