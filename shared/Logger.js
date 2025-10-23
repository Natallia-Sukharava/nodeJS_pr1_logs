import fs from 'fs';
import path from 'path';

export class Logger {
  constructor(filePath) {
    this.setFile(filePath);
  }

  setFile(filePath) {
    if (this.stream) this.stream.end();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    this.stream = fs.createWriteStream(filePath, { flags: 'a' });
  }

  _write(level, msg) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const line = `[${timestamp}] [${level.toUpperCase()}] ${msg}\n`;
    this.stream.write(line);
  }

  info(msg) {
    this._write('info', msg);
  }

  success(msg) {
    this._write('success', msg);
  }

  error(msg) {
    this._write('error', msg);
  }

  close() {
    if (this.stream) this.stream.end();
  }
}

export function parseLogLine(line) {
  const match = line.match(/^\[(.+?)\]\s+\[(.+?)\]\s+(.*)$/);
  if (!match) return null;
  return {
    timestamp: match[1],
    level: match[2].toLowerCase(),
    message: match[3],
  };
}
