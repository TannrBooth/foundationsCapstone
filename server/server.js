const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('client'))

console.log(__dirname)

let {
createColor,
getColors,
deleteColor
} = require('./controller.js')

app.get('/', (req,res) => {
    res.status(200).sendFile(path.join(__dirname,'../client/index.html'))
})

app.post('/api/colors', createColor)
app.delete('/api/colors/:id', deleteColor)
app.get('/api/colors/', getColors)



app.listen(4000, console.log(`Server running on localhost:4000`))