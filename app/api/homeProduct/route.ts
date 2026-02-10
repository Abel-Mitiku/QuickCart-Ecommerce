import { NextResponse } from "next/server";
import { fetchProductsForHomepage } from "@/app/action/fetchForHome";


export async function POST(req:Request){
    const result=await fetchProductsForHomepage();
    if(result.success){
        console.log("Success",result);
        return NextResponse.json(result);
    }
    return NextResponse.json({error:result.error});
}