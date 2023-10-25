import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/Users.js'
import questionRoutes from './routes/Questions.js'
import answerRoutes from './routes/Answer.js'

const app = express();
dotenv.config();
app.use(express.json({limit: '30mb', extended: true}))
app.use(express.urlencoded({limit: '30mb', extended: true}))
app.use(cors());


app.get('/', (req, res) => {
    res.send("This is a stack Overflow Clone API")
})


app.use('/user', userRoutes)
app.use('/questions', questionRoutes)
app.use('/answer', answerRoutes)



const PORT = process.env.PORT || 5000
const DATABASE_URL = process.env.CONNECTION_URL

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => app.listen(PORT, () => {console.log(`Sever running on port ${PORT}`)}) )
    .catch( (err) => console.log(err.message) )