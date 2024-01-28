const express = require('express')
const bodyParser = require('body-parser')
const eventRoutes = require('./routes/events')

const app = new express();
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000;

//rotues

app.use('/events', eventRoutes);


app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
})