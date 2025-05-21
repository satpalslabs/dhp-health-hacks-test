"use server"

import data from "@/lib/static-data/content-data/tips.json";
import { Tip } from "@/types";

export async function getTips(): Promise<Tip[]> {
    return data;
}
export async function getTipByID(id: number): Promise<Tip | undefined> {
    return data.find(i => i.id == id);
}