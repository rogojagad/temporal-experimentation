import { setHandler, SignalDefinition, Trigger } from '@temporalio/workflow/lib';

const createTriggerFromSignal = async <T>(signal: SignalDefinition<[T]>): Promise<T> => {
  const trigger = new Trigger<T>();

  setHandler(signal, (payload: T) => {
    trigger.resolve(payload);
  });

  return trigger;
};

export { createTriggerFromSignal };
