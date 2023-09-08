import React, { useEffect, useState } from 'react';

// Need to define a Question type. ? = optional fields
interface Question {
    id: number;
    title: string;
    description: string;
    category: string;
    complexity: string;
}

const QuestionBank: React.FC = () => {
  // State to store the list of questions
  const [questions, setQuestions] = useState<Question[]>([]); 
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    category: '',
    complexity: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/questions')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const toggleQuestionDetails = (id: number) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  // newQuestion only have 4 fields, unlike Question have 5, need to use Partial
  const addQuestion = (newQuestion: Partial<Question>) => {
    fetch('http://localhost:3001/addQuestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newQuestion),
    })
    .then(() => {
      // Re-fetch questions to update UI
      return fetch('http://localhost:3001/questions');
    })
    .then((res) => res.json())
    .then((data) => setQuestions(data));
  };

  const deleteQuestion = (id: number) => {
    fetch(`http://localhost:3001/questions/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      // Re-fetch questions to update UI
      return fetch('http://localhost:3001/questions');
    })
    .then((res) => res.json())
    .then((data) => setQuestions(data));
  };
  

  return (
    <div>
      <h1>Question Bank</h1>
      <table>
        <thead>
            <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Complexity</th>
            <th>Actions</th> {/* New column header */}
            </tr>
        </thead>
        <tbody>
            {questions.map((question) => (
            <React.Fragment key={question.id}>
                <tr>
                    <td>
                        <button onClick={() => toggleQuestionDetails(question.id)}>
                        {question.title}
                        </button>
                    </td>
                    <td>{question.category}</td>
                    <td>{question.complexity}</td>
                    <td> {/* New table cell for actions */}
                        <button onClick={() => deleteQuestion(question.id)}>Delete</button>
                        <button>Update</button>
                    </td>
                </tr>
                {expandedQuestionId === question.id && (
                <tr>
                    <td colSpan={4}> {/* Updated colspan */}
                        <div
                            dangerouslySetInnerHTML={{ __html: question.description }}
                        ></div>
                    </td>
                </tr>
                )}
            </React.Fragment>
            ))}
        </tbody>
        </table>

      {/* Create new Questions */}
      <h2>Add a New Question</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        addQuestion(newQuestion);
      }}>
        <div>
          <label>Title</label>
          <input type="text" value={newQuestion.title} onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })} />
        </div>
        <div>
          <label>Description</label>
          <textarea value={newQuestion.description} onChange={e => setNewQuestion({ ...newQuestion, description: e.target.value })}></textarea>
        </div>
        <div>
          <label>Category</label>
          <input type="text" value={newQuestion.category} onChange={e => setNewQuestion({ ...newQuestion, category: e.target.value })} />
        </div>
        <div>
          <label>Complexity</label>
          <input type="text" value={newQuestion.complexity} onChange={e => setNewQuestion({ ...newQuestion, complexity: e.target.value })} />
        </div>
        <button type="submit">Add Question</button>
      </form>

    </div>
  );
};

export default QuestionBank;