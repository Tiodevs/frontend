import { getCookiesServer } from "@/lib/cookieServer";
import { Form } from "./components/form";
import { api } from "@/app/services/api";

export default async function Product(){
  
  const token = getCookiesServer()

  const response = await api.get("/categories",{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  
  return(
    <Form
      categories={response.data}
    />
  )
}