// /api/orders/:id
import { getToken } from 'next-auth/jwt'
import Order from '../../../../models/Order'
import db from '../../../../utils/db'

const handler = async (req, res) => {
  const user = await getToken({ req })
  console.log('WAS RAN')
  if (!user) {
    return res.status(401).send('signin required')
  }

  await db.connect()

  const order = await Order.findById(req.query.id)
  await db.disconnect()
  res.send(order)
}

export default handler
