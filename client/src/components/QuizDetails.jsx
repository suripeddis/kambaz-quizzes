import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://kambaz-quizzes.onrender.com/api/quizzes';

function QuizDetails() {
  const [quiz, setQuiz] = useState(null);
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

  const handleTogglePublish = async () => {
    try {
      await axios.patch(`${API_URL}/${id}/publish`);
      fetchQuiz();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => navigate('/quizzes')} style={styles.backButton}>
        ← Back to Quizzes
      </button>
      
      <h2>{quiz.title}</h2>
      
      <div style={styles.statusBadge}>
        {quiz.published ? '✓ Published' : '✗ Unpublished'}
      </div>

      <div style={styles.detailsCard}>
      <h3 style={styles.heading}>Quiz Details</h3>
        <div style={styles.detailRow}>
          <strong>Points:</strong> {quiz.points}
        </div>
        <div style={styles.detailRow}>
          <strong>Questions:</strong> {quiz.questions?.length || 0}
        </div>
        <div style={styles.detailRow}>
          <strong>Available Date:</strong> {new Date(quiz.availableDate).toLocaleDateString()}
        </div>
        {quiz.dueDate && (
          <div style={styles.detailRow}>
            <strong>Due Date:</strong> {new Date(quiz.dueDate).toLocaleDateString()}
          </div>
        )}
        {quiz.description && (
          <div style={styles.detailRow}>
            <strong>Description:</strong> {quiz.description}
          </div>
        )}
      </div>

      <div style={styles.buttonRow}>
        <button onClick={handleTogglePublish} style={styles.publishButton}>
          {quiz.published ? 'Unpublish' : 'Publish'}
        </button>
        <button onClick={() => navigate(`/quizzes/${id}/edit`)} style={styles.editButton}>
          Edit
        </button>
        <button onClick={() => navigate(`/quizzes/${id}/preview`)} style={styles.previewButton}>
          Preview
        </button>
      </div>
    </div>
  );
}

const styles = {
    backButton: {
      padding: '8px 16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'white',
      color: '#333',
      fontSize: '14px',
      marginBottom: '20px'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '8px 16px',
      borderRadius: '20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      fontSize: '14px',
      marginBottom: '20px'
    },
    detailsCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: 'white',
      marginBottom: '20px'
    },
    detailRow: {
      padding: '10px 0',
      borderBottom: '1px solid #eee',
      color: '#333',
      fontSize: '16px'
    },
    buttonRow: {
      display: 'flex',
      gap: '10px'
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
    editButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#4CAF50',
      color: 'white',
      fontSize: '16px'
    },
    previewButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#FF9800',
      color: 'white',
      fontSize: '16px'
    },
    heading: {
     color: '#333',
     marginBottom: '15px'
    }
  };

export default QuizDetails;