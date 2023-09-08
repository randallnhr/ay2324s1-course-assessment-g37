import express from "express";
import fs from "fs";
import path from "path"; // for reading file

const app = express();
const port = 3001;

// Enable CORS for all routes (Not recommended for production)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'data/images')));

app.get('/questions', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/sampleQuestions.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('An error occurred');
    }
    return res.json(JSON.parse(data));
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});