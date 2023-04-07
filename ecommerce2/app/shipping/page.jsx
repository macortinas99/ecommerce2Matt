import React from 'react'
import CheckoutWizard from '../components/CheckoutWizard'
import ShippingForm from '../components/ShippingForm'

export default function page() {
  return (
    <div>
      <CheckoutWizard activeStep={1} />
      <ShippingForm />
    </div>
  )
}
