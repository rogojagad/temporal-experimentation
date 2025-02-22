import { TicketCategory, TicketOrderStatus } from './enums';

export interface ITicketOrderParams {
  orderId: string;
  details: IOrderDetail[];
  numberOfTickets: number;
  totalPrice: number;
  customerName: string;
  customerIdNumber: string;
  customerEmail: string;
  orderTimestamp: Date;
}

export interface IOrderDetail {
  category: TicketCategory;
  numberOfTickets: number;
  pricePerTicket: number;
  totalPrice: number;
}

export interface ITicketOrderResult {
  orderId: string;
  orderStatus: TicketOrderStatus;
}

export interface IPaymentMadeSignalPayload {
  transactionId: string;
  createdAt: string;
}
