import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addLocalPost } from '../storage';
import { CATEGORIES } from '../data';

interface Errors {
  title?: string;
  body?: string;
  category?: string;
}

function validate(title: string, body: string, category: string): Errors {
  const errors: Errors = {};
  if (!title.trim()) errors.title = 'Tiêu đề không được để trống.';
  else if (title.trim().length < 5) errors.title = 'Tiêu đề phải có ít nhất 5 ký tự.';
  else if (title.trim().length > 100) errors.title = 'Tiêu đề tối đa 100 ký tự.';

  if (!category) errors.category = 'Vui lòng chọn chuyên mục.';

  if (!body.trim()) errors.body = 'Nội dung không được để trống.';
  else if (body.trim().length < 20) errors.body = 'Nội dung phải có ít nhất 20 ký tự.';
  return errors;
}

export default function NewPost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(title, body, category);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    addLocalPost({ title: title.trim(), body: body.trim(), category, author: user ?? 'Ẩn danh' });
    navigate('/');
  };

  return (
    <section className="panel panel-wide">
      <h1>Viết bài mới</h1>
      <p className="panel-sub">Chia sẻ một điểm đến, một quán ăn hay một chuyến đi của bạn.</p>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Tiêu đề
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ví dụ: 3 ngày 2 đêm khám phá Hội An" />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>
        <label>
          Chuyên mục
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Chọn chuyên mục…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </label>
        <label>
          Nội dung
          <textarea rows={9} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Kể lại trải nghiệm của bạn…" />
          {errors.body && <span className="field-error">{errors.body}</span>}
        </label>
        <button className="btn" type="submit">
          Đăng bài
        </button>
      </form>
    </section>
  );
}
