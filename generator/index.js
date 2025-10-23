import path from 'path';
import { fileURLToPath } from 'url';
import { Logger } from '../shared/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_ROOT = path.join(__dirname, '..', 'logs');

function folderStamp(d = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

function fileStamp(d = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

let currentFolder = folderStamp();
let currentFileTime = new Date();
let logger = new Logger(path.join(LOG_ROOT, currentFolder, `log-${fileStamp()}.txt`));

function rotateFolderIfNeeded() {
  const newFolder = folderStamp();
  if (newFolder !== currentFolder) {
    currentFolder = newFolder;
    currentFileTime = new Date();
    logger.setFile(path.join(LOG_ROOT, currentFolder, `log-${fileStamp()}.txt`));
    console.log(` Created new folder: ${currentFolder}`);
  }
}

function rotateFileIfNeeded() {
  const now = new Date();
  if ((now - currentFileTime) >= 10_000) {
    currentFileTime = now;
    logger.setFile(path.join(LOG_ROOT, currentFolder, `log-${fileStamp()}.txt`));
    console.log(`Created new file in folder ${currentFolder}`);
  }
}

function randomLog() {
  const r = Math.random();
  if (r < 0.7) logger.info('heartbeat');
  else if (r < 0.9) logger.success('operation completed');
  else logger.error('operation failed');
}

const writeInterval = setInterval(() => {
  try {
    rotateFolderIfNeeded();
    rotateFileIfNeeded();
    randomLog();
  } catch (err) {
    console.error('Generator error:', err);
  }
}, 1000);

process.on('SIGINT', () => {
  clearInterval(writeInterval);
  logger.close();
  console.log('\nLog Generator stopped.');
  process.exit(0);
});
