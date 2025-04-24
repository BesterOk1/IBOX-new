import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const { currentUser, updateProgress } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);
      
      if (!courseSnap.exists()) {
        navigate('/dashboard/courses');
        return;
      }
      
      setCourse(courseSnap.data());
      
      if (currentUser?.progress.includes(courseId)) {
        setIsCompleted(true);
      }
    };
    
    loadData();
  }, [courseId, currentUser]);

  const handleComplete = async () => {
    if (!isCompleted) {
      await updateProgress(courseId);
      setIsCompleted(true);
    }
  };

  if (!course) return <div className="loading">Загрузка курса...</div>;

  return (
    <div className="course-details">
      <div className="course-header">
        <h1>{course.title}</h1>
        <img src={course.image} alt={course.title} />
      </div>
      
      <div className="course-content">
        <div className="description">{course.description}</div>
        
        {course.fileType === 'pdf' && (
          <div className="document-viewer">
            <Viewer fileUrl={course.fileUrl} />
          </div>
        )}
        
        {course.videoUrl && (
          <div className="video-container">
            <iframe 
              src={course.videoUrl}
              title="Course video"
              allowFullScreen
            />
          </div>
        )}
      </div>
      
      <div className="course-actions">
        {!isCompleted ? (
          <button onClick={handleComplete} className="complete-btn">
            Отметить как пройденный
          </button>
        ) : (
          <div className="completed-badge">
            ✅ Курс завершен
          </div>
        )}
      </div>
    </div>
  );
}
