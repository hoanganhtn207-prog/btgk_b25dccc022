import { useCallback, useEffect, useState } from 'react';

export const API_URL = 'https://jsonplaceholder.typicode.com';

export function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(url !== null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (url === null) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? 'Không tìm thấy dữ liệu (404).' : `Máy chủ trả về lỗi ${res.status}.`);
        return res.json() as Promise<T>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return; // component đã unmount / url đổi
        setError(err.message === 'Failed to fetch' ? 'Không thể kết nối mạng. Hãy kiểm tra internet và thử lại.' : err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [url, tick]);

  return { data, loading, error, reload };
}
