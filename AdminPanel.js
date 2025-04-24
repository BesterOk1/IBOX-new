import { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './AuthContext';

export default function AdminPanel() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ users: 0, courses: 0, completions: 0 });
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    image: null,
    file: null,
    videoUrl: '',
    fileType: 'pdf',
    published: false
  });

  useEffect(() => {
    const fetchStats = async () => {
      const users = await getDocs(collection(db, 'users'));
      const courses = await getDocs(collection(db, 'courses'));
      
      let totalCompletions = 0;
      users.forEach(doc => {
        totalCompletions += doc.data().completedCourses || 0;
      });
      
      setStats({
        users: users.size,
        courses: courses.size,
        completions: totalCompletions
      });
    };
    
    fetchStats();
  }, []);

  const handleUpload = async (file, path) => {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const [imageUrl, fileUrl] = await Promise.all([
        handleUpload(formState.image, 'course-images'),
        handleUpload(formState.file, 'course-files')
      ]);
      
      await addDoc(collection(db, 'courses'), {
        ...formState,
        image: imageUrl,
        fileUrl,
        createdAt: new Date(),
        published: formState.published
      });
      
      alert('Курс успешно добавлен!');
      setFormState({
        title: '',
        description: '',
        image: null,
        file: null,
        videoUrl: '',
        fileType: 'pdf',
        published: false
      });
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className="access-denied">Доступ запрещен</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-stats">
        <h3>Статистика платформы</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <h4>Пользователи</h4>
            <p>{stats.users}</p>
          </div>
          <div className="stat-item">
            <h4>Курсы</h4>
            <p>{stats.courses}</p>
          </div>
          <div className="stat-item">
            <h4>Завершения</h4>
            <p>{stats.completions}</p>
          </div>
        </div>
      </div>

      <div className="course-form">
        <h3>Добавить новый курс</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название курса:</label>
            <input
              type="text"
              value={formState.title}
              onChange={e => setFormState({...formState, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Описание:</label>
            <textarea
              value={formState.description}
              onChange={e => setFormState({...formState, description: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Тип контента:</label>
            <select
              value={formState.fileType}
              onChange={e => setFormState({...formState, fileType: e.target.value})}
            >
              <option value="pdf">PDF</option>
              <option value="ppt">PowerPoint</option>
              <option value="scorm">SCORM</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Обложка курса:</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFormState({...formState, image: e.target.files[0]})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Файл курса:</label>
            <input
              type="file"
              onChange={e => setFormState({...formState, file: e.target.files[0]})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Ссылка на видео (опционально):</label>
            <input
              type="url"
              value={formState.videoUrl}
              onChange={e => setFormState({...formState, videoUrl: e.target.value})}
            />
          </div>
          
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={formState.published}
                onChange={e => setFormState({...formState, published: e.target.checked})}
              />
              Опубликовать сразу
            </label>
          </div>
          
          <button type="submit" className="submit-btn">
            Опубликовать курс
          </button>
        </form>
      </div>
    </div>
  );
}
