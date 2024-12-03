import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const client = await clientPromise
    const db = client.db("simple-website")

    // Check if admin already exists
    const existingAdmin = await db.collection("admins").findOne({ email })
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new admin
    await db.collection("admins").insertOne({ email, password: hashedPassword })

    return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

