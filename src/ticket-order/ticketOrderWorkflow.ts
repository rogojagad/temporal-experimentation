import { newActivityStub } from '../activityStub';
import { IPaymentMadeSignalPayload, ITicketOrderParams, ITicketOrderResult } from './interfaces';
import type ticketOrderActivities from './orderActivities';
import { defineSignal, ParentClosePolicy, sleep, startChild } from '@temporalio/workflow/lib';
import { createTriggerFromSignal } from '../trigger';
import { TicketOrderStatus } from './enums';
import { remindUserToPay } from './reminderWorkflow';

const { acquireStock, createOrder, createPaymentRequest, updateOrderStatus } =
  newActivityStub<typeof ticketOrderActivities>();

const paymentMadeSignal = defineSignal<[IPaymentMadeSignalPayload]>('paymentMade');

async function makeTicketOrder(params: ITicketOrderParams): Promise<ITicketOrderResult> {
  await acquireStock(params);

  await createOrder(params);

  await createPaymentRequest(params);

  /**
   * Will block in this line until either:
   * - payment is made (trigger is resolved to `orderPaymentResult`), or
   * - order is expired (sleep function resolves to `undefined` after 5 minutes)
   * */
  const orderPaymentResult = await Promise.race([
    createTriggerFromSignal(paymentMadeSignal),
    sleep(60_000),
  ]);

  return await updateOrderStatus(
    params.orderId,
    orderPaymentResult ? TicketOrderStatus.SUCCEED : TicketOrderStatus.EXPIRED,
  );
}

async function makeTicketOrderWithConstantReminder(
  params: ITicketOrderParams,
): Promise<ITicketOrderResult> {
  await acquireStock(params);

  await createOrder(params);

  await createPaymentRequest(params);

  // Start a new workflow to remind the user to pay
  await startChild(remindUserToPay, {
    args: [{ orderId: params.orderId }],
    workflowId: `payment-reminder-${params.orderId}`,
    parentClosePolicy: ParentClosePolicy.TERMINATE,
  });

  const orderPaymentResult = await Promise.race([
    createTriggerFromSignal(paymentMadeSignal),
    sleep(60_000),
  ]);

  return await updateOrderStatus(
    params.orderId,
    orderPaymentResult ? TicketOrderStatus.SUCCEED : TicketOrderStatus.EXPIRED,
  );
}

export { makeTicketOrder, makeTicketOrderWithConstantReminder, paymentMadeSignal };
