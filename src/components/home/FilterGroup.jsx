function FilterGroup({ title, children }) {
  return (
    <section className="filter-group">
      <h3>{title}</h3>
      <div className="filter-group-body">{children}</div>
    </section>
  );
}

export default FilterGroup;
