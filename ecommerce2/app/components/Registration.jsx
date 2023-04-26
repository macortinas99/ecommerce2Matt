'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/react'
import { getError } from '../../utils/error'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useRouter, useSearchParams } from 'next/navigation'

const Registration = () => {
  const { data: session } = useSession()
  const router = useRouter()

  // Get redirect link from query
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/')
    }
  }, [router, session, redirect])

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm()

  const submitHandler = async ({ name, email, password }) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`,
        {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            password,
          }),
          headers: {
            'content-type': 'application/json',
          },
        }
      )
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result.error) {
        toast.error(result.error, {
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
    } catch (err) {
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
    <form
      action=''
      className='mx-auto max-w-screen-md'
      onSubmit={handleSubmit(submitHandler)}
    >
      <h1 className='mb-4 text-xl'>Register a New Account</h1>
      <div className='mb-4'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          className='w-full'
          id='name'
          autoFocus
          {...register('name', {
            required: 'Please enter your name',
          })}
        />
        {errors.name && (
          <div className='text-red-500'>{errors.name.message}</div>
        )}
      </div>
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
        />
        {errors.email?.message && (
          <div className='text-red-500'>{errors.email.message}</div>
        )}
      </div>
      <div className='mb-4'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          className='w-full'
          id='password'
          {...register('password', {
            required: 'Please enter password',
            minLength: {
              value: 6,
              message: 'Password must be more than 5 characters',
            },
          })}
        />
        {errors.password?.message && (
          <div className='text-red-500'>{errors.password.message}</div>
        )}
      </div>
      <div className='mb-4'>
        <label htmlFor='password'>Confirm Password</label>
        <input
          type='password'
          className='w-full'
          id='confirmPassword'
          {...register('confirmPassword', {
            required: 'Please confirm password.',
            validate: value => value === getValues('password'),
            minLength: {
              value: 6,
              message: 'Passwords must match.',
            },
          })}
        />
        {errors.confirmPassword && (
          <div className='text-red-500'>
            {errors.confirmPassword.message}
          </div>
        )}
        {errors.confirmPassword?.message &&
          errors.confirmPassword.type === 'validate' && (
            <div className='text-red-500'>Passwords do not match</div>
          )}
      </div>
      <div className='mb-4'>
        <button className='primary-button'>Register</button>
      </div>
      <div>
        Already have an account? &nbsp;
        <Link href={'/login'}>Login</Link>
      </div>
    </form>
  )
}

export default Registration
