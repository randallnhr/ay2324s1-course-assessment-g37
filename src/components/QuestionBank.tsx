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

  useEffect(() => {
    fetch('http://localhost:3001/questions')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const toggleQuestionDetails = (id: number) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
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
              </tr>
              {expandedQuestionId === question.id && (
                <tr>
                  <td colSpan={3}>
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
    </div>
  );
};

export default QuestionBank;