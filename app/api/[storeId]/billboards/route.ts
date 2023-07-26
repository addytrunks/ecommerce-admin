// API Routes to handle billboards 

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb";

export const POST = async (req:Request,{params}:{params:{storeId:string}}) => {
    try {
        const {userId} = auth();
        const body = await req.json()
        const {label,imageUrl} = body

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!label){
            return new NextResponse('Label is required',{status:400})
        }

        if(!imageUrl){
            return new NextResponse('Image URL is required',{status:400})
        }

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }

        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const billboard = await prismadb.billboard.create({
            data:{
                label,
                imageUrl,
                storeId:params.storeId
            }
        })

        return NextResponse.json(billboard)
        
    } catch (error) {
        console.log('[BILLBOARDS_POST]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const GET = async (req:Request,{params}:{params:{storeId:string}}) => {
    try {
    
        const billboards = await prismadb.billboard.findMany({
            where:{
                storeId:params.storeId,
            }
        })

        return NextResponse.json(billboards)
        
    } catch (error) {
        console.log('[BILLBOARDS_GET]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}