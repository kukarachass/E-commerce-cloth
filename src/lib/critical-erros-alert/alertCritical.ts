export default async function alertCritical(message: string) {
    try {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
            }),
        })
    } catch(err) {
        console.error(`A CRITICAL ERROR was found, but it wasn't sent the Telegram bot.`)
    }
}