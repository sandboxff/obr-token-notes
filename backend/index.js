const express = require('express')
const app = express()
app.use(express.json())

const upload = require('./middleware/upload')
const fs = require('fs')
const { log } = require('console')
const dir = './localData/'

fs.access(dir, (err) => {
    if(err) {
        fs.mkdirSync(dir)
    } else {

    }
})

app.get('/:id', (req, res) => {
    deletionFlag = false
    fs.readFile(dir + req.params.id, (err, data) => {
        if (err) {
            res.status(404)
            res.send('')
        } else {
            res.send(data)
        }
    })
    deletionFlag = true
})

app.get('/attachment/:id', (req, res) => {
    fs.readdir(dir, async (error, files) => {
        if (error) {
            return console.error(error)
        }
        const attachments = []
        files.forEach((file) => {
            if (file != req.params.id && file.includes(req.params.id)) {
                const data = fs.readFileSync('./localData/' + file, (error) => {
                    if (error) {
                        return console.error(error)
                    }
                    
                })
                attachments.push(new Buffer.from(data, 'base64').toString('base64'))
            }
        })
        
        res.send({attachments: attachments})
    })
})

app.post('/', (req, res) => {
    fs.writeFile(dir + req.body.id, req.body.content, 'utf8', (err) => {
        if (err) {
            res.status(400)
        } else {
            res.status(200)
            res.send('Data successfuly saved')
        }
    })
})

app.post('/attachment', upload.single('file'), (req, res) => {
    res.send('Attachment saved')
})

app.delete('/attachment', (req, res) => {
    console.log(req.body)
    try {
        fs.readdir('./localData', (error, files) => {
            if (error) {
                return console.error(error)
            }
            files.forEach((file) => {
                const fileStat = fs.statSync('./localData/' + file, (error) => {
                    if (error) {
                        console.error(error);
                    }
                })
                console.log(fileStat);
                if (file != req.body.id && file.includes(req.body.id)) {
                    fs.unlink('./localData/' + file, (error) => {
                        if (error) {
                            console.error(error);
                        }
                    })
                }
            })
        })
    } catch (error) {
        console.error(error)
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})