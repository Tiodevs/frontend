"use client"

import { toast } from 'sonner'
import styles from './styles.module.scss'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import {useRouter} from 'next/navigation'

import { finalizeOrder } from '@/app/actions/finalizeOrder';


export async function Orders({ orders, itens }: any) {

  const router = useRouter();

  const [loading, setLoading] = useState<string | null>(null);


  console.log("Mesas:", orders)
  console.log("Pedidos:", itens)

  // Função para chamar a action do servidor
  function handleFinishOrder(orderId: string) {
    setLoading(orderId); // Marca o pedido como em processo de finalização

    try {
      finalizeOrder(orderId); // Chama a função no servidor
      toast.success("Mesa finalizada com sucesso!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao finalizar a mesa.");
    } finally {
      setLoading(null); // Reseta o estado de loading
    }
  }

  function handleRefresh(){
    router.refresh();
    toast.success("Pedidos atualizados com sucesso!")
  }


  return (
    <main className={styles.container}>

      <section className={styles.containerHeader}>
        <h1>Últimos pedidos</h1>
        <button onClick={handleRefresh}>
          <RefreshCw size={24} color="#3fffa3" />
        </button>
      </section>

      <section className={styles.listOrders}>
        {orders.map((order: any, orderIndex: any) => (
          <div className={styles.orderItem} key={orderIndex}>
            <span>Número da mesa: {order.table}</span>
            {order.name && <span>Descrição: {order.name}</span>}

            <br/>
            <br/>
            <span>Pedidos:</span>

            {/* Filtra os itens correspondentes a essa mesa específica */}
            {itens[0]
              .filter((item: any) => item.order_id === order.id)
              .map((item: any, itemIndex: number) => (
                <span key={itemIndex}>
                  {item.product?.name} - Quantidade: {item.amount}
                </span>
              ))}


            <button
              className={styles.btn}
              onClick={() => handleFinishOrder(order.id)} // Finalizar mesa ao clicar
              disabled={loading === order.id} // Desabilitar enquanto está processando
            >
              {loading === order.id ? "Finalizando..." : "Finalizar mesa"}
            </button>
          </div>
        ))}
      </section>

    </main>
  )
}