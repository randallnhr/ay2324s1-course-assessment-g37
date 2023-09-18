import React from 'react';
import { Question } from './types';

// React.dispatch = a funciton to dispatch actions
// SetStateAction = set or update current state
// interface = define a contract. Includes value + function
interface QuestionFormProps {
    newQuestion: Partial<Question>;
    allCategories: string[];
    selectedCategory: string;
    setNewQuestion: React.Dispatch<React.SetStateAction<Partial<Question>>>;
    addQuestion: (question: Partial<Question>) => void;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const AddQuestionForm: React.FC<QuestionFormProps> = ({
    newQuestion,
    allCategories,
    selectedCategory,
    setNewQuestion,
    addQuestion,
    setSelectedCategory
    // Using destructuring to extract the properties form props
}) => {
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            addQuestion(newQuestion);
            setNewQuestion({
                title: '',
                description: '',
                category: [],
                complexity: 'Easy'
            });
        }}>
            <div>
                <label>Title</label>
                <input type="text" value={newQuestion.title} 
                onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })} />
            </div>
            <div>
                <label>Description</label>
                <textarea value={newQuestion.description} 
                onChange={e => setNewQuestion({ ...newQuestion, description: e.target.value })}></textarea>
            </div>
            <div>
                <label>Category</label>
                <div>
                    {/* take all the current categories, and display them one by one (start from an empty array) */}
                    {/* Here map and filter will only be called if category exists */}
                    {newQuestion.category?.map((cat, index) => (
                    // display each category followed by 'X'. Click X will remove the category
                    <span key = {index}>
                        {cat} <button type = "button" onClick={() => setNewQuestion(
                        // in a form, button can be by default "submit". Here need to specify type, in case it just submit the form
                        prev => ({...prev, category: prev.category?.filter(
                            c => c != cat
                        )})
                        )}>X</button>
                    </span>
                    ))}
                    {/* drop-down list to add new categories. Only those not already added will be displayed */}
                    <select 
                    value={selectedCategory}
                    onChange={(e) => {
                        setNewQuestion(prev => ({
                        ...prev, 
                        category: [...(prev.category || []), e.target.value]
                        }));

                        // Reset the selected value
                        setSelectedCategory("");
                    }}
                    >
                    <option value="" disabled selected>Select your option</option>
                    {allCategories.filter(cat => !(newQuestion.category || []).includes(cat)).map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                    </select>
                </div>       
                {/* <input type="text" value={newQuestion.category} onChange={e => setNewQuestion({ ...newQuestion, category: e.target.value })} /> */}
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
    );
};

export default AddQuestionForm;
