// Returns JSON object to frontend so that can display all products

import Product from '../../../models/Product'
import db from '../../../utils/db'

export default async function handler(req, res) {
  try {
    await db.connect()
    const { slug } = req.query
    const product = await Product.findOne({ slug: slug })

    if (!product) {
      await db.disconnect()
      return res.status(404).json('Product does not exist')
    }
    await db.disconnect()
    res.status(200).json(product)
  } catch (error) {
    res.status(400).json({ error })
  }
}
