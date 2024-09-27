import { getCookiesServer } from "@/lib/cookieServer";
import { api } from "@/app/services/api";
import { FormMesa } from "./components/form";

interface Item {
  id: string;
  name: string;
}

export default async function Product(){
  
  const token = getCookiesServer()

  const responseCategories = await api.get("/categories",{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })

  const resCategories: Item[] = responseCategories.data

  // Função para buscar os dados dos produtos de cada categori no servidor
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

  return(
    <FormMesa
      categories={categories}
    />
  )
}