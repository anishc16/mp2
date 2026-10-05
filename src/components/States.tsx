export function LoadingState({ message = 'Loading Pokémon…' }: { message?: string }) {
  return (
    <div className="status-panel" role="status">
      <span className="loader" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="status-panel error-panel" role="alert">
      <span className="status-icon" aria-hidden="true">!</span>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry && <button className="button button-primary" type="button" onClick={onRetry}>Try again</button>}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="status-panel empty-panel">
      <span className="status-icon" aria-hidden="true">?</span>
      <h2>No Pokémon found</h2>
      <p>{message}</p>
    </div>
  )
}
