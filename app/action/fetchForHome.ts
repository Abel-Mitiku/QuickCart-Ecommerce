"use server";
import { db } from "../lib/db";
import Product from "../models/products";


export async function fetchProductsForHomepage(){
    try{
        await db();
        const products=await Product.find().limit(12);
        return {result:products,success:true};
    }catch(err:any){
        console.log(err.message);
        return {error:err.message,success:false};
    }
}