import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import http from "http"

import { MONGO_USER, MONGO_PASSWORD, CLUSTER_URL, DATABASE, PORT } from "./config.js"
import userRoutes from "./routers/user.js"
import authRoutes from "./routers/auth.js"

const app = express()

const httpServer = http.createServer(app)

const connectToMongoDB = async () => {
  await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${CLUSTER_URL}/${DATABASE}?retryWrites=true&w=majority`)
    .then(async () => {
      console.log("Connected to MongoDB")
    }).catch(async (error) => {
      await console.log(`Get errors while connected to MongoDB, error: ${error}`)
      await connectToMongoDB()
    })
}

await connectToMongoDB()

app.use(cors({ credentials: true, origin: true }))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set('trust proxy', 1)

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept, Authorization")
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    return res.status(200).json({})
  }
  next()
})

app.use("/api", authRoutes)
app.use("/api/user", userRoutes)

app.use((req, res, next) => {
  const error = new Error(`There is no url of ${req.originalUrl} with ${req.method} method.`)
  res.status(404)
  next(error)
})

const port = PORT || 8080

const server = httpServer.listen(port, () => {
  console.log(`Server has started on port ${port}`)
})