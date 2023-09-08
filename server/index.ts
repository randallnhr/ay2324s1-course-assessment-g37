import express from "express";
const app = express();
const port = 3001;

// Sample data
const questions = [
  {
    id: 1,
    title: 'Sample Question 1',
    description: 'This is a sample question 1 description.',
    category: 'Category 1',
    complexity: 'Easy',
  },
];

// Enable CORS for all routes (Not recommended for production)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/questions', (req, res) => {
  res.json(questions);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});