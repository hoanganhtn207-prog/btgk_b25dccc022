export function Loading({ text = 'Đang tải…' }: { text?: string }) {
  return (
    <div className="status" role="status">
      <span className="spinner" aria-hidden="true" />
      {text}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="status error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}
