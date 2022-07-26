const express = require('express')
const usuarios = require('./login')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const clientes = require('./clientes')

app.use(express.urlencoded({extended: false}))
app.use(express.json()) 
app.use(cors())
app.use('/usuarios',usuarios)
app.use('/clientes', clientes)

app.listen(port, () => {console.log(`executando em http://localhost:5500`)})