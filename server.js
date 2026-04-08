const express = require('express');
const path = require('path');

const app = express();
const fs = require('fs');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/slike', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'images');
    const files = fs.readdirSync(folderPath);

    const images = files.map((file, index) => ({
        url: `/images/${file}`,
        title: `Slika ${index + 1}`
    }));

    res.render('slike', { images });
});

app.listen(PORT, () => {
    console.log(`Server radi na portu ${PORT}`);
});