// API Routes to handle individual products

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const GET = async (
    req:Request,
    {params}:{params:{productId:string}}
) => {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.productId){
            return new NextResponse('Product id is required',{status:400})
        }

        const product = await prismadb.product.findMany({
            where:{
                id:params?.productId,
            },
            include:{
                images:true,
                category:true,
                size:true,
                color:true
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_GET]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const PATCH = async (
    req:Request,
    {params}:{params:{productId:string,storeId:string}}
) => {
    try {
        const {userId} = auth();
        const body = await req.json()

        const {name,price,categoryId,colorId,sizeId,images,isFeautured,isArchived} = body

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!images || !images.length){
            return new NextResponse('Images are required',{status:400})
        }

        if(!name){
            return new NextResponse('Name is required',{status:400})
        }

        if(!price){
            return new NextResponse('Price is required',{status:400})
        }

        if(!categoryId){
            return new NextResponse('Category ID is required',{status:400})
        }

        if(!colorId){
            return new NextResponse('Color ID is required',{status:400})
        }

        if(!sizeId){
            return new NextResponse('Size ID is required',{status:400})
        }

        if(!params.storeId){
            return new NextResponse('Store id is required',{status:400})
        }

        if(!params.productId){
            return new NextResponse('Product id is required',{status:400})
        }

        // Precaution: Deny unauthorized users
        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        await prismadb.product.update({
            where:{
                id:params?.productId,
            },
            data:{
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeautured,
                isArchived,
                images:{
                    deleteMany:{}
                }
            }
        })

        const product = await prismadb.product.update({
            where:{
                id:params.productId,
            },
            data:{
                images:{
                    createMany:{
                        data:[...images.map((image:{url:string}) => image)]
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_PATCH]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const DELETE = async (
    req:Request,
    {params}:{params:{storeId:string,productId:string}}
) => {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store id is required',{status:400})
        }

        if(!params.productId){
            return new NextResponse('Product id is required',{status:400})
        }

        // Precaution: Deny unauthorized users
        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const product = await prismadb.product.deleteMany({
            where:{
                id:params?.productId,
            },
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_DELETE]",error)
        return new NextResponse('Internal Error',{status:500})
    }
}