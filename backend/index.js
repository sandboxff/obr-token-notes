const express = require('express')
const app = express()
app.use(express.json())

const fs = require('fs')
const dir = './localData/'

fs.access(dir, (err) => {
    if(err) {
        fs.mkdirSync(dir)
    } else {

    }
})

app.get('/:id', (req, res) => {
    fs.readFile(dir + req.params.id, (err, data) => {
        if (err) {
            res.status(404)
            res.send('')
        } else {
            res.send(data)
        }
    })
})

app.post('/', (req, res) => {

    console.log(req.body)
    fs.writeFile(dir + req.body.id, req.body.content, 'utf8', (err) => {
        if (err) {
            res.status(400)
        } else {
            res.status(200)
            res.send('Data successfuly saved')
        }
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})