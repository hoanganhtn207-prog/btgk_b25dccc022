import type { Post } from './types';

// API không có chuyên mục / tên tác giả nên ta tự gán dựa trên id và userId
export const CATEGORIES = ['Điểm đến', 'Ẩm thực', 'Quán cà phê', 'Homestay', 'Kinh nghiệm', 'Lịch trình', 'Du lịch bụi', 'Văn hóa'];

// Mỗi chuyên mục một tông màu (hue) để dễ phân biệt
const HUES = [200, 18, 32, 160, 262, 340, 95, 185];

const AUTHORS = ['Minh Anh', 'Quốc Bảo', 'Thu Hà', 'Gia Huy', 'Ngọc Lan', 'Đức Thịnh', 'Phương Linh', 'Hoàng Nam', 'Thanh Trúc', 'Tuấn Kiệt'];

export function categoryOf(p: Post): string {
  if (p.category) return p.category;
  const n = typeof p.id === 'number' ? p.id : 1;
  return CATEGORIES[(n - 1) % CATEGORIES.length];
}

export function authorOf(p: Post): string {
  if (p.author) return p.author;
  return AUTHORS[((p.userId ?? 1) - 1) % AUTHORS.length];
}

export function hueOf(category: string): number {
  const i = CATEGORIES.indexOf(category);
  return i >= 0 ? HUES[i] : 160;
}

export function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}
