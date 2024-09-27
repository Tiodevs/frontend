import { redirect } from "next/navigation";
import styles from "./page.module.scss";
import { api } from "./services/api";
// import LogoImg from '/public/Logo.svg'
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";


export default function Home() {

  async function handleRegister(formData:FormData) {
    "use server"

    const email = formData.get("email")
    const password = formData.get("password")

    if(email === "" || password === ""){
      console.log("Preencha todos os campos")
      return
    }
    
    try {
      
      const response = await api.post("/login",{
        email,
        password
      })

      if(!response.data.token){
        return
      }

      console.log(response.data.token)

      const expressTime = 60 * 60 * 24 * 30 * 1000

      cookies().set("session", response.data.token, {
        maxAge: expressTime,
        httpOnly: false,
      })

    } catch (err) {
      console.log("erro: ", err)
      return
    }

    redirect("/dashboard")
  }


  return (
    <>
      <div className={styles.containerCenter}>
        <Image
          src={"/logo.svg"}
          alt="Logo da empresa"
          className={styles.logo}
          width={700}
            height={80}
          priority
        />

        <section className={styles.login}>
          <form action={handleRegister}>
            <input
              type="email"
              required
              name="email"
              placeholder="Digite seu email"
              className={styles.input}
              
            />

            <input
              type="password"
              required
              name="password"
              placeholder="Sua senha"
              className={styles.input}
            />

            <button type="submit">
              Acessar
            </button>
          </form>

          <Link href="/signup" className={styles.text}>
            Não possui uma conta? Cadastre-se
          </Link>
        </section>
      </div>
    </>
  );
}
