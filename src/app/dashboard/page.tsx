import { getCookiesServer } from "@/lib/cookieServer";
import { Orders } from "./components/orders";
import { api } from "../services/api";
import { OrderProps } from '@/lib/order.type'

async function getOrders(): Promise<OrderProps[] | []> {
    try {
        const token = getCookiesServer();

        const response = await api.get("/orders", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data || []

    } catch (err) {
        console.log(err);
        return [];
    }
}

async function getItens(item: any) {
    const token = getCookiesServer();
  
    const response = await api.get("/orders/details", {
      params: {
        category_id: item.id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data || [];
  }


export default async function Deshboard() {

    const orders = await getOrders();

    const itens = await Promise.all(orders.map((order: any) => getItens(order)));

    return (
        <div>
            <Orders orders={orders} itens={itens}/>
        </div>
    )
}