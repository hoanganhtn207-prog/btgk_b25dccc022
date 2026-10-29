import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }
    if (login(username.trim(), password)) {
      navigate(from, { replace: true });
    } else {
      setError('Sai tên đăng nhập hoặc mật khẩu.');
    }
  };

  return (
    <section className="panel">
      <h1>Đăng nhập</h1>
      <p className="panel-sub">{from === '/new' ? 'Bạn cần đăng nhập để viết bài.' : 'Đăng nhập để chia sẻ hành trình của bạn.'}</p>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Tên đăng nhập
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label>
          Mật khẩu
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-block" type="submit">
          Đăng nhập
        </button>
      </form>
      <p className="hint">Tài khoản thử nghiệm: admin / 123456</p>
    </section>
  );
}
