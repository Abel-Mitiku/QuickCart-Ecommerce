import { channel } from "diagnostics_channel";
import mongoose,{model,models,mongo,Schema} from "mongoose";

const MONGODB_URL=process.env.MONGODB_URL!;
if(!MONGODB_URL) throw new Error("MONGODB_URL is missing in .env.local");

interface MongooseCache{
  conn:typeof mongoose | null;
  promise:Promise<typeof mongoose> | null;
}

declare global{
    var mongoose:MongooseCache | undefined;
}

let cached:MongooseCache=global.mongoose || {conn:null,promise:null};
if(process.env.NODE_ENV === 'development')global.mongoose=cached;


export async function db(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const opt={
            bufferCommands:false
        }
        cached.promise=mongoose.connect(MONGODB_URL,opt);
    }

    try{
        cached.conn=await cached.promise;
        console.log("DB connected");
    }catch(e){
        cached.promise=null;
        throw e;
    }

    return cached.conn;
}

export default mongoose;