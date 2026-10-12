import { NOT_LISTED } from '../format.js'

// Renders the model's tags as a list. Each tag's text is unique within one
// model, so it works as the key React uses to track list items between renders.
function TagList({ tags }) {
  const hasTags = Array.isArray(tags) && tags.length > 0

  return (
    <section className="tags" aria-labelledby="tags-heading">
      <h3 id="tags-heading">Tags</h3>
      {hasTags ? (
        <ul className="tag-list">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : (
        <p>{NOT_LISTED}</p>
      )}
    </section>
  )
}

export default TagList
