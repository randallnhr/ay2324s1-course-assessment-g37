// This file should be in charge of API calls
// For the Question type, need to have a shared type file!
import { Question } from "./types";

// originally directly fetch then update, deep coupling
// Now return a promise, let it de-couples from UI update
// Remove both re-fetching (let the getQuestions handle) and set
export const getQuestions = async (): Promise<Question[]> => {
    return fetch('/api/questions')
        .then(res => res.json());
}

export const addQuestion = async (newQuestion: Partial<Question>) => {
    // empty field check
    if (!newQuestion.title || !newQuestion.description) {
        alert('Question title and description cannot be empty.');
        return;
    }
    // set to others if no category
    if (!newQuestion.categories || newQuestion.categories.length == 0) {
        newQuestion.categories = ["Others"];
    }

    // First fetch all questions to check for duplicates
    return fetch('/api/questions')
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
        });
        // remove the UI updates, return new list of questions fetched from the backend
    });
};

// When using asnc, generally do not need to explicitly create a new Promise
// Can use tr catch
export const deleteQuestion = async (id: string): Promise<void> => {
    try {
        await fetch(`/api/questions/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error(error);
    }
};

export const updateQuestion = async (updatedQuestion: Question, id: string | number): Promise<void> => {
    // Empty field check
    if (!updatedQuestion.title || !updatedQuestion.description) {
        alert('Question title and description cannot be empty.');
        return;
    }

    if (!updatedQuestion.categories || updatedQuestion.categories.length === 0) {
        updatedQuestion.categories = ["Others"];
    }

    // the try catch block itself is a Promise
    try {
        // Do the duplicate check
        // the code will wait here, until the await unciton finishes
        const res = await fetch('/api/questions');
        const existingQuestions: Question[] = await res.json();
        
        const duplicate = existingQuestions.find(
            q => q.title == updatedQuestion.title && q._id !== updatedQuestion._id
        );
        
        if (duplicate) {
            alert("Question with this title already exists.");
            return;
        }

        await fetch(`/api/questions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedQuestion),
        });      
    } catch (error) {
        console.error(error);
    }
};


