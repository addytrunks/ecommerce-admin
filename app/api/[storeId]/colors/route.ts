// API Routes to handle colors 

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb";

export const POST = async (req:Request,{params}:{params:{storeId:string}}) => {
    try {
        const {userId} = auth();
        const body = await req.json()
        const {name,value} = body

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!name){
            return new NextResponse('Name is required',{status:400})
        }

        if(!value){
            return new NextResponse('Value is required',{status:400})
        }

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }

        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const color = await prismadb.color.create({
            data:{
                name,
                value,
                storeId:params.storeId
            }
        })

        return NextResponse.json(color)
        
    } catch (error) {
        console.log('[COLORS_POST]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const GET = async (req:Request,{params}:{params:{storeId:string}}) => {
    try {
    
        const colors = await prismadb.color.findMany({
            where:{
                storeId:params.storeId,
            }
        })

        return NextResponse.json(colors)
        
    } catch (error) {
        console.log('[COLORS_GET]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}