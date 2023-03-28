'use client'

import Link from 'next/link'
import React, { useContext, useState, useEffect } from 'react'
import { Store } from '../../utils/Store'
import { useSession } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'

const Header = () => {
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const { status, data: session } = useSession()
  console.log(status, session)

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
  }, [cart.cartItems])

  return (
    <div>
      <header>
        <ToastContainer position='bottom-center' limit={1} />
        <nav className='flex h-12 justify-between shadow-md items-center'>
          <Link href='/' className='text-lg font-bold '>
            Matthew's Store
          </Link>
          <div>
            <Link href='/cart' className='p-2'>
              Cart
              {cartItemsCount > 0 && <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>{cartItemsCount}</span>}
            </Link>

            {status === 'loading' ? (
              'Loading'
            ) : session?.user.name ? (
              session.user.name
            ) : (
              <Link href='/login' className='p-2'>
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>
    </div>
  )
}
export default Header
