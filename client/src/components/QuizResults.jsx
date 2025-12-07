import { useNavigate, useParams } from 'react-router-dom';

function QuizResults() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.successIcon}>✓</div>
        <h1 style={styles.title}>Quiz Submitted!</h1>
        <p style={styles.message}>
          Your answers have been recorded. This was a preview mode, so no scores are calculated.
        </p>
        
        <div style={styles.buttonRow}>
          <button 
            onClick={() => navigate(`/quizzes/${id}`)} 
            style={styles.detailsButton}
          >
            Back to Quiz Details
          </button>
          <button 
            onClick={() => navigate('/quizzes')} 
            style={styles.listButton}
          >
            Back to Quiz List
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '60px 40px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    textAlign: 'center',
    maxWidth: '500px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    margin: '0 auto 30px',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#333'
  },
  message: {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '40px'
  },
  buttonRow: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  detailsButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#2196F3',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500'
  },
  listButton: {
    padding: '12px 24px',
    border: '2px solid #2196F3',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#2196F3',
    fontSize: '16px',
    fontWeight: '500'
  }
};

export default QuizResults;