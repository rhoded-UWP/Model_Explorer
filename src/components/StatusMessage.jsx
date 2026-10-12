// The live region must be on the page from the very first render. Screen
// readers watch an existing aria-live element for changes; a region that is
// added at the same moment as its text is often not announced at all. So this
// component always renders the <div>, and only its text changes.
function StatusMessage({ status, modelId }) {
  const messages = {
    'loading-list': 'Loading trending models…',
    'list-error':
      'Models could not be loaded. Check your connection and refresh the page.',
    ready: 'Choose a model and press Show details.',
    'loading-details': `Loading details for ${modelId}…`,
    'details-error':
      'Model details could not be loaded. Check your connection and try again.',
    success: `Showing details for ${modelId}.`,
  }

  const isError = status === 'list-error' || status === 'details-error'
  const message = messages[status] ?? ''

  return (
    <div
      className={isError ? 'status status-error' : 'status'}
      aria-live="polite"
    >
      {/* The word "Error:" means the error doesn't rely on color alone. */}
      {isError && <strong>Error: </strong>}
      {message}
    </div>
  )
}

export default StatusMessage
