import express from "express";
import fs from "fs";
import path from "path"; // for reading file

const app = express();
const port = 3001;

interface Question {
  id: number;
  title: string;
  description: string;
  category: string;
  complexity: string;
}

// Enable CORS for all routes (Not recommended for production)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'data/images')));

app.use(express.json())

app.get('/questions', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/sampleQuestions.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('An error occurred');
    }
    return res.json(JSON.parse(data));
  });
});

// allow addition into question bank
app.post('/addQuestion', (req, res) => {
  const newQuestion: Partial<Question> = req.body;
  const questions: Question[] = JSON.parse(fs.readFileSync('data/sampleQuestions.json', 'utf8'));

  // Generate a new ID for the question
  newQuestion.id = questions.length ? Math.max(...questions.map((q: Question) => q.id)) + 1 : 1;

  // Add the new question
  questions.push(newQuestion as Question);

  // Save back to the JSON file
  fs.writeFileSync('data/sampleQuestions.json', JSON.stringify(questions, null, 2));
  res.status(201).send('New question added');
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});