const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Primary
  { regex: /bg-\[#4f46e5\]/g, replace: "bg-primary" },
  { regex: /text-\[#4f46e5\]/g, replace: "text-primary" },
  { regex: /border-\[#4f46e5\](\/\d+)?/g, replace: "border-primary$1" },
  { regex: /shadow-indigo-500\/([0-2a-z]+)/g, replace: "shadow-primary/$1" },
  { regex: /selection:bg-\[#4f46e5\]/g, replace: "selection:bg-primary" },

  // Primary Hover/Dark
  { regex: /hover:bg-\[#4338ca\]/g, replace: "hover:bg-primary-dark" },
  { regex: /hover:border-\[#4f46e5\](\/\d+)?/g, replace: "hover:border-primary-dark$1" },
  
  // Muted/Light primary (indigo-50 equivalents)
  { regex: /bg-\[#eef2ff\]/g, replace: "bg-primary-light" },
  { regex: /bg-indigo-50/g, replace: "bg-primary-light" },
  { regex: /bg-indigo-100/g, replace: "bg-primary-light" },
  { regex: /text-indigo-500/g, replace: "text-primary" },
  { regex: /text-indigo-[67]00/g, replace: "text-primary-dark" },
  { regex: /text-indigo-200/g, replace: "text-primary-light" },
  { regex: /border-indigo-100/g, replace: "border-primary-light" },
  { regex: /border-indigo-200/g, replace: "border-primary-light" },
  
  // Backgrounds Secondary
  { regex: /bg-\[#f8f9fa\]/g, replace: "bg-background-secondary" },
  { regex: /bg-\[#f7f9fb\]/g, replace: "bg-background-secondary" },
  { regex: /bg-\[#fcfdff\]/g, replace: "bg-background-secondary" },
  
  // Text content
  { regex: /text-\[#191c1e\]/g, replace: "text-text" },
  { regex: /text-gray-900/g, replace: "text-text" },
  { regex: /text-gray-[56]00/g, replace: "text-text-secondary" },
  { regex: /text-gray-[34]00/g, replace: "text-text-muted" },
  
  // Borders
  { regex: /border-gray-100/g, replace: "border-border" },
  { regex: /border-gray-200/g, replace: "border-border-strong" },
  { regex: /border-gray-50/g, replace: "border-border" }
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
  console.log("Migration complete.");
} catch (e) {
  console.error("Error running script:", e);
}
