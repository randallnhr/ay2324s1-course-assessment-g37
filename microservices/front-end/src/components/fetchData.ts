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
    if (!newQuestion.category || newQuestion.category.length == 0) {
        newQuestion.category = ["Others"];
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

export const deleteQuestion = async (id: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        fetch(`/api/questions/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            resolve();  // Resolve the promise without any value
        })
        .catch((error) => {
            reject(error);  // Reject the promise if an error occurs
        });
    });    
};

export const updateQuestion = async (updatedQuestion: Question, id: string | number): Promise<void> => {
    // Empty field check
    return new Promise<void>((resolve, reject) => {
        (async () => {
            // Empty field check
            if (!updatedQuestion.title || !updatedQuestion.description) {
                alert('Question title and description cannot be empty.');
                reject('Empty field');
                return;
            }

            if (!updatedQuestion.category || updatedQuestion.category.length === 0) {
                updatedQuestion.category = ["Others"];
            }

            try {
                // Do the duplicate check
                const res = await fetch('/api/questions');
                const existingQuestions: Question[] = await res.json();
                
                const duplicate = existingQuestions.find(
                    q => q.title == updatedQuestion.title && q.id !== updatedQuestion.id
                );
                
                if (duplicate) {
                    alert("Question with this title already exists.");
                    reject('Duplicate question');
                    return;
                }
                
                await fetch(`/api/questions/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedQuestion),
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        })();
    });
};


