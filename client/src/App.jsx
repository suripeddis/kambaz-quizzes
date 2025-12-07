import { Routes, Route, Navigate } from 'react-router-dom';
import QuizList from './components/QuizList';
import QuizDetails from './components/QuizDetails';
import QuizEditor from './components/QuizEditor';
import QuizPreview from './components/QuizPreview';
import QuizResults from './components/QuizResults.jsx';

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Kambaz Quizzes</h1>
      <Routes>
        <Route path="/" element={<Navigate to="/quizzes" />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quizzes/:id" element={<QuizDetails />} />
        <Route path="/quizzes/:id/edit" element={<QuizEditor />} />
        <Route path="/quizzes/:id/preview" element={<QuizPreview />} />
        <Route path="/quizzes/:id/results" element={<QuizResults />} />
      </Routes>
    </div>
  );
}

export default App;