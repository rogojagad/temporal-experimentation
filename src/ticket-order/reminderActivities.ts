import { log } from '@temporalio/activity/lib';

/**
 * This activity will run indefinitely until
 * - The `reminderWorkflow` is terminated due to `ticketOrderWorkflow` is completed (either by order is paid or expired)
 * - Order is paid hence the Promise resolves
 *
 * @param orderId
 * @returns
 */
const checkAndRemindUserToPay = async (
  orderId: string,
): Promise<{ orderId: string; isPaid: boolean }> => {
  const isPaid = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(false); // <- simulate order status inquiry, in real case, this will be either an API call or DB query, the example will resolve to false to simulate the reminder
    }, 50);
  });

  if (isPaid) return { orderId, isPaid: true };

  log.info(
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(`Order ${orderId} is not paid, reminding user`); // <- simulate reminder
      }, 1000),
    ),
  );

  throw 'Order is not paid';
};

export default {
  checkAndRemindUserToPay,
};
