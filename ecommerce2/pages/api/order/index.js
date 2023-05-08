// api/order/

import db from '../../../utils/db'
import Order from '../../../models/Order'

export default async function handler(req, res) {
  const orderDetails = req.body
  const user = orderDetails.session
  console.log(orderDetails)

  if (!user) {
    return res.status(401).send('sign in required')
  }

  await db.connect()
  const newOrder = new Order({
    ...orderDetails,
    user: user._id,
  })

  const order = await newOrder.save()
  await db.disconnect()
  res.status(200).json(order)
}
