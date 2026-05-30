/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../utils/api";
import { useAccessTokenStore } from "../utils/zustand";

const InventoryContext = createContext(null);

const createInventoryStatus = (quantity) => {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= 20) return "Low Stock";
  return "In Stock";
};

const fromBackend = (item, index) => ({
  sn: index + 1,
  idNo: String(item.id),
  productName: item.name,
  category: item.category,
  stocks: item.qty,
  status: createInventoryStatus(item.qty),
  costPrice: item.boughtPrice,
  sellingPrice: item.sellingPrice,
  unit: item.unit || "-",
});

export const InventoryProvider = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useAccessTokenStore((state) => state.accessToken);

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/user/inventory");
      const items = response.data.sentInventory;

      setInventoryItems(Array.isArray(items) ? items.map(fromBackend) : []);
    } catch (error) {
      console.error("Inventory fetch failed:", error);
      setInventoryItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = async (product) => {
    const response = await api.post("/user/inventory", {
      stock: product.inventoryName,
      category: product.category,
      boughtPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      unit: product.unit,
      quantity: product.quantity,
    });

    const newStock = response.data.newStock;

    setInventoryItems((currentItems) => [
      ...currentItems,
      {
        sn: currentItems.length + 1,
        idNo: String(newStock.id),
        productName: newStock.name,
        category: newStock.category,
        stocks: newStock.qty,
        status: createInventoryStatus(newStock.qty),
        costPrice: newStock.boughtPrice,
        sellingPrice: newStock.sellingPrice,
        unit: newStock.unit || "-",
      },
    ]);
  };

  const updateProductQuantity = async (idNo, quantity) => {
    await api.put(`/user/inventory/${idNo}`, { quantity });

    setInventoryItems((currentItems) =>
      currentItems.map((item) => {
        if (item.idNo !== idNo) return item;
        return {
          ...item,
          stocks: quantity,
          status: createInventoryStatus(quantity),
        };
      })
    );
  };

  const deleteProduct = async (idNo) => {
    await api.delete(`/user/inventory/${idNo}`);

    setInventoryItems((currentItems) => {
      const filtered = currentItems.filter((item) => item.idNo !== idNo);
      return filtered.map((item, index) => ({ ...item, sn: index + 1 }));
    });
  };

  useEffect(() => {
    if (!accessToken) {
      setInventoryItems([]);
      return;
    }

    fetchInventory();
  }, [accessToken, fetchInventory]);

  const value = useMemo(
    () => ({
      inventoryItems,
      isLoading,
      fetchInventory,
      addProduct,
      updateProductQuantity,
      deleteProduct,
    }),
    [inventoryItems, isLoading, fetchInventory]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }

  return context;
};
