// /api/orders/:id
import db from '../../../../utils/db'
import Order from '../../../../models/Order'

export default async function handler(req, res) {
  const session = req.body
  const query = req.query.id

  if (!session) {
    return res.status(401).send('sign in required')
  }

  await db.connect()
  const order = await Order.findById(query)
  await db.disconnect()
  console.log('ORDER', order)
  if (order) {
    res.status(200).json(order)
  }
}
