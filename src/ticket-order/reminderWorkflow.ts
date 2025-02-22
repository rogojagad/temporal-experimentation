import { newActivityStub, paymentReminderActivityOptions } from './../activityStub';
import type reminderActivities from './reminderActivities';

export interface IRemindUserToPayParams {
  orderId: string;
}

const { checkAndRemindUserToPay } = newActivityStub<typeof reminderActivities>(
  paymentReminderActivityOptions,
);

async function remindUserToPay(params: IRemindUserToPayParams) {
  await checkAndRemindUserToPay(params.orderId);
}

export { remindUserToPay };
