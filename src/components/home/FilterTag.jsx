function FilterTag({ label, onRemove }) {
  return (
    <button
      type="button"
      className="filter-tag"
      aria-label={`Remove ${label} filter`}
      onClick={onRemove}
    >
      {label}
      <span className="filter-tag-close">x</span>
    </button>
  );
}

export default FilterTag;
