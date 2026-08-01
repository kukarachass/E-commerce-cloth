export default function errMessage(e: unknown, fallback: string) {
    return e instanceof Error ? e.message : fallback;
}