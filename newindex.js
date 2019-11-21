var serialize = require('node-serialize');
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () =>{
 console.log(`Example app listening on port ${port}!`)
var objS = serialize.serialize(app);
 console.log(objS)

})


