'use client'

import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CategoryColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { useState } from "react"
import axios from "axios"
import AlertModal from "@/components/modals/alert-modal"

interface CellActionsProps{
    data:CategoryColumn
}

const CellActions = ({data}:CellActionsProps) => {

    const router = useRouter()
    const params = useParams()

    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(data.id)
        toast.success('Category ID copied to the clipboard')
    }

    const onDelete = async() => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${data.id}`)
            router.refresh()
            toast.success('Category deleted')
        } catch (error) {
            toast.error('Make sure you remove all products using this category.')
        }finally{
            setLoading(false)
            setOpen(false)
        }
    }

  return (
    <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} loading={loading} onConfirm={onDelete}/>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="h-8 w-8 p-0">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontal className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>

                <DropdownMenuItem onClick={() =>router.push(`/${params.storeId}/categories/${data.id}`)}>
                    <Edit className="mr-2 h-4 w-4"/>
                    Update
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onCopy}>
                    <Copy className="mr-2 h-4 w-4"/>
                    Copy Id
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4"/>
                    Delete
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    </>
  )
}

export default CellActions