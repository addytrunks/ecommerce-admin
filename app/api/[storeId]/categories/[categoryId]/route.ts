// API Routes to handle individual categories

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const GET = async (
    req:Request,
    {params}:{params:{categoryId:string}}
) => {
    try {
        if(!params.categoryId){
            return new NextResponse('Category id is required',{status:400})
        }

        const category = await prismadb.category.findMany({
            where:{
                id:params?.categoryId,
            },
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORY_GET]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const PATCH = async (
    req:Request,
    {params}:{params:{categoryId:string,storeId:string}}
) => {
    try {
        const {userId} = auth();
        const body = await req.json()

        const {name,billboardId} = body;

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
            return new NextResponse('Store id is required',{status:400})
        }

        if(!params.categoryId){
            return new NextResponse('Category id is required',{status:400})
        }

        // Precaution: Deny unauthorized users
        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const category = await prismadb.category.updateMany({
            where:{
                id:params?.categoryId,
            },
            data:{
                name,
                billboardId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORY_PATCH]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const DELETE = async (
    req:Request,
    {params}:{params:{storeId:string,categoryId:string}}
) => {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store id is required',{status:400})
        }

        if(!params.categoryId){
            return new NextResponse('Category id is required',{status:400})
        }

        // Precaution: Deny unauthorized users
        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const category = await prismadb.category.deleteMany({
            where:{
                id:params?.categoryId,
            },
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORY_DELETE]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}