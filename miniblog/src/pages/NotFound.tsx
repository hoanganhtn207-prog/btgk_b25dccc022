import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="nf-code">404</p>
      <h1>Bạn đi lạc rồi</h1>
      <p>Đường dẫn này không tồn tại hoặc đã bị xóa.</p>
      <Link className="btn" to="/">
        Về trang chủ
      </Link>
    </section>
  );
}
