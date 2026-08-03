export type CategoryActionState = {
    ok: boolean;
    message?: string;
    errors?: Record<string, string[] | undefined>;
};