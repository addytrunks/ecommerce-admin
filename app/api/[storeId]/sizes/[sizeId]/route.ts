// API Routes to handle individual sizes

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const GET = async (
    req:Request,
    {params}:{params:{sizeId:string}}
) => {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.sizeId){
            return new NextResponse('Size id is required',{status:400})
        }

        const size = await prismadb.size.findMany({
            where:{
                id:params?.sizeId,
            },
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log("[SIZE_GET]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const PATCH = async (
    req:Request,
    {params}:{params:{sizeId:string,storeId:string}}
) => {
    try {
        const {userId} = auth();
        const body = await req.json()

        const {name,value} = body;

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
            return new NextResponse('Store id is required',{status:400})
        }

        if(!params.sizeId){
            return new NextResponse('Size id is required',{status:400})
        }

        // Precaution: Deny unauthorized users
        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const size = await prismadb.size.updateMany({
            where:{
                id:params?.sizeId,
            },
            data:{
                name,
                value
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log("[SIZE_PATCH]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const DELETE = async (
    req:Request,
    {params}:{params:{storeId:string,sizeId:string}}
) => {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store id is required',{status:400})
        }

        if(!params.sizeId){
            return new NextResponse('Size id is required',{status:400})
        }

        // Precaution: Deny unauthorized users
        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const size = await prismadb.size.deleteMany({
            where:{
                id:params?.sizeId,
            },
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log("[SIZE_DELETE]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}