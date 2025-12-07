import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://kambaz-quizzes.onrender.com/api/quizzes';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(API_URL);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleAddQuiz = async () => {
    try {
      const response = await axios.post(API_URL);
      navigate(`/quizzes/${response.data._id}/edit`);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/publish`);
      fetchQuizzes();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  if (quizzes.length === 0) {
    return (
      <div>
        <h2>Quizzes</h2>
        <button onClick={handleAddQuiz} style={styles.addButton}>
          + Quiz
        </button>
        <p>No quizzes yet. Click "+ Quiz" to create one.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Quizzes</h2>
      <button onClick={handleAddQuiz} style={styles.addButton}>
        + Quiz
      </button>
      <div style={styles.list}>
        {quizzes.map(quiz => (
          <div key={quiz._id} style={styles.quizCard}>
            <div 
              onClick={() => navigate(`/quizzes/${quiz._id}`)}
              style={styles.quizTitle}
            >
              {quiz.published && <span style={styles.checkmark}>✓ </span>}
              {quiz.title}
            </div>
            <div style={styles.quizInfo}>
              <span>Available: {new Date(quiz.availableDate).toLocaleDateString()}</span>
              <span>Points: {quiz.points}</span>
              <span>Questions: {quiz.questions?.length || 0}</span>
            </div>
            <div style={styles.buttonRow}>
              <button onClick={() => handleTogglePublish(quiz._id)} style={styles.publishButton}>
                {quiz.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => handleDelete(quiz._id)} style={styles.deleteButton}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  addButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '16px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  quizCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: 'white'
  },
  quizTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#2196F3',
    marginBottom: '10px'
  },
  checkmark: {
    color: '#4CAF50'
  },
  quizInfo: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  publishButton: {
    padding: '8px 16px',
    border: '1px solid #2196F3',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#2196F3',
    color: 'white',
    fontSize: '14px'
  },
  deleteButton: {
    padding: '8px 16px',
    border: '1px solid #f44336',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#f44336',
    color: 'white',
    fontSize: '14px'
  }
};

export default QuizList;