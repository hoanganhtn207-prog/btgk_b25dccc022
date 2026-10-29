export interface Post {
  id: number | string; // bài từ API: number, bài tự viết: "local-<timestamp>"
  userId?: number;
  title: string;
  body: string;
  author?: string; // chỉ có với bài viết tự tạo
  category?: string; // chỉ có với bài viết tự tạo
  isLocal?: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}
