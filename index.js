const express = require('express');
const body = require('body-parser');
const app = express();
//const { Pool } = require('pg');
app.use(express.static('public'));
app.use(body.urlencoded({ extended: false }));
app.use(body.json());

app.get('/', (req, res) => {
    res.render('index.html')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server started on ' + PORT);
});