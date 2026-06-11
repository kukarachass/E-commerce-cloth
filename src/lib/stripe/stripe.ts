// lib/stripe/server.ts
// Только сервер. Этот файл НИКОГДА не должен импортироваться в Client Component —
// иначе секретный ключ утечёт в браузерный бандл.
import "server-only" // пакет-предохранитель: сборка упадёт при импорте на клиенте
import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
    // Fail fast при старте, а не при первом платеже в проде.
    throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // Пинним версию API ЯВНО. Почему: без пина Stripe однажды
    // выкатит новую версию и форматы ответов поедут под тобой.
    // Явный пин = детерминированное поведение.
    apiVersion: "2026-05-27.dahlia",
    typescript: true,
    appInfo: { name: "Otrium Store", version: "1.0.0" }, // помогает Stripe в саппорте
})
