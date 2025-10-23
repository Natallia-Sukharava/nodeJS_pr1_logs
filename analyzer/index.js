import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseLogLine } from '../shared/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_ROOT = path.join(__dirname, '..', 'logs');

function readAllLogFiles(rootDir) {
  const files = [];
  if (!fs.existsSync(rootDir)) return files;

  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile() && p.endsWith('.txt')) files.push(p);
    }
  };
  walk(rootDir);
  return files;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--type' || args[i] === '-t') && args[i + 1]) {
      result.type = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      result.help = true;
    }
  }
  return result;
}

function printHelp() {
  console.log(`
Usage:
  node analyzer/index.js [--type <info|success|error>]

Options:
  -t, --type   Filter logs by type
  -h, --help   Show this help message

Examples:
  node analyzer/index.js
  node analyzer/index.js --type error
  node analyzer/index.js -t success
`);
}

async function main() {
  const { type, help } = parseArgs();
  if (help) return printHelp();

  const files = readAllLogFiles(LOG_ROOT);
  if (files.length === 0) {
    console.log('No logs found. Please run the generator first.');
    return;
  }

  const counters = { info: 0, success: 0, error: 0, total: 0 };

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    for (const line of content.split('\n')) {
      if (!line.trim()) continue;
      const rec = parseLogLine(line);
      if (!rec) continue;
      if (!type || rec.level === type) {
        counters[rec.level]++;
        counters.total++;
      }
    }
  }

  const header = type
    ? `Statistics by type: ${type.toUpperCase()}`
    : 'Statistics for all log types';
  console.log('\n' + header);
  console.log('─'.repeat(header.length));
  console.log(`Total entries: ${counters.total}`);
  console.log(`INFO:    ${counters.info}`);
  console.log(`SUCCESS: ${counters.success}`);
  console.log(`ERROR:   ${counters.error}\n`);
}

main().catch(err => {
  console.error('Analyzer error:', err);
  process.exit(1);
});