import { useEffect, useState } from 'react'
import ModelPicker from './components/ModelPicker.jsx'
import ModelDetails from './components/ModelDetails.jsx'
import StatusMessage from './components/StatusMessage.jsx'
import Attribution from './components/Attribution.jsx'

const LIST_URL =
  'https://huggingface.co/api/models?pipeline_tag=text-generation&sort=trendingScore&limit=10'
const DETAILS_URL = 'https://huggingface.co/api/models/'

// App is the only component that holds state. The child components receive
// what they need as props, so there is exactly one source of truth for the
// list, the selection, the details, and the status.
function App() {
  const [models, setModels] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [details, setDetails] = useState(null)
  // One status value (instead of separate isLoading / hasError booleans) means
  // the app can never be "loading" and "failed" at the same time.
  const [status, setStatus] = useState('loading-list')

  // Load the trending list once, when the page first appears.
  // The empty dependency array [] tells React "run this after the first render
  // and never again".
  useEffect(() => {
    // If the component unmounts before the fetch finishes, we must not call
    // setState afterward. This flag lets the cleanup function tell the
    // in-flight request to ignore its result. (In development, React's
    // StrictMode mounts, unmounts, and remounts once on purpose, so this
    // cleanup actually runs and the first response is ignored.)
    let ignore = false

    async function loadModels() {
      try {
        const response = await fetch(LIST_URL)
        // fetch only rejects on network failure. An HTTP error such as 401 or
        // 500 still "succeeds", so we check response.ok ourselves.
        if (!response.ok) {
          throw new Error(`List request failed with HTTP ${response.status}`)
        }
        const data = await response.json()
        if (ignore) return

        setModels(data)
        // Pre-select the first model so the button always has something valid
        // to fetch. The names change daily, so we never hard-code one.
        setSelectedId(data.length > 0 ? data[0].id : '')
        setStatus('ready')
      } catch (error) {
        if (ignore) return
        console.error(error)
        setStatus('list-error')
      }
    }

    loadModels()

    return () => {
      ignore = true
    }
  }, [])

  // Fetch one model's details. This runs only when the button is pressed, not
  // when the <select> changes, so browsing the dropdown with the arrow keys
  // doesn't fire a request for every model passed along the way.
  async function handleShowDetails() {
    if (!selectedId) return

    setStatus('loading-details')
    // Clear the old details so a failed request never leaves the previous
    // model's information on screen next to an error message.
    setDetails(null)

    try {
      // The id contains a "/" (for example "zai-org/GLM-5.3") that must stay a
      // real slash in the path, so we add it exactly as the list returned it.
      // encodeURIComponent would turn the slash into "%2F" and break the URL.
      const response = await fetch(DETAILS_URL + selectedId)
      // A model that doesn't exist returns 401, not 404, so we treat any
      // non-ok response as a failure rather than checking for one code.
      if (!response.ok) {
        throw new Error(`Details request failed with HTTP ${response.status}`)
      }
      const data = await response.json()
      setDetails(data)
      setStatus('success')
    } catch (error) {
      console.error(error)
      // The picker stays enabled after this, so the user can simply press
      // the button again to retry.
      setStatus('details-error')
    }
  }

  // The details endpoint doesn't include trendingScore, so we look it up from
  // the list entry with the same id.
  const listEntry = details ? models.find((m) => m.id === details.id) : null

  return (
    <>
      <header className="site-header">
        <h1>Model Explorer</h1>
        <p className="intro">
          Browse today&rsquo;s ten trending text-generation models on Hugging
          Face and look up the details of any one of them.
        </p>
      </header>

      <main>
        {/* Hide the picker until there is something to pick from. */}
        {models.length > 0 && (
          <ModelPicker
            models={models}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onShowDetails={handleShowDetails}
            isBusy={status === 'loading-details'}
          />
        )}

        {/* Once details are showing, name that model (not whatever the
            dropdown has moved to since), so the message matches the page. */}
        <StatusMessage
          status={status}
          modelId={details ? details.id : selectedId}
        />

        {details && (
          <ModelDetails
            model={details}
            trendingScore={listEntry ? listEntry.trendingScore : undefined}
          />
        )}
      </main>

      <Attribution />
    </>
  )
}

export default App
