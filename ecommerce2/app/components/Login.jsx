'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const Login = () => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    console.log(errors)
  }, [errors])

  const submitHandler = ({ email, password }) => {
    console.log(email, password)
  }
  return (
    <form action='' className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
      <h1 className='mb-4 text-xl'>Login</h1>
      <div className='mb-4'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          {...register('email', {
            required: 'Please enter email',
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[z-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
              message: 'Please enter valid email address',
            },
          })}
          className='w-full'
          id='email'
          autoFocus
        />
        {errors.email?.message && <div className='text-red-500'>{errors.email.message}</div>}
      </div>
      <div className='mb-4'>
        <label htmlFor='password'>password</label>
        <input
          type='password'
          className='w-full'
          id='password'
          {...register('password', {
            required: 'Please enter password',
            minLength: { value: 6, message: 'Password must be more than 5 characters' },
          })}
          autoFocus
        />
        {errors.password?.message && <div className='text-red-500'>{errors.password.message}</div>}
      </div>
      <div className='mb-4'>
        <button className='primary-button'>Login</button>
      </div>
      <div>
        Don&apos;t have an account? &nbsp;
        <Link href={'/register'}>Register</Link>
      </div>
    </form>
  )
}

export default Login
