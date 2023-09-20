import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./QuestionBank.css";
import { Question } from './types';
import { getQuestions, addQuestion, deleteQuestion, updateQuestion } from './fetchData'
import AddQuestionForm from './AddQuestionForm';

const allCategories = [
    'Arrays', 'Strings', 'Hash Table', 'Math', 'Dynamic Programming',
    'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search',
    'Databases', 'Breadth-First Search', 'Tree', 'Matrix', 
    'Two Pointers', 'Binary Tree', 'Bit Manipulation', 'Heap (Priority Queue)',
    'Stack', 'Prefix Sum', 'Graph', 'Simulation', 'Design',
    'Counting', 'Backtracking', 'Queue', 'Algorithms', 'Data Structures',
    'Recursion', 'Brainteaser', 'Others'
]

const QuestionBank: React.FC = () => {
    // State to store the list of questions
    const [questions, setQuestions] = useState<Question[]>([]); 
    const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
    const [updatingQuestionId, setUpdatingQuestionId] = useState<number | null>(null);

    const [newQuestion, setNewQuestion] = useState({
        title: '',
        description: '',
        category: [] as string[],
        complexity: 'Easy' as 'Easy' | 'Medium' | 'Hard' // default value
    });

    const navigate = useNavigate();

    // These are to reset selection field, otherwise it will display strange stuff
    const [selectedCategory, setSelectedCategory] = useState("");
    const [updateSelectedOption, setUpdateSelectedOption] = useState("");

    // Create refs outside the map
    const titleRef = React.createRef<HTMLInputElement>();
    // const categoryRef = React.createRef<HTMLInputElement>();
    const complexityRef = React.createRef<HTMLSelectElement>();
    const descriptionRef = React.createRef<HTMLTextAreaElement>();

    // functions to fetch all questions and update UI
    const fetchQuestions = async () => {
        const fetchedQuestions = await getQuestions();
        setQuestions(fetchedQuestions);
    }

    // fetch when component mounts
    useEffect(() => {
        fetchQuestions();
    }, [])

    const handleSignout = () => {
        navigate('/login');
    }

    const toggleQuestionDetails = (id: number) => {
        setExpandedQuestionId(expandedQuestionId === id ? null : id);
    };

    // adding a new question
    const handleAddQuestion = async (newQuestion: Partial<Question>) => {
        await addQuestion(newQuestion);
        fetchQuestions();
    };

    const handleDeleteQuestion = async (id: number) => {
        await deleteQuestion(id);
        fetchQuestions();
    }

    const handleUpdateQuestion = async (updatedQuestion: Question, id: string | number) => {
        await updateQuestion(updatedQuestion, id);
        fetchQuestions();
    }

    const updateExistingCategoryArray = (qustionId: number, category: string, action: 'add' | 'remove') => {
        const index = questions.findIndex(q => q.id === qustionId);

        if (index != -1) {
        const updatedQuestions = [...questions];
        const question = { ... updatedQuestions[index]};

        if (action == 'add') {
            question.category.push(category);
        } else {
            question.category = question.category.filter(cat => cat != category);
        }

        // trigger a re-render to show the current question tags
        // limit this to ONLY the current question!
        updatedQuestions[index] = question;
        setQuestions(updatedQuestions);
        }
    }
  

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
                                        <label>Description</label>
                                        <textarea ref={descriptionRef} defaultValue={question.description}></textarea>
                                    </div>
                                    <div>
                                        <label>Category</label>

                                        <div>
                                        {question.category.map((cat, index) => (
                                        <span key={index}>
                                            {cat}
                                            <button onClick={() => updateExistingCategoryArray(question.id, cat, 'remove')}>X</button>
                                        </span>
                                        ))}
                                        </div>
                                        <select 
                                        value={updateSelectedOption} // explicitly set the value
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            updateExistingCategoryArray(question.id, newValue, 'add');
                                            setUpdateSelectedOption("");  // reset the selected option
                                        }}
                                        >
                                        <option value="" disabled>Select your option</option>
                                        {allCategories.filter(cat => !question.category.includes(cat)).map((cat, index) => (
                                            <option key={index} value={cat}>{cat}</option>
                                        ))}
                                        </select>

                                        {/* <input ref={categoryRef} type="text" defaultValue={question.category} /> */}
                                    </div>
                                    <div>
                                        <label>Complexity</label>
                                        <select ref={complexityRef} defaultValue={question.complexity}>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <button className='action-button' onClick={() => setUpdatingQuestionId(null)}>Cancel</button>
                                <button className='action-button' onClick={() => {
                                const updatedTitle = titleRef.current?.value || "";
                                // const updatedCategory = categoryRef.current?.value || "";
                                const updatedComplexity = complexityRef.current?.value as 'Easy' | 'Medium' | 'Hard'; // type assertion
                                const updatedDescription = descriptionRef.current?.value || ""; // New line
                                
                                const updatedQuestion = {
                                    id: question.id,
                                    title: updatedTitle,
                                    category: question.category, // already updated in-place
                                    complexity: updatedComplexity,
                                    description: updatedDescription // New field
                                };
                                
                                handleUpdateQuestion(updatedQuestion, question.id);
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
                        <td className='center-align-cell'>{question.category.join(', ')}</td>
                        <td className='center-align-cell'>{question.complexity}</td>
                        <td>
                            <button className='action-button' onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
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
        
        <AddQuestionForm
            newQuestion={newQuestion}
            allCategories={allCategories}
            selectedCategory={selectedCategory}
            setNewQuestion={setNewQuestion}
            handleAddQuestions={handleAddQuestion}
            setSelectedCategory={setSelectedCategory}
        />
        </div>
    );
};

export default QuestionBank;