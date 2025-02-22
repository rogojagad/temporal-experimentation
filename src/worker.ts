import { LogLevel, LogMetadata, Runtime, Worker } from '@temporalio/worker';
import * as activities from './activities';
import logger from './logger';

async function setupWorker(): Promise<Worker> {
  Runtime.install({
    logger: {
      log: (_level: LogLevel, message: string, _meta?: LogMetadata | undefined) => {
        logger.info(message);
      },
      trace: (message: string) => {
        logger.info(message);
      },
      debug: (message: string) => {
        logger.info(message);
      },
      info: (message: string) => {
        logger.info(message);
      },
      warn: (message: string) => {
        logger.warn(message);
      },
      error: (message: string) => {
        logger.error(message);
      },
    },
  });

  const worker = await Worker.create({
    workflowsPath: '/Users/rogo/Documents/personal/temporal-experimentation/src/workflows.ts',
    reuseV8Context: true,
    taskQueue: 'default',
    namespace: 'default',
    activities,
  });

  return worker;
}

export default setupWorker;
