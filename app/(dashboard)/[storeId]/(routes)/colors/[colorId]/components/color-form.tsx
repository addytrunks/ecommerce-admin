'use client'

import { Color } from "@prisma/client"
import { Trash2 } from "lucide-react";
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
    name:z.string().min(1),
    value:z.string().min(4).max(7).regex(/^#/,{
        message:"String must be a valid text code"
    }),
})

type ColorFormValues  = z.infer<typeof formSchema>

interface ColorFormProps{
    initialData: Color | null;
}

const ColorForm : React.FC<ColorFormProps>  = ({initialData}) => {

    const router = useRouter()
    const params = useParams();

    const [open,setOpen] = useState(false);
    const [loading,setLoading] = useState(false);

    const title = initialData ? 'Edit Color' : 'Create Color'
    const description = initialData ? 'Edit a Color' : 'Create a Color'
    const toastMessage = initialData ? 'Color updated' : 'Color created'
    const action = initialData ? 'Save changes' : 'Create Color'

    const form = useForm<ColorFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name:'',
            value:''
        },
    })

    const onSubmit = async (data:ColorFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`,data)
            }else{
                await axios.post(`/api/${params.storeId}/colors`,data)
            }
            // Refreshes the page so that the updated value appears
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Something went wrong')
        }finally{
            setLoading(false)
        }
    }

    const onDelete = async() => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success('Color deleted')
        } catch (error) {
            toast.error('Make sure you remove all products using this size.')
        }finally{
            setLoading(false)
            setOpen(false)
        }
    }

  return (
    <>
        <AlertModal loading={loading} isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete}/>
        <div className="flex items-center justify-between">
            <Heading title={title} description={description}/>
            {initialData && (
                <Button variant="destructive" size='icon' onClick={() => setOpen(true)} disabled={loading}>
                    <Trash2 className="h-4 w-4"/>
                </Button>
            )}
        </div>
        <Separator/>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Color name" {...field}/>
                            </FormControl>
                            <FormMessage/>
                    </FormItem>
                    )}/>
                    <FormField control={form.control} name="value" render={({field}) => (
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-x-2">
                                    <Input disabled={loading} placeholder="Color value" {...field}/>
                                    <div className="rounded-full p-4 border" style={{backgroundColor:field.value}}/>
                                </div>
                            </FormControl>
                            <FormMessage/>
                    </FormItem>
                    )}/>
                </div>
                <Button type="submit" disabled={loading} className="ml-auto">{action}</Button>
            </form>
        </Form>
    </>
    
  )
}

export default ColorForm