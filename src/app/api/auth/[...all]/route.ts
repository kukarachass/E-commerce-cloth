import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
    try {
        return await handler.GET(req);
    } catch (e) {
        console.error("🔥 AUTH ROUTE ERROR:", e);
        throw e;
    }
};

export const POST = async (req: Request) => {
    try {
        return await handler.POST(req);
    } catch (e) {
        console.error("🔥 AUTH ROUTE ERROR:", e);
        throw e;
    }
};