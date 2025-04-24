import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, role);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>iBOX Study</h1>
      <form onSubmit={handleSubmit}>
        <div className="role-selector">
          <button type="button" onClick={() => setRole('user')} className={role === 'user' ? 'active' : ''}>
            Пользователь
          </button>
          <button type="button" onClick={() => setRole('admin')} className={role === 'admin' ? 'active' : ''}>
            Администратор
          </button>
        </div>
        
        <input
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}
