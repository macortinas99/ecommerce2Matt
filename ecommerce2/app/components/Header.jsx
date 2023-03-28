'use client'

import Link from 'next/link'
import React, { useContext, useState, useEffect } from 'react'
import { Store } from '../../utils/Store'
import { signOut, useSession } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import { Menu } from '@headlessui/react'
import Cookies from 'js-cookie'

const Header = () => {
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const { status, data: session } = useSession()
  console.log(status, session)

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
  }, [cart.cartItems])

  const logoutClickHandler = () => {
    Cookies.remove('cart')
    dispatch({ type: 'CART_RESET' })
    signOut({ callbackUrl: '/login' })
  }

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
              <Menu as='div' className='relative inline-block'>
                <Menu.Button className='text-blue-600'>{session.user.name}</Menu.Button>
                <Menu.Items className='absolute right-0 w-56 origin-top-right bg-white shadow-lg'>
                  <Menu.Item>
                    <Link className='dropdown-link' href='/profile'>
                      Profile
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link className='dropdown-link' href='/order-history'>
                      Order History{' '}
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link className='dropdown-link' href='#' onClick={logoutClickHandler}>
                      Logout
                    </Link>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
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
