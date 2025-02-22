import { TicketOrderStatus } from './enums';
import { IOrderDetail, ITicketOrderParams, ITicketOrderResult } from './interfaces';

const acquireStock = async (orderParams: ITicketOrderParams): Promise<IOrderDetail[]> => {
  /**
   * Execute a DB query or API call to decrement stock of the ticket category
   * For simplicity sake, mock the process using Promise.
   */
  return new Promise((resolve) => setTimeout(() => resolve(orderParams.details), 50));
};

const createOrder = async (
  orderParams: ITicketOrderParams,
): Promise<{ orderId: string; status: TicketOrderStatus }> => {
  /**
   * Execute a DB query or API call to create a new order
   * For example's simplicity sake, mock the process using Promise.
   */
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ orderId: orderParams.orderId, status: TicketOrderStatus.PENDING }),
      50,
    ),
  );
};

const createPaymentRequest = async (
  orderParams: ITicketOrderParams,
): Promise<{ paymentRequestId: string }> => {
  /**
   * Execute a DB query or API call to create a new order
   * For example's simplicity sake, mock the process using Promise.
   */
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({ paymentRequestId: `PAYMENT-${orderParams.orderId}` });
    }, 50),
  );
};

const updateOrderStatus = async (
  orderId: string,
  status: TicketOrderStatus,
): Promise<ITicketOrderResult> => {
  /**
   * Execute a DB query or API call to create a new order
   * For example's simplicity sake, mock the process using Promise.
   */

  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({ orderId, orderStatus: status });
    }, 50),
  );
};

export default {
  acquireStock,
  createOrder,
  createPaymentRequest,
  updateOrderStatus,
};
