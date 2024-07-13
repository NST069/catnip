"use server";
import { redirect} from "next/navigation";
export default async function Redirect(to:string){
    await redirect(to);
}