// API Routes to handle products 

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb";

export const POST = async (req:Request,{params}:{params:{storeId:string}}) => {
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
            return new NextResponse('Store ID is required',{status:400})
        }

        const storeByUser = await prismadb.store.findMany({where:{id:params.storeId,userId}})

        if(!storeByUser){
            return new NextResponse('Unauthorized',{status:400})
        }

        const product = await prismadb.product.create({
            data:{
                name,
                price,
                isFeautured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId:params.storeId,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string}) =>image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product)
        
    } catch (error) {
        console.log('PRODUCTS_POST]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const GET = async (req:Request,{params}:{params:{storeId:string}}) => {
    try {
        const {searchParams} =  new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const isFeautured = searchParams.get("isFeautured") || undefined

        const products = await prismadb.product.findMany({
            where:{
                storeId:params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeautured:isFeautured ? true : undefined,
                isArchived:false
            },
            include:{
                images:true,
                category:true,
                color:true,
                size:true,
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        return NextResponse.json(products)
        
    } catch (error) {
        console.log('[PRODUCTS_GET]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}