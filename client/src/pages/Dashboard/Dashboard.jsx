import "./Dashboard.css";

function Dashboard({ products }) {
  const lowStockProducts = products.filter((product) => product.status === "LOW_STOCK");
  const outOfStockProducts = products.filter((product) => product.status === "OUT_OF_STOCK");
  const totalStock = products.reduce((total, product) => total + product.stock, 0);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
      </div>
      <div className="summary-grid">
        <article><span>Total products</span><strong>{products.length}</strong></article>
        <article><span>Total stock units</span><strong>{totalStock}</strong></article>
        <article><span>Low-stock products</span><strong>{lowStockProducts.length}</strong></article>
        <article><span>Out of stock</span><strong>{outOfStockProducts.length}</strong></article>
      </div>
      <div className="section-heading">
        <h2>Low-stock products</h2>
      </div>
      {lowStockProducts.length === 0 ? (
        <p className="empty-state">No low-stock products right now.</p>
      ) : (
        <ul className="low-stock-list">
          {lowStockProducts.map((product) => (
            <li key={product._id}>
              <span>{product.name} <small>({product.sku})</small></span>
              <strong>{product.stock} left</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Dashboard;
