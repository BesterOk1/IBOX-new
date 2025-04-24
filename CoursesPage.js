import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, 'courses'));
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCourses();
  }, []);

  return (
    <div className="courses-container">
      {courses.length === 0 ? (
        <div className="empty-state">
          <h3>Нет доступных курсов</h3>
          <p>В данный момент нет доступных курсов. Пожалуйста, проверьте позже.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <img src={course.image} alt={course.title} />
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <Link to={`/dashboard/courses/${course.id}`}>Начать обучение</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}