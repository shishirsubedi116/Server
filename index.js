const express = require('express')
const app = express()
const port = process.env.PORT  || 5000
const cors = require('cors')
require('dotenv').config()

require('./db/connection')

app.use(express.json())
app.use(cors())
app.use('/public', express.static('public'))


app.use('/api/auth', require('./routers/auth'))
app.use('/api/food', require('./routers/food'))
app.use('/api/order', require('./routers/order'))
app.use('/api/admin/food', require('./routers/admin/food'))
app.use('/api/admin/order', require('./routers/admin/order'))

app.get('/', (req, res)=>{
    res.send('Server Started...')
})

app.listen(port, ()=>{
    console.log('Server running...');
})