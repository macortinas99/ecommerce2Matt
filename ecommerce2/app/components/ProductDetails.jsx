'use client'

import Link from 'next/link.js'
import Image from 'next/image.js'
import { useContext } from 'react'
import { Store } from '../../utils/Store.js'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProductDetails = ({ product }) => {
  const { state, dispatch } = useContext(Store)
  const router = useRouter()
  console.log(product)
  if (product.message === 'Product does not exist') {
    return <div>Product Not Found</div>
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(x => x.slug === product.slug)
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
    router.push('/cart')
  }

  return (
    <div>
      <div className='py-2'>
        <Link href='/'>Back to products</Link>
      </div>
      <div className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <Image src={product.image} alt={product.name} width={640} height={640} />
        </div>
        <div>
          <ul>
            <li>
              <h1 className='text-lg'>{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>{product.description}</li>
          </ul>
        </div>
        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</div>
            </div>
            <button className='primary-button w-full' onClick={() => addToCartHandler()}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
