"use client"

import { UserButton, SignInButton} from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Authenticated, Unauthenticated } from 'convex/react'
import {BarLoader} from "react-spinners"
import { useStoreUser } from '@/hooks/use-store-user'
import { Building, Plus } from 'lucide-react'
import { Ticket } from "lucide-react";
import { createFromNextReadableStream } from 'next/dist/client/components/router-reducer/fetch-server-response'

const Header = () => {

  const {isLoading} = useStoreUser();

  const [showUpgradeModal,setShowUpgradeModal] = useState(false);

  return (
    <>
        <nav className='fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b'>
            <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
              <Link href={'/'} className= "flex items-center">
                {/* Logo  */}
                <Image src="/planora.png" alt='planora logo' width={500} height={500} className='w-full h-11' priority/>
              </Link>
                {/* Search & Location - Desktop Only */}
                
                {/* Right Side Actions  */}
                <div className='flex items-center'>
                  <div className="flex items-center gap-4 p-2">
                    <Button variant={"ghost"} size="sm" onClick={() => setShowUpgradeModal(true)}>
                      Pricing
                    </Button>                    <Button variant={"ghost"} size="sm" asChild className={"mr-2"}>
                      <Link href={"explore"}>Explore</Link>
                    </Button>


                  <Authenticated>
                    <Button size='sm' asChild className={"flex gap-2 mr-4"}>
                      <Link href={"/create-event"}>
                        <Plus className='w-4 h-4'/>
                        <span className='hidden sm:inline'>Create Event</span>
                      </Link>
                    </Button>
                    <div className="ring-2 ring-slate-200 rounded-full hover:ring-slate-300 transition-all">
                      <UserButton>
                        <UserButton.MenuItems>
                          <UserButton.Link 
                            label='My Tickets'
                            labelIcon={<Ticket size={16}/>}
                            href='/my-tickets'
                          />
                          <UserButton.Link 
                            label='My Events'
                            labelIcon={<Building size={16}/>}
                            href='/my-events'
                          />
                          <UserButton.Action label='manageAccount'/>
                        </UserButton.MenuItems>
                      </UserButton>        
                    </div>
                  </Authenticated>

                  <Unauthenticated>
                    {/* By nesting a standard HTML button inside, Clerk applies the click logic to it while you control the Tailwind design */}
                    <SignInButton mode='modal'>
                      <Button size='sm'>Sign In</Button>
                    </SignInButton>
                  </Unauthenticated>
                </div>
                </div>
            </div>

            {/* Mobile Search & Location - Below Header  */}

            {/* Loader  */}{
            isLoading&&
            <div className='absolute bottom-0 left-0 w-full'>
              <BarLoader width={'100%'} color='#a855f7'/>
            </div>
            }
        </nav>

        {/* Modals  */}
    </>
  )
}

export default Header