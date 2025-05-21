"use server"

import data from "@/lib/static-data/content-data/packs.json";
import { Pack } from "@/types";

export async function getPacks(): Promise<Pack[]> {
    return data as Pack[];
}
export async function getPackByID(id: number): Promise<Pack | undefined> {
    return data.find(i => i.id == id) as Pack | undefined;
}