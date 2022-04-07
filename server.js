// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '8c0c4acdc99f4c5292fcd860792a54d9',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
    rollbar.log('someone requested a student list')
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
           res.status(400).send('You must enter a name.')
       } else {
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
       rollbar.error(`${err} triggered in the post request to /api/students `)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
    rollbar.log('someone deleted student')
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
