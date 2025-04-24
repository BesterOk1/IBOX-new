import { createContext, useContext, useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, role) => {
    if (role === 'admin' && !['Bestra@live.ru', 'tvv@avtodigit.ru'].includes(email)) {
      throw new Error('Неверные админские учетные данные');
    }
    
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email,
        role: role === 'admin' ? 'admin' : 'user',
        createdAt: new Date(),
        progress: [],
        completedCourses: 0
      });
    }
    
    const userData = (await getDoc(userRef)).data();
    setCurrentUser({ 
      email,
      ...userData,
      role: role === 'admin' ? 'admin' : 'user' 
    });
  };

  const updateProgress = async (courseId) => {
    if (!currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.email);
    await updateDoc(userRef, {
      progress: [...new Set([...currentUser.progress, courseId])],
      completedCourses: currentUser.progress.length + 1
    });
    
    setCurrentUser(prev => ({
      ...prev,
      progress: [...prev.progress, courseId],
      completedCourses: prev.completedCourses + 1
    }));
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateProgress, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
