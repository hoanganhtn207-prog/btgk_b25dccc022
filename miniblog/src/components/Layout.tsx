import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Z" fill="#0f766e" />
      <circle cx="12" cy="9" r="2.8" fill="#ffffff" />
    </svg>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';

  // Ô tìm kiếm nằm ở cột trái: gõ ở trang nào cũng đưa về trang chủ kèm ?q=
  const handleSearch = (value: string) => {
    navigate(value ? `/?q=${encodeURIComponent(value)}` : '/', { replace: location.pathname === '/' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <Logo />
          <span className="brand-text">
            <span className="brand-name">
              Mini<em>Blog</em>
            </span>
            <span className="brand-tag">Du lịch &amp; Ẩm thực</span>
          </span>
        </Link>

        <div className="search">
          <Icon>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </Icon>
          <input
            type="search"
            placeholder="Tìm bài viết…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Tìm bài viết theo tiêu đề"
          />
        </div>

        <nav className="side-nav" aria-label="Điều hướng chính">
          <NavLink to="/" end className="side-link">
            <Icon>
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5 10v10h14V10" />
            </Icon>
            Trang chủ
          </NavLink>
          <NavLink to="/new" className="side-link">
            <Icon>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </Icon>
            Viết bài
          </NavLink>
          {user ? (
            <button className="side-link" onClick={handleLogout}>
              <Icon>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5M21 12H9" />
              </Icon>
              Đăng xuất
            </button>
          ) : (
            <NavLink to="/login" className="side-link">
              <Icon>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </Icon>
              Đăng nhập
            </NavLink>
          )}
        </nav>

        {user && (
          <div className="side-user">
            <span className="avatar avatar-lg">{user.charAt(0).toUpperCase()}</span>
            <span>
              <strong>{user}</strong>
              <small>Đã đăng nhập</small>
            </span>
          </div>
        )}
      </aside>

      <div className="page">
        <main className="content">
          <Outlet />
        </main>
        <footer className="footer">MiniBlog – chia sẻ hành trình, món ngon và những góc phố đáng nhớ.</footer>
      </div>
    </div>
  );
}
