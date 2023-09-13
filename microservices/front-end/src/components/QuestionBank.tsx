import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./QuestionBank.css";

// Need to define a Question type. ? = optional fields
interface Question {
    id: number;
    title: string;
    description: string;
    category: string;
    complexity: 'Easy' | 'Medium' | 'Hard';
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
    complexity: 'Easy' as 'Easy' | 'Medium' | 'Hard' // default value
  });

  const navigate = useNavigate();

  // Create refs outside the map
  const titleRef = React.createRef<HTMLInputElement>();
  const categoryRef = React.createRef<HTMLInputElement>();
  const complexityRef = React.createRef<HTMLSelectElement>();
  const descriptionRef = React.createRef<HTMLTextAreaElement>();

  useEffect(() => {
    fetch('/api/questions')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleSignout = () => {
    navigate('/login');
  }

  const toggleQuestionDetails = (id: number) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  // newQuestion only have 4 fields, unlike Question have 5, need to use Partial
  const addQuestion = (newQuestion: Partial<Question>) => {
    // First fetch all questions to check for duplicates
    fetch('/api/questions')
    .then((res) => res.json())
    .then((existingQuestions: Question[]) => {
      const duplicate = existingQuestions.find(q => q.title === newQuestion.title);
      if (duplicate) {
        alert('Question with this title already exists.');
        return;
      }

      // If no duplicates, proceed to add question
      fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      })
      .then(() => fetch('/api/questions')) // re-fetch questions, update UI
      .then((res) => res.json())
      .then((data) => setQuestions(data));
    });
  };

  const deleteQuestion = (id: number) => {
    fetch(`/api/questions/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      // Re-fetch questions to update UI
      return fetch('/api/questions');
    })
    .then((res) => res.json())
    .then((data) => setQuestions(data));
  };

  const updateQuestion = (updatedQuestion: Question, id: string | number) => {
    // Do the check first
    fetch('/api/questions')
    .then((res) => res.json())
    .then((existingQuestions: Question[]) => {
      const duplicate = existingQuestions.find(
        q => q.title == updatedQuestion.title
      );
      if (duplicate) {
        alert("Question with this title already exists. ");
        return;
    }

      fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuestion),
      })
      .then(() => fetch('/api/questions'))
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setUpdatingQuestionId(null);
      });
    });
  };
  

  return (
    <div>
      <div className='header-container'>
        <h1>Question Bank</h1>
        <button onClick={handleSignout}>Sign Out</button>
      </div>
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
                            const updatedComplexity = complexityRef.current?.value as 'Easy' | 'Medium' | 'Hard'; // type assertion
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
          <select value={newQuestion.complexity as 'Easy' | 'Medium' | 'Hard'} 
          onChange={e => setNewQuestion({ ...newQuestion, 
          complexity: e.target.value as 'Easy' | 'Medium' | 'Hard' })}>
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