import React, { useEffect, useState } from 'react';
import "./QuestionBank.css";

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
  const [updatingQuestionId, setUpdatingQuestionId] = useState<number | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    category: '',
    complexity: ''
  });

  // Create refs outside the map
  const titleRef = React.createRef<HTMLInputElement>();
  const categoryRef = React.createRef<HTMLInputElement>();
  const complexityRef = React.createRef<HTMLSelectElement>();
  const descriptionRef = React.createRef<HTMLTextAreaElement>();

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

  const updateQuestion = (updatedQuestion: Question, id: string | number) => {
    // Assume your backend has an API endpoint to update a question at `http://localhost:3001/updateQuestion`
    fetch(`http://localhost:3001/updateQuestion`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedQuestion),
    })
    .then(() => fetch('http://localhost:3001/questions'))
    .then((res) => res.json())
    .then((data) => {
      setQuestions(data);
      setUpdatingQuestionId(null);
    });
  };
  

  return (
    <div>
      <h1>Question Bank</h1>
      <table>
            <thead>
                <tr>
                <th className='table-header'>Title</th>
                <th className='table-header'>Category</th>
                <th className='table-header'>Complexity</th>
                <th className='table-header'>Actions</th>
                </tr>
            </thead>
            <tbody>
            {questions.map((question) => (
                <React.Fragment key={question.id}>
                {updatingQuestionId === question.id ? (
                    <tr>
                        <td colSpan={3}>
                            <div className='update-form'>
                                <div>
                                    <label>Title</label>
                                    <input ref={titleRef} type="text" defaultValue={question.title} />
                                </div>
                                <div>
                                    <label>Category</label>
                                    <input ref={categoryRef} type="text" defaultValue={question.category} />
                                </div>
                                <div>
                                    <label>Complexity</label>
                                    <select ref={complexityRef} defaultValue={question.complexity}>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Description</label>
                                    <textarea ref={descriptionRef} defaultValue={question.description}></textarea>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button className='action-button' onClick={() => setUpdatingQuestionId(null)}>Cancel</button>
                            <button className='action-button' onClick={() => {
                            const updatedTitle = titleRef.current?.value || "";
                            const updatedCategory = categoryRef.current?.value || "";
                            const updatedComplexity = complexityRef.current?.value || "";
                            const updatedDescription = descriptionRef.current?.value || ""; // New line
                            
                            const updatedQuestion = {
                                id: question.id,
                                title: updatedTitle,
                                category: updatedCategory,
                                complexity: updatedComplexity,
                                description: updatedDescription // New field
                            };
                            
                            updateQuestion(updatedQuestion, question.id);
                            setUpdatingQuestionId(null);
                            }}>Save</button>
                        </td>
                    </tr>
                ) : (
                    <tr>
                    <td>
                        <button onClick={() => toggleQuestionDetails(question.id)}>
                        {question.title}
                        </button>
                    </td>
                    <td className='center-align-cell'>{question.category}</td>
                    <td className='center-align-cell'>{question.complexity}</td>
                    <td>
                        <button className='action-button' onClick={() => deleteQuestion(question.id)}>Delete</button>
                        <button className='action-button' onClick={() => setUpdatingQuestionId(question.id)}>Update</button> {/* Fixed */}
                    </td>
                    </tr>
                )}
                {expandedQuestionId === question.id && (
                    <tr>
                    <td colSpan={4}>
                        <div dangerouslySetInnerHTML={{ __html: question.description }}></div>
                    </td>
                    </tr>
                )}
                </React.Fragment>
            ))}
            </tbody>
      </table>

      {/* Create new Questions */}
      <h2 className='add-header'>Add a New Question</h2>
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
          <select value={newQuestion.complexity} onChange={e => setNewQuestion({ ...newQuestion, complexity: e.target.value })}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <button className='action-button' type="submit">Add Question</button>
      </form>

    </div>
  );
};

export default QuestionBank;