// Returns JSON objec to frontend so that can display all products

import Product from '../../../models/Product'
import db from '../../../utils/db'

export default async function handler(req, res) {
  await db.connect()
  const products = await Product.find()
  await db.disconnect()

  res.status(200).json({ products })
}
