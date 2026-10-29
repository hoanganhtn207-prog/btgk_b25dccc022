import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL, useFetch } from '../hooks/useFetch';
import { getLocalPosts } from '../storage';
import { authorOf, categoryOf, hueOf, initialOf } from '../data';
import { Loading, ErrorMessage } from '../components/Status';
import type { Comment, Post } from '../types';

function ArticleHead({ post }: { post: Post }) {
  const cat = categoryOf(post);
  const author = authorOf(post);
  return (
    <header className="article-head" style={{ '--hue': hueOf(cat) } as CSSProperties}>
      <span className="tag">{cat}</span>
      <h1>{post.title}</h1>
      <div className="byline">
        <span className="avatar">{initialOf(author)}</span>
        {author}
      </div>
    </header>
  );
}

export default function PostDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const isLocal = id.startsWith('local-');

  // Chỉ gọi API khi không phải bài viết local
  const post = useFetch<Post>(isLocal ? null : `${API_URL}/posts/${id}`);
  const comments = useFetch<Comment[]>(isLocal ? null : `${API_URL}/posts/${id}/comments`);

  if (isLocal) {
    const local = getLocalPosts().find((p) => String(p.id) === id);
    if (!local) return <ErrorMessage message="Không tìm thấy bài viết này." />;
    return (
      <article className="article">
        <Link to="/" className="back">← Về trang chủ</Link>
        <ArticleHead post={local} />
        <p className="article-body">{local.body}</p>
        <p className="empty-note">Bài viết tự tạo chưa có bình luận.</p>
      </article>
    );
  }

  if (post.loading) return <Loading text="Đang tải bài viết…" />;
  if (post.error || !post.data) return <ErrorMessage message={post.error ?? 'Không tải được bài viết.'} onRetry={post.reload} />;

  return (
    <article className="article">
      <Link to="/" className="back">← Về trang chủ</Link>
      <ArticleHead post={post.data} />
      <p className="article-body">{post.data.body}</p>

      <section className="comments">
        <h2>Bình luận {comments.data && <span className="count-chip">{comments.data.length}</span>}</h2>
        {comments.loading && <Loading text="Đang tải bình luận…" />}
        {comments.error && <ErrorMessage message={comments.error} onRetry={comments.reload} />}
        <ul className="comment-list">
          {comments.data?.map((c) => (
            <li key={c.id} className="comment">
              <span className="avatar avatar-lg">{initialOf(c.name)}</span>
              <div>
                <strong>{c.name}</strong>
                <span className="meta">{c.email}</span>
                <p>{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
