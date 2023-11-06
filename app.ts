import express from 'express'
import 'dotenv/config'
import { initializeApp, applicationDefault } from 'firebase-admin/app'
import userRoutes from './src/routes/userRoutes'

process.env.GOOGLE_APPLICATION_CREDENTIALS

const app = express()
app.use(express.json())

// Firebase
initializeApp({
  credential: applicationDefault(),
  projectId: 'proteoapp',
})

// Routes
app.use('/api/user', userRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Working on port ${ port }`)
})