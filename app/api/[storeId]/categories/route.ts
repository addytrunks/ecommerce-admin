// API Routes to handle categories 

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb";

export const POST = async (req:Request,{params}:{params:{storeId:string}}) => {
    try {
        const {userId} = auth();
        const body = await req.json()
        const {name,billboardId} = body

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!name){
            return new NextResponse('Name is required',{status:400})
        }

        if(!billboardId){
            return new NextResponse('Billboard ID is required',{status:400})
        }

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }

        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const category = await prismadb.category.create({
            data:{
                name,
                billboardId,
                storeId:params.storeId
            }
        })

        return NextResponse.json(category)
        
    } catch (error) {
        console.log('[CATEGORIES_POST]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const GET = async (req:Request,{params}:{params:{storeId:string}}) => {
    try {
    
        const categories = await prismadb.category.findMany({
            where:{
                storeId:params.storeId,
            }
        })

        return NextResponse.json(categories)
        
    } catch (error) {
        console.log('[CATEGORIES_GET]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}