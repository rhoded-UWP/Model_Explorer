import TagList from './TagList.jsx'
import {
  formatDate,
  formatGated,
  formatNumber,
  formatParameters,
  textOrNotListed,
} from '../format.js'

// Shows one model's information. Every optional field goes through a format
// helper, so a missing value shows "Not listed" instead of crashing.
function ModelDetails({ model, trendingScore }) {
  // cardData and safetensors can be missing entirely. Optional chaining (?.)
  // returns undefined instead of throwing "cannot read properties of undefined".
  const license = model.cardData?.license
  const parameterCount = model.safetensors?.total
  const fileCount = Array.isArray(model.siblings) ? model.siblings.length : undefined

  // Each row is [label, value]. Building an array keeps the JSX below short
  // and makes it easy to add or reorder rows.
  const rows = [
    ['Author', textOrNotListed(model.author)],
    ['Size', formatParameters(parameterCount)],
    ['Downloads (last 30 days)', formatNumber(model.downloads)],
    ['Likes', formatNumber(model.likes)],
    ['Trending score', formatNumber(trendingScore)],
    ['Task', textOrNotListed(model.pipeline_tag)],
    ['Library', textOrNotListed(model.library_name)],
    ['License', textOrNotListed(license)],
    ['Gated access', formatGated(model.gated)],
    ['Files in repository', formatNumber(fileCount)],
    ['Created', formatDate(model.createdAt)],
    ['Last updated', formatDate(model.lastModified)],
  ]

  return (
    <article className="details" aria-labelledby="details-heading">
      {/* The id is shown as plain JSX text, so React escapes it. Even if an
          API value contained HTML, it would appear as text, not run as code. */}
      <h2 id="details-heading">{model.id}</h2>

      <dl className="facts">
        {rows.map(([label, value]) => (
          <div className="fact" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <TagList tags={model.tags} />

      <p>
        <a href={`https://huggingface.co/${model.id}`}>View on Hugging Face</a>
      </p>
    </article>
  )
}

export default ModelDetails
