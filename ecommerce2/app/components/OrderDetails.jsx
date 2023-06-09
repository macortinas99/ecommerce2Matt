'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useReducer, useEffect } from 'react'
import { getError } from '../../utils/error'
import Link from 'next/link'
import Image from 'next/image'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' }

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
  }
}

const OrderDetails = () => {
  const [hasRendered, setHasRendered] = useState(false)
  const { status, data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderID')

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/${orderId}`,
          {
            method: 'POST',
            body: JSON.stringify(session),
            headers: {
              'content-type': 'application/json',
            },
          }
        )
        const data = await res.json()
        console.log(data)

        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    if (session && (!order._id || (order._id && order._id == orderId))) {
      fetchOrder()
    }
  }, [order._id, orderId, session])

  if (status === 'unauthenticated') {
    router.push('/login')
  }
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order

  return (
    <div>
      <h1 className='mb-4 text-xl'>{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card  p-5'>
              <h2 className='mb-2 text-lg'>Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className='alert-success'>
                  Delivered at {deliveredAt}
                </div>
              ) : (
                <div className='alert-error'>Not delivered</div>
              )}
            </div>

            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className='alert-success'>Paid at {paidAt}</div>
              ) : (
                <div className='alert-error'>Not paid</div>
              )}
            </div>

            <div className='card overflow-x-auto p-5'>
              <h2 className='mb-2 text-lg'>Order Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='    p-5 text-right'>Quantity</th>
                    <th className='  p-5 text-right'>Price</th>
                    <th className='p-5 text-right'>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map(item => (
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
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                            }}
                          ></Image>
                          {item.name}
                        </Link>
                      </td>
                      <td className=' p-5 text-right'>{item.quantity}</td>
                      <td className='p-5 text-right'>${item.price}</td>
                      <td className='p-5 text-right'>
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className='card  p-5'>
              <h2 className='mb-2 text-lg'>Order Summary</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>{' '}
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                {/* {!isPaid && (
                  <li>
                    {isPending ? (
                      <div>Loading...</div>
                    ) : (
                      <div className='w-full'>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )} */}
                {/* {session.user.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <li>
                      {loadingDeliver && <div>Loading...</div>}
                      <button
                        className='primary-button w-full'
                        onClick={deliverOrderHandler}
                      >
                        Deliver Order
                      </button>
                    </li>
                  )} */}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
