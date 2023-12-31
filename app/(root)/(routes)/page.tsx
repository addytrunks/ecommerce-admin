'use client'

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

  return null;
}
