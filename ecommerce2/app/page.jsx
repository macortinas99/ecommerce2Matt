import Footer from './components/Footer'
import Header from './components/Header'
import data from '../utils/data.js'
import ProductItem from './components/ProductItem'

export default function Page() {
  return (
    <div className=''>
      {/* <Header /> */}
      <div className='container m-auto mt-4'>Home Page</div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {data.products.map(product => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
      {/* <Footer /> */}
    </div>
  )
}
