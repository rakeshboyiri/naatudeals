import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const client = await clientPromise
  const db = client.db("simple-website")
  const admin = await db.collection("admins").findOne({ email })

  if (admin && await bcrypt.compare(password, admin.password)) {
    const response = NextResponse.json({ success: true })
    await cookies().set('admin_token', 'authenticated', { httpOnly: true })
    return response
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}

