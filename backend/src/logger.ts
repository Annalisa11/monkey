const format = (level: string, emoji: string, message: string) => {
  //   const timestamp = new Date().toISOString();
  return `${emoji} [${level}] ${message}`;
};

const logger = {
  info: (message: string) => {
    console.log(format('INFO', '🔷', message));
  },
  warn: (message: string) => {
    console.warn(format('WARN', '🔶', message));
  },
  error: (message: string) => {
    console.error(format('ERROR', '❌', message));
  },
  request: (req: import('express').Request) => {
    const reqLog = `--> [REQUEST] ${req.method} ${req.url} | params: ${JSON.stringify(req.params)} | body: ${JSON.stringify(req.body)}`;
    console.log(reqLog);
  },
};

export default logger;
