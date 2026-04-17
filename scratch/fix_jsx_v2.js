const fs = require('fs');
const path = 'd:/Personal/Project/ShortlistMe/src/app/dashboard/portfolio/page.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');

// 1. Remove the redundant brace at line 391 (index 390)
if (lines[390].includes('{isCloudinaryConfigured ? (')) {
    lines[390] = lines[390].replace('{isCloudinaryConfigured ? (', 'isCloudinaryConfigured ? (');
    // We also need to fix the indentation to match the file
    lines[390] = '                                       isCloudinaryConfigured ? (';
}

// 2. Remove the redundant closing brace at line 427 (index 426)
if (lines[426].trim() === ')}') {
    lines[426] = lines[426].replace(')}', ')');
}

// 3. Ensure line 788 remains fixed
if (lines[787].includes('isCloudinaryConfigured ? (') && !lines[787].includes('{isCloudinaryConfigured')) {
    lines[787] = lines[787].replace('isCloudinaryConfigured ? (', '{isCloudinaryConfigured ? (');
}

// 4. Ensure line 835 remains fixed
if (lines[834].trim() === ')') {
    lines[834] = lines[834].replace(')', ')}');
}

fs.writeFileSync(path, lines.join('\n'));
console.log('Fixed profile photo ternary and maintained project ternary fix');
