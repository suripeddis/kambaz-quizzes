import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://kambaz-quizzes.onrender.com/api/quizzes';

function QuizPreview() {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

  if (!quiz) {
    return <div>Loading...</div>;
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div>
        <h2>{quiz.title}</h2>
        <p>No questions in this quiz yet.</p>
        <button onClick={() => navigate(`/quizzes/${id}`)} style={styles.backButton}>
          Back to Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>{quiz.title}</h2>
        <button onClick={() => navigate(`/quizzes/${id}`)} style={styles.backButton}>
          Back to Quiz
        </button>
      </div>

      <div style={styles.progressBar}>
        <div style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
        <div style={styles.progress}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`
            }}
          />
        </div>
      </div>

      <div style={styles.questionCard}>
        <div style={styles.questionHeader}>
          <span style={styles.questionNumber}>Question {currentQuestionIndex + 1}</span>
          <span style={styles.points}>{currentQuestion.points} pts</span>
        </div>

        {currentQuestion.title && (
          <h3 style={styles.questionTitle}>{currentQuestion.title}</h3>
        )}

        <div style={styles.questionText}>{currentQuestion.question}</div>

        <div style={styles.answersSection}>
          {currentQuestion.type === 'multiple-choice' && (
            <div>
              {currentQuestion.options?.map((option, index) => (
                <div key={index} style={styles.option}>
                  <input type="radio" name="answer" id={`option-${index}`} />
                  <label htmlFor={`option-${index}`} style={styles.optionLabel}>
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'true-false' && (
            <div>
              <div style={styles.option}>
                <input type="radio" name="answer" id="true" />
                <label htmlFor="true" style={styles.optionLabel}>True</label>
              </div>
              <div style={styles.option}>
                <input type="radio" name="answer" id="false" />
                <label htmlFor="false" style={styles.optionLabel}>False</label>
              </div>
            </div>
          )}

          {currentQuestion.type === 'fill-blank' && (
            <div>
              <input
                type="text"
                placeholder="Your answer"
                style={styles.fillBlankInput}
              />
            </div>
          )}
        </div>
      </div>

      <div style={styles.navigation}>
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          style={currentQuestionIndex === 0 ? styles.navButtonDisabled : styles.navButton}
        >
          ← Previous
        </button>

        <div style={styles.questionDots}>
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              style={
                index === currentQuestionIndex
                  ? styles.dotActive
                  : styles.dot
              }
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
          onClick={() => navigate(`/quizzes/${id}/results`)}
            style={styles.submitButton}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))}
            style={styles.navButton}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  backButton: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#333'
  },
  progressBar: {
    marginBottom: '30px'
  },
  progressText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  progress: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease'
  },
  questionCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginBottom: '20px'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  questionNumber: {
    fontSize: '14px',
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  points: {
    fontSize: '14px',
    color: '#2196F3',
    fontWeight: 'bold'
  },
  questionTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#333'
  },
  questionText: {
    fontSize: '18px',
    marginBottom: '25px',
    lineHeight: '1.6',
    color: '#333'
  },
  answersSection: {
    marginTop: '20px'
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#f9f9f9'
  },
  optionLabel: {
    marginLeft: '10px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  fillBlankInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px'
  },
  navButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#2196F3',
    color: 'white',
    fontSize: '16px'
  },
  navButtonDisabled: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    backgroundColor: '#ccc',
    color: '#666',
    fontSize: '16px'
  },
  submitButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  questionDots: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  dot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#666'
  },
  dotActive: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid #2196F3',
    backgroundColor: '#2196F3',
    cursor: 'pointer',
    fontSize: '12px',
    color: 'white',
    fontWeight: 'bold'
  }
};

export default QuizPreview;