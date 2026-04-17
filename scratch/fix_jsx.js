const fs = require('fs');
const path = 'd:/Personal/Project/ShortlistMe/src/app/dashboard/portfolio/page.tsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Fix opening brace at line 788 (if not already fixed correctly)
if (lines[787].includes('isCloudinaryConfigured ? (') && !lines[787].includes('{isCloudinaryConfigured')) {
    lines[787] = lines[787].replace('isCloudinaryConfigured ? (', '{isCloudinaryConfigured ? (');
}

// Fix closing brace at line 835
if (lines[834].trim() === ')') {
    lines[834] = lines[834].replace(')', ')}');
}

fs.writeFileSync(path, lines.join('\n'));
console.log('Fixed lines 788 and 835');
