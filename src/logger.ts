function info(message: string) {
  console.info(`\x1b[34m[${new Date().toISOString()}] | ${message}\x1b[0m`);
}

function warn(message: string) {
  console.warn(`\x1b[33m[${new Date().toISOString()}] | ${message}\x1b[0m`);
}

function error(message: string) {
  console.error(`\x1b[31m[${new Date().toISOString()}] | ${message}\x1b[0m`);
}

export default { info, warn, error };
