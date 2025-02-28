import { newActivityStub, paymentReminderActivityOptions } from './../activityStub';
import type reminderActivities from './reminderActivities';

export interface IRemindUserToPayParams {
  orderId: string;
}

const { checkAndRemindUserToPay } = newActivityStub<typeof reminderActivities>(
  paymentReminderActivityOptions,
);

/**
 * This workflow is for handling payment reminders for a ticket order.
 * If the order is not yet paid, `checkAndRemindUserToPay` will throw to simulate reminder.
 *
 * @param params
 */
async function remindUserToPay(params: IRemindUserToPayParams) {
  await checkAndRemindUserToPay(params.orderId);
}

export { remindUserToPay };
