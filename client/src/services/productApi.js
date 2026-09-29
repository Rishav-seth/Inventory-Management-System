const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "The request failed");
  }

  return data;
};

export const getProducts = () => request("/api/products");

export const createProduct = (product) =>
  request("/api/products", {
    method: "POST",
    body: JSON.stringify(product)
  });

export const updateProduct = (id, product) =>
  request(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product)
  });

export const deleteProduct = (id) =>
  request(`/api/products/${id}`, {
    method: "DELETE"
  });

export const stockIn = (id, quantity) =>
  request(`/api/products/${id}/stock-in`, {
    method: "POST",
    body: JSON.stringify({ quantity })
  });

export const stockOut = (id, quantity) =>
  request(`/api/products/${id}/stock-out`, {
    method: "POST",
    body: JSON.stringify({ quantity })
  });
