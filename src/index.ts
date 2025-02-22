import { type Context, Hono } from 'hono';

import { serve } from '@hono/node-server';
import { getClient } from './client';
import { IPaymentMadeSignalPayload, ITicketOrderParams } from './ticket-order/interfaces';
import {
  makeTicketOrder,
  makeTicketOrderWithConstantReminder,
} from './ticket-order/ticketOrderWorkflow';
import dayjs from 'dayjs';
import setupWorker from './worker';

const app = new Hono();

app.post('/order', async (c: Context) => {
  const body = await c.req.json();
  const orderId = crypto.randomUUID();

  const workflowParams: ITicketOrderParams = {
    ...body,
    orderId,
    orderTimestamp: body.orderTimestamp || new Date(),
  };

  (await getClient()).workflow.start(makeTicketOrder, {
    taskQueue: 'default',
    workflowId: `order-${orderId}`,
    args: [workflowParams],
  });

  return c.json({ orderId });
});

app.post('/order/:id/payment', async (c: Context) => {
  const orderId = c.req.param('id');

  const client = await getClient();
  const workflow = client.workflow.getHandle(`order-${orderId}`);
  const transactionId = crypto.randomUUID();

  await workflow.signal<[IPaymentMadeSignalPayload]>(`paymentMade`, {
    transactionId,
    createdAt: dayjs().toISOString(),
  });

  return c.json({ transactionId });
});

// V2
app.post('/v2/order', async (c: Context) => {
  const body = await c.req.json();
  const orderId = crypto.randomUUID();

  const workflowParams: ITicketOrderParams = {
    ...body,
    orderId,
    orderTimestamp: body.orderTimestamp || new Date(),
  };

  (await getClient()).workflow.start(makeTicketOrderWithConstantReminder, {
    taskQueue: 'default',
    workflowId: `order-${orderId}`,
    args: [workflowParams],
  });

  return c.json({ orderId });
});

setupWorker().then((worker) => {
  worker.run();
});

serve({ fetch: app.fetch, port: 8080 });
