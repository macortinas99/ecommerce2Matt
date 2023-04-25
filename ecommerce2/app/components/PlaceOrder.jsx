'use client'

import { useContext, useEffect, useState } from 'react'
import { Store } from '../../utils/Store'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getError } from '../../utils/error'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [hasRendered, setHasRendered] = useState(false)
  const [loading, setLoading] = useState(false)
  const { status, data: session } = useSession()
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const { cartItems, shippingAddress, paymentMethod } = cart

  const round2 = num => Math.round((num + Number.EPSILON) * 100) / 100

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )
  // shipping free over $200, $15 standard shipping fee
  const shippingPrice = itemsPrice > 200 ? 0 : 15
  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  //   Prevents Hydration UI error
  useEffect(() => {
    if (!hasRendered) {
      setHasRendered(true)
    }
    if (!paymentMethod) {
      router.push('/payment')
    }
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [hasRendered, paymentMethod, router, status])
  if (!hasRendered) {
    return null
  }

  const placeOrderHandler = async () => {
    try {
      setLoading(true)
      const body = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        session: session,
      }
      console.log(body)
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }
      )
      const orderInfo = await data.json()

      setLoading(false)

      dispatch({ type: 'CART_CLEAR_ITEMS' })
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      )
      console.log('TESTSTESTST', orderInfo)
      router.push(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/order?orderID=${orderInfo._id}`
      )
    } catch (err) {
      setLoading(false)
      toast.error(getError(err), {
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
  }

  return (
    <div>
      {cart && cartItems.length === 0 ? (
        <div>
          Cart is emtpy.
          <Link href='/'>Go shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </div>
              <Link href='/shipping'>Edit</Link>
            </div>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href='/payment'>Edit</Link>
              </div>
            </div>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Order Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Items</th>
                    <th className='p-5 text-right'>Quantity</th>
                    <th className='p-5 text-right'>Price</th>
                    <th className='p-5 text-right'>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item._id} className='border-b'>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{item.quanity}</td>
                      <td className='p-5 text-right'>${item.price}</td>
                      <td className='p-5 text-right'>
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href='/cart'>Edit</Link>
              </div>
            </div>
          </div>
          <div className='card p-5'>
            <h2 className='mb-2 text-lg'>Order Summary</h2>
            <ul>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Items</div>
                  <div>${itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Tax</div>
                  <div>${taxPrice}</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Shipping Price</div>
                  <div>${shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Total Price</div>
                  <div>${totalPrice}</div>
                </div>
              </li>
              <li>
                <button
                  disabled={loading}
                  onClick={placeOrderHandler}
                  className='primary-button w-full'
                >
                  {' '}
                  {loading ? 'Loading...' : 'Place Order'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlaceOrder
