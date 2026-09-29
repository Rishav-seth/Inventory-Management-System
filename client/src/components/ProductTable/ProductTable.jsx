import "./ProductTable.css";

function ProductTable({ products, onEdit, onDelete, onStockChange }) {
  if (products.length === 0) {
    return <p className="empty-state">No products match the current filters.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td><span className={`status status--${product.status.toLowerCase()}`}>{product.status.replaceAll("_", " ")}</span></td>
              <td className="actions">
                <button onClick={() => onEdit(product)}>Edit</button>
                <button onClick={() => onStockChange(product, "in")}>Stock in</button>
                <button onClick={() => onStockChange(product, "out")}>Stock out</button>
                <button className="button-danger" onClick={() => onDelete(product)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
