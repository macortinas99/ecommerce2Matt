import React from 'react'
import ProductDetails from '../components/ProductDetails'

const page = async ({ searchParams }) => {
  const { slug } = searchParams

  // send API request to get product data
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getProduct?slug=${slug}`)
  const product = await res.json()
  return (
    <div>
      <ProductDetails product={product} />
    </div>
  )
}

export default page
