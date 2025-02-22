import { Client, Connection } from '@temporalio/client';

export const getClient = async (): Promise<Client> => {
  return new Client({
    connection: await Connection.connect({ address: 'localhost:7233' }),
    namespace: 'default',
  });
};
