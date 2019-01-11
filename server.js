const express = require('express');
const path = require('path');
const app = express();
const port = 8443;

app.use(express.static('dist'));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './dist/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
});

app.listen(port, () => console.log(`Triam app listening on port ${port}!`));