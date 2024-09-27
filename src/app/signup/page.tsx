import Image from "next/image"
import Link from "next/link"
import styles from '../page.module.scss'
// import LogoImg from '/Logo.svg'
import { api } from "../services/api"
import { redirect } from "next/navigation"

export default function Signup() {

    async function handleRegister(formData: FormData) {
        "use server"

        // 

        const name = formData.get("name")
        const email = formData.get("email")
        const password = formData.get("password")

        if (name === "" || email === "" || password === "") {
            console.log("Preencha todos os campos")
            return
        }

        try {
            await api.post("/users", {
                name: name,
                email: email,
                password: password
            })
        } catch (err) {
            console.log("error: ", err)
        }

        redirect("/")
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
                />

                <section className={styles.login}>
                    <form action={handleRegister}>
                        <input
                            type="text"
                            required
                            name="name"
                            placeholder="Digite seu nome"
                            className={styles.input}
                        />

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
                            placeholder="Escolha a sua senha"
                            className={styles.input}
                        />

                        <button type="submit">
                            Acessar
                        </button>
                    </form>

                    <Link href="/" className={styles.text}>
                        Já possui uma conta? Faça login.
                    </Link>
                </section>
            </div>
        </>
    )
}