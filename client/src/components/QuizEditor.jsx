import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://kambaz-quizzes.onrender.com/api/quizzes';

function QuizEditor() {
  const [quiz, setQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setQuiz(response.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/${id}`, quiz);
      alert('Quiz saved!');
      navigate(`/quizzes/${id}`);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleSaveAndPublish = async () => {
    try {
      quiz.published = true;
      await axios.put(`${API_URL}/${id}`, quiz);
      alert('Quiz saved and published!');
      navigate('/quizzes');
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleCancel = () => {
    navigate('/quizzes');
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      type: 'multiple-choice',
      title: '',
      question: '',
      points: 0,
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      blanks: [{ possibleAnswers: [] }]
    };
    setCurrentQuestion(newQuestion);
    setEditingQuestionIndex(quiz.questions.length);
  };

  const handleSaveQuestion = () => {
    const updatedQuestions = [...quiz.questions];
    if (editingQuestionIndex < quiz.questions.length) {
      updatedQuestions[editingQuestionIndex] = currentQuestion;
    } else {
      updatedQuestions.push(currentQuestion);
    }
    setQuiz({...quiz, questions: updatedQuestions});
    setCurrentQuestion(null);
    setEditingQuestionIndex(null);
  };

  const handleCancelQuestion = () => {
    setCurrentQuestion(null);
    setEditingQuestionIndex(null);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm('Delete this question?')) {
      const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
      setQuiz({...quiz, questions: updatedQuestions});
    }
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestion({...quiz.questions[index]});
    setEditingQuestionIndex(index);
  };

  const handleAddOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: '', isCorrect: false }]
    });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({...currentQuestion, options: updatedOptions});
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index][field] = value;
    setCurrentQuestion({...currentQuestion, options: updatedOptions});
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit Quiz</h2>
      
      <div style={styles.tabs}>
        <button 
          onClick={() => setActiveTab('details')}
          style={activeTab === 'details' ? styles.activeTab : styles.tab}
        >
          Details
        </button>
        <button 
          onClick={() => setActiveTab('questions')}
          style={activeTab === 'questions' ? styles.activeTab : styles.tab}
        >
          Questions
        </button>
      </div>

      {activeTab === 'details' && (
        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz({...quiz, title: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={quiz.description}
              onChange={(e) => setQuiz({...quiz, description: e.target.value})}
              style={styles.textarea}
              rows="4"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Points</label>
            <input
              type="number"
              value={quiz.points}
              onChange={(e) => setQuiz({...quiz, points: parseInt(e.target.value) || 0})}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={quiz.shuffleAnswers}
                onChange={(e) => setQuiz({...quiz, shuffleAnswers: e.target.checked})}
              />
              Shuffle Answers
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={quiz.timeLimit?.enabled}
                onChange={(e) => setQuiz({
                  ...quiz, 
                  timeLimit: {...quiz.timeLimit, enabled: e.target.checked}
                })}
              />
              Time Limit
            </label>
            {quiz.timeLimit?.enabled && (
              <input
                type="number"
                value={quiz.timeLimit?.minutes || 20}
                onChange={(e) => setQuiz({
                  ...quiz,
                  timeLimit: {...quiz.timeLimit, minutes: parseInt(e.target.value) || 20}
                })}
                style={{...styles.input, width: '100px', marginLeft: '10px'}}
                placeholder="Minutes"
              />
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Due Date</label>
            <input
              type="date"
              value={quiz.dueDate ? new Date(quiz.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setQuiz({...quiz, dueDate: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Available Date</label>
            <input
              type="date"
              value={quiz.availableDate ? new Date(quiz.availableDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setQuiz({...quiz, availableDate: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Until Date</label>
            <input
              type="date"
              value={quiz.untilDate ? new Date(quiz.untilDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setQuiz({...quiz, untilDate: e.target.value})}
              style={styles.input}
            />
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div>
          <button onClick={handleAddQuestion} style={styles.addQuestionButton}>
            + New Question
          </button>

          {!currentQuestion && quiz.questions.length === 0 && (
            <div style={styles.placeholder}>
              <p>No questions yet. Click "+ New Question" to add one.</p>
            </div>
          )}

          {!currentQuestion && quiz.questions.map((q, index) => (
            <div key={index} style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <span style={styles.questionTitle}>
                  Question {index + 1}: {q.title || 'Untitled'}
                </span>
                <div style={styles.questionActions}>
                  <button onClick={() => handleEditQuestion(index)} style={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteQuestion(index)} style={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
              <div style={styles.questionPreview}>
                <div><strong>Type:</strong> {q.type}</div>
                <div><strong>Points:</strong> {q.points}</div>
                <div><strong>Question:</strong> {q.question || 'No question text'}</div>
              </div>
            </div>
          ))}

          {currentQuestion && (
            <div style={styles.questionEditor}>
              <h3>{editingQuestionIndex < quiz.questions.length ? 'Edit Question' : 'New Question'}</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Question Type</label>
                <select
                    value={currentQuestion.type}
                    onChange={(e) => {
                        const newType = e.target.value;
                        const updatedQuestion = {...currentQuestion, type: newType};
    
                    if (newType === 'fill-blank' && (!updatedQuestion.blanks || updatedQuestion.blanks.length === 0)) {
                        updatedQuestion.blanks = [{ possibleAnswers: [] }];
                    }
    
                    setCurrentQuestion(updatedQuestion);
                }}
                 style={styles.input}
>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="fill-blank">Fill in the Blank</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  value={currentQuestion.title}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, title: e.target.value})}
                  style={styles.input}
                  placeholder="Question title"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Question</label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Enter question text"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Points</label>
                <input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value) || 0})}
                  style={styles.input}
                />
              </div>

              {currentQuestion.type === 'multiple-choice' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Answer Options</label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} style={styles.optionRow}>
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => updateOption(index, 'isCorrect', e.target.checked)}
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(index, 'text', e.target.value)}
                        style={styles.optionInput}
                        placeholder={`Option ${index + 1}`}
                      />
                      <button onClick={() => handleRemoveOption(index)} style={styles.removeBtn}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button onClick={handleAddOption} style={styles.addOptionBtn}>
                    + Add Option
                  </button>
                </div>
              )}

              {currentQuestion.type === 'true-false' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Correct Answer</label>
                  <div>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="radio"
                        checked={currentQuestion.correctAnswer === true}
                        onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: true})}
                      />
                      True
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="radio"
                        checked={currentQuestion.correctAnswer === false}
                        onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: false})}
                      />
                      False
                    </label>
                  </div>
                </div>
              )}

              {currentQuestion.type === 'fill-blank' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Blanks</label>
                  {(!currentQuestion.blanks || currentQuestion.blanks.length === 0) ? (
                    <p>No blanks yet. Click "Add Blank" to add one.</p>
                  ) : (
                    currentQuestion.blanks.map((blank, blankIndex) => (
                      <div key={blankIndex} style={styles.blankContainer}>
                        <div style={styles.blankHeader}>
                          <strong>Blank {blankIndex + 1}</strong>
                          <button 
                            onClick={() => {
                              const updatedBlanks = currentQuestion.blanks.filter((_, i) => i !== blankIndex);
                              setCurrentQuestion({...currentQuestion, blanks: updatedBlanks});
                            }}
                            style={styles.removeBtn}
                          >
                            Remove Blank
                          </button>
                        </div>
                        <label style={{fontSize: '14px', color: '#666', marginBottom: '5px', display: 'block'}}>
                          Correct answers (one per line)
                        </label>
                        <textarea
                          value={blank.possibleAnswers?.join('\n') || ''}
                          onChange={(e) => {
                            const updatedBlanks = [...currentQuestion.blanks];
                            updatedBlanks[blankIndex] = {
                              possibleAnswers: e.target.value.split('\n').filter(a => a.trim())
                            };
                            setCurrentQuestion({...currentQuestion, blanks: updatedBlanks});
                          }}
                          style={styles.textarea}
                          rows="3"
                          placeholder="Enter each possible answer on a new line"
                        />
                      </div>
                    ))
                  )}
                  <button 
                    onClick={() => {
                      const newBlank = { possibleAnswers: [] };
                      setCurrentQuestion({
                        ...currentQuestion,
                        blanks: [...(currentQuestion.blanks || []), newBlank]
                      });
                    }}
                    style={styles.addOptionBtn}
                  >
                    + Add Blank
                  </button>
                </div>
              )}

              <div style={styles.buttonRow}>
                <button onClick={handleSaveQuestion} style={styles.saveButton}>
                  Save Question
                </button>
                <button onClick={handleCancelQuestion} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={styles.buttonRow}>
        <button onClick={handleSave} style={styles.saveButton}>
          Save
        </button>
        <button onClick={handleSaveAndPublish} style={styles.publishButton}>
          Save & Publish
        </button>
        <button onClick={handleCancel} style={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const styles = {
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #ddd'
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#666'
  },
  activeTab: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#2196F3',
    borderBottom: '3px solid #2196F3'
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    marginRight: '20px'
  },
  addQuestionButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    marginBottom: '20px'
  },
  questionCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: 'white'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  questionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333'
  },
  questionActions: {
    display: 'flex',
    gap: '10px'
  },
  editBtn: {
    padding: '5px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#2196F3',
    color: 'white'
  },
  deleteBtn: {
    padding: '5px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#f44336',
    color: 'white'
  },
  questionPreview: {
    fontSize: '14px',
    color: '#666'
  },
  questionEditor: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginTop: '20px'
  },
  optionRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '10px'
  },
  optionInput: {
    flex: 1,
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  removeBtn: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#f44336',
    color: 'white',
    fontSize: '12px'
  },
  addOptionBtn: {
    padding: '8px 16px',
    border: '1px solid #4CAF50',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#4CAF50',
    marginTop: '10px'
  },
  blankContainer: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9'
  },
  blankHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  saveButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px'
  },
  publishButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#2196F3',
    color: 'white',
    fontSize: '16px'
  },
  cancelButton: {
    padding: '10px 20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#333',
    fontSize: '16px'
  },
  placeholder: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    border: '1px dashed #ddd'
  }
};

export default QuizEditor;