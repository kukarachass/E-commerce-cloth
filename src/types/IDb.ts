// "тип первого аргумента колбэка, который принимает db.transaction" = это и есть tx
import {db} from "@/db";

export type DbTx = Parameters<Parameters<typeof db.transaction>[0]>[0]