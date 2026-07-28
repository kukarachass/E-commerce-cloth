export type BrandActionState = {
    ok: boolean;
    message?: string;
    errors?: Record<string, string[] | undefined>;
};