import { useEffect, useState } from "react";
import "./ProductForm.css";

const emptyProduct = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  lowStockThreshold: ""
};

function ProductForm({ product, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    setForm(
      product
        ? {
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stock: product.stock,
            lowStockThreshold: product.lowStockThreshold
          }
        : emptyProduct
    );
  }, [product]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold)
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{product ? "Edit product" : "Add product"}</h2>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        SKU
        <input name="sku" value={form.sku} onChange={handleChange} required />
      </label>
      <label>
        Category
        <input name="category" value={form.category} onChange={handleChange} required />
      </label>
      <label>
        Price
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
      </label>
      <label>
        Stock
        <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} required />
      </label>
      <label>
        Low-stock threshold
        <input name="lowStockThreshold" type="number" min="0" step="1" value={form.lowStockThreshold} onChange={handleChange} required />
      </label>
      <div className="form-actions">
        <button type="submit">{product ? "Save changes" : "Add product"}</button>
        {product && <button type="button" className="button-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default ProductForm;
