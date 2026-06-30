import { UserButton, SignInButton, Show } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Header = () => {
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
                  <Show when="signed-in">
                    {/* UserButton handles its own styling nicely, so we just wrap it for layout */}
                    <div className="ring-2 ring-slate-200 rounded-full hover:ring-slate-300 transition-all">
                      <UserButton />        
                    </div>
                  </Show>

                  <Show when="signed-out">
                    {/* By nesting a standard HTML button inside, Clerk applies the click logic to it while you control the Tailwind design */}
                    <SignInButton mode='modal'>
                      <Button size='sm'>Sign In</Button>
                    </SignInButton>
                  </Show>
                </div>
                </div>
            </div>

            {/* Mobile Search & Location - Below Header  */}
        </nav>

        {/* Modals  */}
    </>
  )
}

export default Header