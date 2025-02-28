import { externalApiCallActivityOptions, newActivityStub } from '../activityStub';
import { IPaymentMadeSignalPayload, ITicketOrderParams, ITicketOrderResult } from './interfaces';
import type ticketOrderActivities from './orderActivities';
import { defineSignal, ParentClosePolicy, sleep, startChild } from '@temporalio/workflow/lib';
import { createTriggerFromSignal } from '../trigger';
import { TicketOrderStatus } from './enums';
import { remindUserToPay } from './reminderWorkflow';

const { acquireStock, releaseStock, createOrder, updateOrderStatus } =
  newActivityStub<typeof ticketOrderActivities>();

const { createPaymentRequest, sendOrderReceipt } = newActivityStub<typeof ticketOrderActivities>(
  externalApiCallActivityOptions,
);

const paymentMadeSignal = defineSignal<[IPaymentMadeSignalPayload]>('paymentMade');

async function makeTicketOrder(params: ITicketOrderParams): Promise<ITicketOrderResult> {
  await acquireStock(params);

  await createOrder(params);

  await createPaymentRequest(params);

  /**
   * Waits for either payment confirmation or order expiration, whichever comes first.
   * Uses Promise.race to handle two competing conditions:
   * 1. Payment Signal: Waits for payment confirmation through paymentMadeSignal
   * 2. Timeout: Waits for 60 seconds before considering the order expired
   *
   * @returns {Promise<unknown>}
   * - If payment is made before timeout: Returns the payment result
   * - If timeout occurs first: Returns undefined, indicating order expiration
   */
  const orderPaymentResult = await Promise.race([
    createTriggerFromSignal(paymentMadeSignal),
    sleep(60_000),
  ]);

  if (orderPaymentResult) {
    const orderResult = await updateOrderStatus(params.orderId, TicketOrderStatus.SUCCEED);

    await sendOrderReceipt(params, orderResult);

    return orderResult;
  }

  const orderResult = await updateOrderStatus(params.orderId, TicketOrderStatus.EXPIRED);

  await releaseStock(params);

  return orderResult;
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
    parentClosePolicy: ParentClosePolicy.TERMINATE, // <- when this workflow is closed (Completed, Terminated, Cancelled), the child workflow should be terminated as well
  });

  /**
   * Waits for either payment confirmation or order expiration, whichever comes first.
   * Uses Promise.race to handle two competing conditions:
   * 1. Payment Signal: Waits for payment confirmation through paymentMadeSignal
   * 2. Timeout: Waits for 60 seconds before considering the order expired
   * */
  const orderPaymentResult = await Promise.race([
    createTriggerFromSignal(paymentMadeSignal),
    sleep(60_000),
  ]);

  if (orderPaymentResult) {
    const orderResult = await updateOrderStatus(params.orderId, TicketOrderStatus.SUCCEED);

    await sendOrderReceipt(params, orderResult);

    return orderResult;
  }

  const orderResult = await updateOrderStatus(params.orderId, TicketOrderStatus.EXPIRED);

  await releaseStock(params);

  return orderResult;
}

export { makeTicketOrder, makeTicketOrderWithConstantReminder, paymentMadeSignal };
