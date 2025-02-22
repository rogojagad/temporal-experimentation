import { log } from '@temporalio/activity/lib';

const checkAndRemindUserToPay = async (
  orderId: string,
): Promise<{ orderId: string; isPaid: boolean }> => {
  const isPaid = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(false);
    }, 50);
  });

  if (isPaid) return { orderId, isPaid: true };

  log.info(`Order ${orderId} is not paid, reminding user`);
  throw 'Order is not paid';
};

export default {
  checkAndRemindUserToPay,
};
