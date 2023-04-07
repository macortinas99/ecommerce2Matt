'use client'

import { useForm } from 'react-hook-form'

import React, { useContext, useEffect } from 'react'
import { Store } from '../../utils/Store'
import Cookies from 'js-cookie'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const ShippingForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm()

  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const { shippingAddress } = cart
  const router = useRouter()

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required')
    },
  })

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('zipCode', shippingAddress.zipCode)
    setValue('country', shippingAddress.country)
  }, [setValue, shippingAddress])

  const submitHandler = ({ fullName, address, city, zipCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, zipCode, country },
    })
    // Save address in local cookies
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          zipCode,
          country,
        },
      })
    )

    router.push('/payment')
  }

  return (
    <form className='mx-auto w-[60%] lg:w-[40%] relative ' onSubmit={handleSubmit(submitHandler)}>
      <h1 className='mb-4 text-xl'>Shipping Address</h1>
      <div className='mb-4'>
        <label htmlFor=''>Full Name</label>
        <input
          className='w-full'
          id='fullName'
          autoFocus
          {...register('fullName', {
            required: 'Please enter full name',
          })}
        />
        {errors.fullName && <div className='text-red-500'>{errors.fullName.message}</div>}
      </div>
      <div className='mb-4'>
        <label htmlFor=''>Address</label>
        <input
          className='w-full'
          id='address'
          autoFocus
          {...register('address', {
            required: 'Please enter address',
            minLength: { value: 3, message: 'Address must be more than 2 characters' },
          })}
        />
        {errors.address && <div className='text-red-500'>{errors.address.message}</div>}
      </div>
      <div className='mb-4'>
        <label htmlFor=''>City</label>
        <input
          className='w-full'
          id='city'
          autoFocus
          {...register('city', {
            required: 'Please enter city',
          })}
        />
        {errors.city && <div className='text-red-500'>{errors.city.message}</div>}
      </div>
      <div className='mb-4'>
        <label htmlFor=''>Zip Code</label>
        <input
          className='w-full'
          id='zipCode'
          autoFocus
          {...register('zipCode', {
            required: 'Please enter zip code',
          })}
        />
        {errors.zipCode && <div className='text-red-500'>{errors.zipCode.message}</div>}
      </div>
      <div className='mb-4'>
        <label htmlFor=''>Country</label>
        <input
          className='w-full'
          id='country'
          autoFocus
          {...register('country', {
            required: 'Please enter country',
          })}
        />
        {errors.country && <div className='text-red-500'>{errors.country.message}</div>}
      </div>
      <div className='mb-4 flex justify-between'>
        <button className='primary-button'>Next</button>
      </div>
    </form>
  )
}

export default ShippingForm
