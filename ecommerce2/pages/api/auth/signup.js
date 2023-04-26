import User from '../../../models/User'
import db from '../../../utils/db'
import bcryptjs from 'bcryptjs'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  const { name, email, password } = req.body
  //   Makes sure all parameters exist and meet requirements
  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(4222).json({
      message: 'Validation error',
    })
    return
  }

  await db.connect()

  //   Checks for existing user
  const existingUser = await User.findOne({ email: email })
  if (existingUser) {
    res.status(422).json({ message: 'User already exists' })
    await db.disconnect()
    return
  }
  // If user doesn't exist creates new user in the DB
  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  })

  const user = await newUser.save()
  await db.disconnect()

  res.status(201).json({
    message: 'Created User!',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  })
}

export default handler
