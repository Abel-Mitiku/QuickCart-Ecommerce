import { NextResponse } from "next/server";
import { fetchAllProducts } from "@/app/action/fetchAll";


export async function POST(req:Request){
    const result=await fetchAllProducts();
    if(result.success){
        console.log("Success",result);
        return NextResponse.json(result);
    }
    return NextResponse.json({error:result.error});
}