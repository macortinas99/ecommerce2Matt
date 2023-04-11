/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useContext } from 'react'
import { Store } from '../../utils/Store'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ProductItem({ product }) {
  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const addToCartHandler = async product => {
    console.log(product)
    const existItem = cart.cartItems.find(x => x.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    // Get updated count in stock # when button clicked
    let data = await fetch(`/api/getProduct?slug=${product.slug}`)
    data = await data.json()

    if (data.countInStock < quantity) {
      toast.error('Sorry product is out of stock', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
      return
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: quantity } })
    toast.success('Product added to cart', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }
  return (
    <div className='card'>
      <Link href={`/product/?slug=${product.slug}`}>
        <img src={product.image} alt={product.name} className='rounded shadow object-cover h-64 w-full' />
      </Link>

      <div className='flex flex-col items-center justify-center'>
        <Link href={`/product/?$slug={product.slug}`}>
          <h2 className='text-lg'>{product.name}</h2>
        </Link>
        <p className='mb-2'>{product.brand}</p>
        <p>${product.price}</p>
        <button className='primary-button' type='button' onClick={() => addToCartHandler(product)}>
          Add to cart
        </button>
      </div>
    </div>
  )
}
