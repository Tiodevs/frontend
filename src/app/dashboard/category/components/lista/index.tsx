"use client"

import { api } from '@/app/services/api'
import styles from './styles.module.scss'
import { getCookiesClient } from '@/lib/cookieClient'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

interface CategoryProps {
    name: string
    data: any
}

interface Props {
    categories: CategoryProps[]
}

export default function ListCategory({ categories }: Props) {


    async function handleRemoveProduct(produto: any) {
        console.log(produto)

        const token = getCookiesClient()

        await api.delete("/categories/products", {
            params: {
                product_id: produto
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .catch((err)=>{
            console.log(err)
            toast.warning("Item não foi deletado")
            return
        })

        toast.success("Item deletado com sucesso");

        setTimeout(() => {
            window.location.reload();
        }, 2000); // Recarrega a página após 2 segundos
    }

    return (
        <div>
            <h1 className={styles.titulo}>Categorias cadastradas:</h1>
            {categories.map((categories, index) => (
                <div key={categories.name + index} className={styles.campo}>
                    <h2>{categories.name}</h2>
                    {/* <button>Deletar categoria</button> */}

                    <ul>
                        {categories.data.length > 0 ? (
                            categories.data.map((order: { id: string; name: string }) => (
                                <div>
                                    <li key={order.id}>{order.name}</li>
                                    <button className={styles.btn} onClick={() => handleRemoveProduct(order.id)}>
                                        <Trash size={30} color="#FFF" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <li>Nenhum pedido encontrado</li>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    )
}