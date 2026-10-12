// A controlled <select> plus a button. "Controlled" means React state (owned
// by App) decides which option is selected; the <select> just displays that
// value and reports changes back through onSelect.
function ModelPicker({ models, selectedId, onSelect, onShowDetails, isBusy }) {
  // A <form> with a submit button is the standard HTML pattern for "fill in,
  // then send", and the button works with Enter, Space, or a click.
  // preventDefault stops the browser's default submit, which reloads the page.
  function handleSubmit(event) {
    event.preventDefault()
    onShowDetails()
  }

  return (
    <section className="picker" aria-labelledby="picker-heading">
      <h2 id="picker-heading">Choose a model</h2>
      <form onSubmit={handleSubmit}>
        {/* htmlFor connects the visible label to the select, so screen
            readers announce it and clicking the label focuses the select. */}
        <label htmlFor="model-select">Trending text-generation model</label>
        <div className="picker-row">
          <select
            id="model-select"
            value={selectedId}
            onChange={(event) => onSelect(event.target.value)}
          >
            {models.map((model) => (
              // The model id is unique and stable, so it makes a good key.
              <option key={model.id} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
          {/* Disabled while a request is in flight so a second click can't
              start a competing request. */}
          <button type="submit" disabled={isBusy}>
            {isBusy ? 'Loading…' : 'Show details'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ModelPicker
