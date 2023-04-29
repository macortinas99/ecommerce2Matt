import Footer from './components/Footer'
import Header from './components/Header'
import data from '../utils/data.js'
import ProductItem from './components/ProductItem'

export default async function Page() {
  // get product data from API call
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getProducts`
  )
  const { products } = await res.json()

  return (
    <div className=''>
      {/* <Header /> */}
      <div className='container m-auto mt-4'>Home Page</div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map(product => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
      {/* <Footer /> */}
    </div>
  )
}
