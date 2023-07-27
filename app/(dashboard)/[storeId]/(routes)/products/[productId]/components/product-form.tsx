'use client'

import { Category, Color, Image, Product, Size } from "@prisma/client"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    name:z.string().min(1),
    images:z.object({url:z.string()}).array(),
    price:z.coerce.number().min(1),
    categoryId:z.string().min(1),
    colorId:z.string().min(1),
    sizeId:z.string().min(1),
    isFeautured:z.boolean().default(false).optional(),
    isArchived:z.boolean().default(false).optional()
})

type ProductFormValues  = z.infer<typeof formSchema>

interface ProductFormProps{
    initialData: Product & {
        images:Image[]
    } | null
    categories:Category[]
    sizes:Size[]
    colors:Color[]
}

const ProductForm : React.FC<ProductFormProps>  = ({initialData,categories,colors,sizes}) => {

    const router = useRouter()
    const params = useParams();

    const [open,setOpen] = useState(false);
    const [loading,setLoading] = useState(false);

    const title = initialData ? 'Edit Product' : 'Create Product'
    const description = initialData ? 'Edit a Product' : 'Create a Product'
    const toastMessage = initialData ? 'Product updated' : 'Product created'
    const action = initialData ? 'Save changes' : 'Create Product'

    const form = useForm<ProductFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData ? {
            ...initialData,
            price:parseFloat(String(initialData?.price))
        } :{
            name:'',
            images:[],
            price:0,
            categoryId:'',
            colorId:'',
            sizeId:'',
            isFeautured:false,
            isArchived:false

        },
    })

    const onSubmit = async (data:ProductFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,data)
            }else{
                await axios.post(`/api/${params.storeId}/products`,data)
            }
            // Refreshes the page so that the updated value appears
            router.refresh()
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success('Product deleted')
        } catch (error) {
            toast.error('Something went wrong')
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
                <FormField control={form.control} name="images" render={({field}) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value.map((image) => image.url)} disabled={loading} onChange={(url:string) =>field.onChange([...field.value,{url}])} onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}/>
                            </FormControl>
                            <FormMessage/>
                    </FormItem>
                )}/>
                <div className="grid grid-cols-3 gap-8">

                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Product Name" {...field}/>
                            </FormControl>
                            <FormMessage/>
                    </FormItem>
                    )}/>

                    <FormField control={form.control} name="price" render={({field}) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                            </FormControl>
                            <FormMessage/>
                    </FormItem>
                    )}/>
                    
                    {/* Category Select */}
                    <FormField control={form.control} name="categoryId" render={({field}) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a category"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem value={category.id} key={category.id}>{category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                    </FormItem>
                    )}/>
                    
                    {/* Size Select */}
                    <FormField control={form.control} name="sizeId" render={({field}) => (
                        <FormItem>
                            <FormLabel>Size</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a size"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sizes.map((size) => (
                                        <SelectItem value={size.id} key={size.id}>{size.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                    </FormItem>
                    )}/>
                    
                    {/* Color Select */}
                    <FormField control={form.control} name="colorId" render={({field}) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a color"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {colors.map((color) => (
                                        <SelectItem  value={color.id} key={color.id}>
                                            <div className="flex items-center gap-x-4">
                                                <span className="flex-1">{color.name}</span>
                                                <div className="rounded-full border p-4" style={{backgroundColor:color.value}} />
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                    </FormItem>
                    )}/>

                    <FormField control={form.control} name="isFeautured" render={({field}) => (
                        <FormItem className="flex items-center flex-row space-x-3 space-y-0 border rounded-md p-4">    
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Feautured</FormLabel>
                                <FormDescription>This product will appear on the home page</FormDescription>
                            </div>
                        </FormItem>
                    )}/>

                    <FormField control={form.control} name="isArchived" render={({field}) => (
                        <FormItem className="flex items-center flex-row space-x-3 space-y-0 border rounded-md p-4">    
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Archived</FormLabel>
                                <FormDescription>This product will not appear anywhere in the store.</FormDescription>
                            </div>
                        </FormItem>
                    )}/>
                    
                </div>
                <Button type="submit" disabled={loading} className="ml-auto">{action}</Button>
            </form>
        </Form>
    </>
    
  )
}

export default ProductForm