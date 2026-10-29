import type { Post } from './types';

const POSTS_KEY = 'miniblog_posts';
const USER_KEY = 'miniblog_user';

export function getLocalPosts(): Post[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? (JSON.parse(raw) as Post[]) : [];
  } catch {
    return [];
  }
}

export function addLocalPost(data: { title: string; body: string; author: string; category: string }): Post {
  const post: Post = {
    id: `local-${Date.now()}`,
    title: data.title,
    body: data.body,
    author: data.author,
    category: data.category,
    isLocal: true,
  };
  localStorage.setItem(POSTS_KEY, JSON.stringify([post, ...getLocalPosts()]));
  return post;
}

export function getStoredUser(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function setStoredUser(username: string | null) {
  if (username) localStorage.setItem(USER_KEY, username);
  else localStorage.removeItem(USER_KEY);
}
