import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: 'Admin Dashboard - (Overview)',
}

export default async function DashboardLayout({children}:{children:React.ReactNode}){
    

    const {userId} = auth()

    if(!userId){
        redirect('/sign-in')
    }

    const store = await prismadb.store.findFirst({where:{userId}})

    if(store){
        redirect(`/${store.id}`)
    }

    return (
        <>
            {children}
        </>
    )
}