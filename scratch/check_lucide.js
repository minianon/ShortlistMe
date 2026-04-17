const lucide = require('lucide-react');
const brands = ['twitter', 'linkedin', 'github', 'x', 'twitter', 'link'];
const found = Object.keys(lucide).filter(k => brands.some(b => k.toLowerCase().includes(b)));
console.log('Found icons:', found);
