'use client'

import Modal from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal"
import {useEffect} from 'react'

export default function SetupPage() {

  const [onOpen,isOpen] = useStoreModal((state) => [state.onOpen,state.isOpen])

  // Will not let users to close the modal
  useEffect(() => {
    if(!isOpen){
      onOpen()
    }
  },[isOpen,onOpen])

  return (
    <div className='p-4'>
        Root Page
    </div>
  )
}
