"use client"

import { ChangeEvent, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { Button } from '@/app/dashboard/components/button'
import { api } from '@/app/services/api'
import { getCookiesClient } from '@/lib/cookieClient'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'

import { Trash } from 'lucide-react'


interface CategoryProps {
  name: string
  data: any
}

interface Props {
  categories: CategoryProps[]
}


export function FormMesa({ categories }: Props) {

  // useStates
  const [orderId, setOrderId] = useState("")
  const [itensOrder, setItensOrder] = useState<any>([])
  const [selectedCategory, setSelectedCategory] = useState<number>(0)
  const [atualizarItens, setAtualizarItens] = useState<boolean>(false)

  // Sempre que mudar algo na lista de item ou a mesa criada ele atualiza
  useEffect(() => {
    const token = getCookiesClient();

    async function fetchItens() {
      try {
        const order: any = await api.get("/orders/details", {
          params: {
            order_id: orderId
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setItensOrder(order.data);
        // console.log(order.data); // Aqui você vê o resultado da API
      } catch (err) {
        console.log(err);
        toast.warning("Falha em cadastrar mesa!");
      }
    }

    fetchItens();
    console.log("Listinha: ", itensOrder)

  }, [orderId, atualizarItens]);



  // Função para criar mesa
  async function handleRegisterOrder(formData: FormData) {
    const name = Number(formData.get("name"))
    const descricao = formData.get("descricao")

    if (!name || !descricao) {
      console.log("Preencha todos os campos")
      toast.warning("Falha em cadastrar mesa! Preencha todos os campos.")
      return
    }

    const token = getCookiesClient()
    const order: any = await api.post("/orders", {
      table: name,
      name: descricao
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((err) => {
      console.log(err)
      toast.warning("Falha em cadastrar mesa!")
      return
    })

    setOrderId(order.data.id)

    toast.success("Cadastrado da mesa com sucesso")
    console.log("Cadastrado com sucesso")
    // redirect("/dashboard")
  }

  // Função para registrar item
  async function handleRegisterItem(formData: FormData) {

    const productIndex = formData.get("product")
    const product = categories[selectedCategory].data[Number(productIndex)].id

    const amountText = formData.get("amount")
    const amount = Number(amountText)

    console.log(product, amount)

    if (!product || !amount) {
      console.log("Preencha todos os campos")
      toast.warning("Falha em cadastrar mesa! Preencha todos os campos.")
      return
    }

    const token = getCookiesClient()

    await api.post("/orders/add", {
      order_id: orderId,
      product_id: product,
      amount: amount
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((err) => {
      console.log(err)
      toast.warning("Falha em cadastrar mesa!")
      return
    })

    setAtualizarItens(!atualizarItens)
    toast.success("Cadastrado da mesa com sucesso")
  }
  // Função para registrar item
  async function handleSandOrder() {

    const token = getCookiesClient()

    await api.put("/orders/send", {
      order_id: orderId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((err) => {
      console.log(err)
      toast.warning("Falha ao enviar mesa")
      return
    })

    toast.success("Mesa finalizada com sucesso!")
    redirect('/dashboard')
  }

  // Função para lidar com a alteração da categoria
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)
    setSelectedCategory(value)
    console.log("o valor selecionado do catagoria é: ", value)

    console.log(categories[value].data)
  }

  async function handleRemoveProduct(item: any) {
    console.log(item)

    const token = getCookiesClient()

    await api.delete("/orders/remove", {
      params: {
        item_id: item
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .catch((err) => {
        console.log(err)
        toast.warning("Item não foi deletado")
        return
      })

    toast.success("Item deletado com sucesso");
    setAtualizarItens(!atualizarItens)

  }

  return (
    <main className={styles.container}>
      <h1>Novo mesa</h1>

      {orderId === "" ?

        <form className={styles.form} action={handleRegisterOrder}>
          <input
            type="text"
            name="name"
            placeholder="Digite o numero da mesa"
            required
            className={styles.input}
          />
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            required
            className={styles.input}
          />

          <Button name="Criar mesa" />

        </form>

        : <></>}



      {orderId === "" ? <div></div> :

        <>
          <form className={styles.form} action={handleRegisterItem}>

            <select name="category" onChange={handleCategoryChange}>
              {categories.map((category, index) => (
                <option key={category.name} value={index}>
                  {category.name}
                </option>
              ))}
            </select>

            <select name="product">
              {categories[selectedCategory].data.map((item: any, index: any) => (
                <option key={item.name} value={index}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Quantidade"
              required
              className={styles.input}
            />

            <Button name="Adicionar pedido" />

          </form>

          <form className={styles.form} action={handleSandOrder}>
            <div className={styles.itensBox}>

              {itensOrder.map((item: any, index: any) => (
                <div key={index} className={styles.itens}>
                  <div>
                    <h2>{item.product.name} - {item.amount}</h2>
                  </div>
                  <button className={styles.btn} onClick={() => handleRemoveProduct(item.id)}>
                    <Trash size={30} color="#FFF" />
                  </button>
                </div>
              ))}
            </div>

            <Button name='Finalizar mesa' />
          </form>



        </>



      }

    </main>
  )
}