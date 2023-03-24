'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import data from '../../utils/data.js'
import Link from 'next/link.js'
import Image from 'next/image.js'

const ProductDetails = () => {
  //   const router = useRouter()
  //   const { slug } = router.query
  const searchParams = useSearchParams()

  const slug = searchParams.get('slug')

  console.log(slug)
  const product = data.products.find(x => x.slug === slug)
  if (!product) {
    return <div>Product Not Found</div>
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
            <button className='primary-button w-full'>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
