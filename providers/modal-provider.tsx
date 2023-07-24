'use client'

import { StoreModal } from '@/components/modals/store-modal'

import {useState,useEffect} from 'react'

export const ModalProvider = () => {

    const [isMounted,setIsMounted] = useState(false)

    // Prevention from hydration error(when the client and the server are not in sync)
    useEffect(() => {
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null;
    }

    return (
        <>
            <StoreModal/>
        </>
    )
}