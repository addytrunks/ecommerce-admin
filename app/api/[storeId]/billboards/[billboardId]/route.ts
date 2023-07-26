// API Routes to handle individual billboards

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const GET = async (
    req:Request,
    {params}:{params:{billboardId:string}}
) => {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.billboardId){
            return new NextResponse('Billboard id is required',{status:400})
        }

        const billboard = await prismadb.billboard.findMany({
            where:{
                id:params?.billboardId,
            },
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_GET]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const PATCH = async (
    req:Request,
    {params}:{params:{billboardId:string,storeId:string}}
) => {
    try {
        const {userId} = auth();
        const body = await req.json()

        const {label,imageUrl} = body;

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
            return new NextResponse('Store id is required',{status:400})
        }

        if(!params.billboardId){
            return new NextResponse('Billboard id is required',{status:400})
        }

        // Precaution: Deny unauthorized users
        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const billboard = await prismadb.billboard.updateMany({
            where:{
                id:params?.billboardId,
            },
            data:{
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_PATCH]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const DELETE = async (
    req:Request,
    {params}:{params:{storeId:string,billboardId:string}}
) => {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store id is required',{status:400})
        }

        if(!params.billboardId){
            return new NextResponse('Billboard id is required',{status:400})
        }

        // Precaution: Deny unauthorized users
        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const billboard = await prismadb.billboard.deleteMany({
            where:{
                id:params?.billboardId,
            },
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_DELETE]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}