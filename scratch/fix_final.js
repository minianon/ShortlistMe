const fs = require('fs');
const path = 'd:/Personal/Project/ShortlistMe/src/app/dashboard/portfolio/page.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');

// 1. Fix line 427 (index 426) - add the missing }
if (lines[426].trim() === ')') {
    lines[426] = lines[426].replace(')', ')}');
    console.log('Fixed line 427');
} else {
    console.log('Line 427 mismatch:', lines[426]);
}

fs.writeFileSync(path, lines.join('\n'));
