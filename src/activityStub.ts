import { ActivityOptions, proxyActivities, UntypedActivities } from '@temporalio/workflow';
import { ActivityInterfaceFor } from '@temporalio/workflow';

import { UnretriableError } from './errors';

export function newActivityStub<A = UntypedActivities>(
  options: ActivityOptions = defaultActivityOptions,
): ActivityInterfaceFor<A> {
  return proxyActivities<A>(options);
}

/**
 * Maximum duration of single activity execution is 5 seconds.
 * In case of error
 * - If it's a retriable error, it will retry every 1 second indefinitely.
 * - If it's a non-retriable error, it will fail immediately.
 */
export const defaultActivityOptions: ActivityOptions = {
  startToCloseTimeout: '5 seconds',
  retry: {
    initialInterval: '1 seconds',
    backoffCoefficient: 1,
    nonRetryableErrorTypes: [UnretriableError.name],
  },
};

/**
 * Maximum duration of single activity execution is 1 second.
 * Retry every 12 seconds with flat interval.
 */
export const paymentReminderActivityOptions: ActivityOptions = {
  startToCloseTimeout: '1 seconds',
  retry: {
    initialInterval: '12 seconds',
    backoffCoefficient: 1,
  },
};

/**
 * Maximum duration of single activity execution is 10 seconds.
 * In case of error
 * - If it's a retriable error, it will retry with backoff mechanism such that the interval between retries is (in seconds): 1, 2, 4, 8, 16, 32, 60
 * - If it's a non-retriable error, it will fail immediately.
 */
export const externalApiCallActivityOptions: ActivityOptions = {
  startToCloseTimeout: '10 seconds',
  retry: {
    initialInterval: '1 seconds',
    maximumInterval: '1 minutes',
    nonRetryableErrorTypes: [UnretriableError.name],
  },
};
