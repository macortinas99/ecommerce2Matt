import CheckoutWizard from '../components/CheckoutWizard'
import PlaceOrder from '../components/PlaceOrder'

function Page() {
  return (
    <div>
      <CheckoutWizard activeStep={3} />
      <h1 className='mb-4 text-xl'>Place Order</h1>
      <PlaceOrder />
    </div>
  )
}

export default Page
