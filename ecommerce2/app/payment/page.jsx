import React from 'react'
import CheckoutWizard from '../components/CheckoutWizard'
import PaymentSelection from '../components/PaymentSelection'

function page() {
  return (
    <div>
      <CheckoutWizard activeStep={2} />
      <PaymentSelection />
    </div>
  )
}

export default page
