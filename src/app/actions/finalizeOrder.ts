// app/actions/finalizeOrder.ts

'use server';

import { api } from '@/app/services/api'; // Supondo que você esteja usando o Axios aqui
import { getCookiesServer } from '@/lib/cookieServer';

export async function finalizeOrder(orderId: string) {
  const token = getCookiesServer();

  try {
    const response = await api.put('/orders/finish', {
      order_id: orderId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error('Erro ao finalizar a mesa', err);
    throw new Error('Erro ao finalizar a mesa');
  }
}
