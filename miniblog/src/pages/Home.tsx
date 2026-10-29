import { useMemo, useState, type CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_URL, useFetch } from '../hooks/useFetch';
import { getLocalPosts } from '../storage';
import { CATEGORIES, authorOf, categoryOf, hueOf, initialOf } from '../data';
import { Loading, ErrorMessage } from '../components/Status';
import type { Post } from '../types';

const ALL = 'Tất cả';

export default function Home() {
  const { data, loading, error, reload } = useFetch<Post[]>(`${API_URL}/posts`);
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? ''; // từ khóa do ô tìm kiếm ở cột trái đặt vào URL
  const [category, setCategory] = useState(ALL);

  // Bài viết mới (localStorage) đứng trước bài từ API
  const posts = useMemo(() => [...getLocalPosts(), ...(data ?? [])], [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchQuery = !q || p.title.toLowerCase().includes(q);
      const matchCategory = category === ALL || categoryOf(p) === category;
      return matchQuery && matchCategory;
    });
  }, [posts, query, category]);

  const resetFilters = () => {
    setParams({});
    setCategory(ALL);
  };

  return (
    <section>
      <div className="hero">
        <p className="eyebrow">Du lịch · Ẩm thực</p>
        <h1>Đi đâu, ăn gì, ở đâu</h1>
        <p className="lead">Kinh nghiệm, lịch trình và những quán ngon được chia sẻ từ chính người đi.</p>
      </div>

      <div className="pills" role="group" aria-label="Lọc theo chuyên mục">
        {[ALL, ...CATEGORIES].map((c) => (
          <button key={c} className={`pill${c === category ? ' active' : ''}`} aria-pressed={c === category} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {loading && <Loading text="Đang tải bài viết…" />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {!loading && !error && (
        <>
          <p className="count">
            {filtered.length} bài viết{query.trim() && <> cho “{query.trim()}”</>}
          </p>

          {filtered.length === 0 ? (
            <div className="empty">
              <p>Không có bài nào khớp với bộ lọc hiện tại.</p>
              <button className="btn" onClick={resetFilters}>
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <ul className="grid">
              {filtered.map((p) => {
                const cat = categoryOf(p);
                const author = authorOf(p);
                return (
                  <li key={p.id} className="card" style={{ '--hue': hueOf(cat) } as CSSProperties}>
                    <div className="card-top">
                      <span className="tag">{cat}</span>
                      {p.isLocal && <span className="tag-new">Mới viết</span>}
                    </div>
                    <h2>
                      <Link to={`/posts/${p.id}`}>{p.title}</Link>
                    </h2>
                    <p className="excerpt">{p.body}</p>
                    <div className="byline">
                      <span className="avatar">{initialOf(author)}</span>
                      {author}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
