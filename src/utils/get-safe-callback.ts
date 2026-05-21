export default function getSafeCallbackUrl(callbackUrl: string | null): string {
    if (!callbackUrl) return '/'
    if (callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
        return callbackUrl
    }
    return '/'
}