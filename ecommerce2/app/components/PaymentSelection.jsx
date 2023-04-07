'use client'

import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../../utils/Store'
import Cookies from 'js-cookie'

const PaymentSelection = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [hasRendered, setHasRendered] = useState(false)
  const router = useRouter()

  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const { shippingAddress, paymentMethod } = cart

  const submitHandler = e => {
    e.preventDefault()
    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required')
    }
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod })
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    )
  }

  useEffect(() => {
    if (!hasRendered) {
      setHasRendered(true)
    }
    if (hasRendered && !shippingAddress.addresss) {
      return router.push('/shipping')
    }

    setSelectedPaymentMethod(paymentMethod || '')
  }, [paymentMethod, router, shippingAddress.addresss])

  return (
    <div>
      <form onSubmit={() => submitHandler()} className='mx-auto max-w-screen-md'>
        <h1>Payment Method</h1>
        {['Paypal', 'Stripe', 'CashOnDelivery'].map(payment => (
          <div key={payment} className='mb-4'>
            <input
              type='radio'
              name='paymentMethod'
              className='p-2 outline-none focus:ring-0'
              id={payment}
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label htmlFor={payment} className='p-2'>
              {payment}
            </label>
          </div>
        ))}
        <div className='mb-4 flex justify-between'>
          <button className='default-button' type='button' onClick={() => router.push('/shipping')}>
            Back
          </button>
          <button className='primary-button'>Next</button>
        </div>
      </form>
    </div>
  )
}

export default PaymentSelection
