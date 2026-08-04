import { useState, useEffect } from "react";
import { api, normalizeList, normalizeProduct } from "../../service/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(normalizeList(data).map(normalizeProduct));
        setError("");
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.status === 403 ? "Please sign in to view the product catalogue." : err.message);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => { mounted = false; };
  }, []);

  return { products, isLoading, error };
}