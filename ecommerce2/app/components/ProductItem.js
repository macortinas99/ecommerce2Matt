/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import Image from 'next/image'

export default function ProductItem({ product }) {
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
        <button className='primary-button' type='button'>
          Add to cart
        </button>
      </div>
    </div>
  )
}
