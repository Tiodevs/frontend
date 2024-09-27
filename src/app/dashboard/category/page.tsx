import { api } from '@/app/services/api'
import styles from './styles.module.scss'
import { Button } from "@/app/dashboard/components/button"
import { getCookiesServer } from '@/lib/cookieServer'
import { redirect } from 'next/navigation'
import ListCategory from './components/lista'



interface Item {
  id: string;
  name: string;
}



export default async function Category() {

  const token = getCookiesServer()

  const responseCategories = await api.get("/categories", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const resCategories: Item[] = responseCategories.data

  // Função para buscar os dados do servidor
  const fetchCategories = async () => {

    // Mapear as requisições com axios
    const promises = resCategories.map(item =>
      api.get('/categories/products', {
        params: {
          category_id: item.id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => ({
          name: item.name,
          data: response.data
        }))
        .catch(() => ({
          name: item.name,
          data: null
        }))
    );


    // Esperar todas as promessas serem resolvidas
    const results = await Promise.all(promises);

    // Filtrar resultados válidos
    // console.log(results.filter(result => result.data !== null))
    return results.filter(result => result.data !== null);
  };

  const categories = await fetchCategories();

  async function handleRegisterCategory(formData: FormData) {
    "use server"

    console.log("Enviar nova ctegoria")

    const name = formData.get("name")

    if (name === "") {
      console.log("Preencha o campo")
      return
    }

    try {

      const token = getCookiesServer()

      await api.post("/categories", {
        name: name,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (err) {
      console.log("error: ", err)
      return
    }

    console.log("Nova categoria criada :D")
    redirect("/dashboard/product")
  }


  return (
    <main className={styles.container}>
      <h1>Nova Categoria</h1>

      <form
        className={styles.form}
        action={handleRegisterCategory}
      >
        <input
          type="text"
          name="name"
          placeholder="Nome da categoria, ex: Pizzas"
          required
          className={styles.input}
        />

        <Button name="Cadastrar" />
      </form>

      <ListCategory
        categories={categories}
      />

    </main>
  )
}