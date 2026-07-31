export type FormActionState = {
    ok: boolean;
    message?: string;
    errors?: Record<string, string[] | undefined>;
};