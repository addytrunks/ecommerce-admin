'use client'

import { Billboard } from "@prisma/client"
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
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    label:z.string().min(3),
    imageUrl:z.string().min(1)
})

type BillboardFormValues  = z.infer<typeof formSchema>

interface BillboardFormProps{
    initialData: Billboard | null;
}

const BillboardForm : React.FC<BillboardFormProps>  = ({initialData}) => {

    const router = useRouter()
    const params = useParams();

    const [open,setOpen] = useState(false);
    const [loading,setLoading] = useState(false);

    const title = initialData ? 'Edit Billboard' : 'Create Billboard'
    const description = initialData ? 'Edit a Billboard' : 'Create a Billboard'
    const toastMessage = initialData ? 'Billboard updated' : 'Billboard created'
    const action = initialData ? 'Save changes' : 'Create billboard'

    const form = useForm<BillboardFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            label:'',
            imageUrl:''
        },
    })

    const onSubmit = async (data:BillboardFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data)
            }else{
                await axios.post(`/api/${params.storeId}/billboards`,data)
            }
            // Refreshes the page so that the updated value appears
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push('/')
            toast.success('Billboard deleted')
        } catch (error) {
            toast.error('Make sure you remove all categories using this billboard.')
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
                <FormField control={form.control} name="imageUrl" render={({field}) => (
                        <FormItem>
                            <FormLabel>Background Image</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onChange={(url) =>field.onChange(url)} onRemove={(url) => field.onChange("")}/>
                            </FormControl>
                            <FormMessage/>
                    </FormItem>
                )}/>
                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="label" render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Billboard Label" {...field}/>
                            </FormControl>
                            <FormMessage/>
                    </FormItem>
                    )}/>
                </div>
                <Button type="submit" disabled={loading} className="ml-auto">{action}</Button>
            </form>
        </Form>
        <Separator/>
    </>
    
  )
}

export default BillboardForm