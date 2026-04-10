import fs from 'fs';
import path from 'path';

const frPath = 'c:/Users/fares/Desktop/amouris/i18n/fr.json';
const arPath = 'c:/Users/fares/Desktop/amouris/i18n/ar.json';

const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], newPrefix));
    } else {
      keys.push(newPrefix);
    }
  }
  return keys;
}

const frKeys = new Set(getKeys(fr));
const arKeys = new Set(getKeys(ar));

console.log('Keys in fr.json but not in ar.json:');
frKeys.forEach(k => { if (!arKeys.has(k)) console.log(`  ${k}`); });

console.log('Keys in ar.json but not in fr.json:');
arKeys.forEach(k => { if (!frKeys.has(k)) console.log(`  ${k}`); });

function findTCalls(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        findTCalls(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.matchAll(/t\(['"]([^'"]+)['"]\)/g);
      for (const match of matches) {
        const key = match[1];
        if (!frKeys.has(key) || !arKeys.has(key)) {
          console.log(`Missing key: ${key} in ${fullPath}`);
          if (!frKeys.has(key)) console.log(`  -> missing in fr.json`);
          if (!arKeys.has(key)) console.log(`  -> missing in ar.json`);
        }
      }
    }
  }
}

console.log('\nChecking for missing keys in components and app...');
findTCalls('c:/Users/fares/Desktop/amouris/app');
findTCalls('c:/Users/fares/Desktop/amouris/components');
