/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const INVENTORY_STORAGE_KEY = "tally.inventory.items";

const initialInventoryData = [
  {
    sn: 1,
    idNo: "IVS-1002",
    productName: "Hi-Drone",
    category: "Electronics",
    stocks: 50,
    status: "Low Stock",
    costPrice: 320,
    sellingPrice: 450,
    unit: "pcs",
  },
  {
    sn: 2,
    idNo: "BEN-6701",
    productName: "Body-fit Compact",
    category: "Wellness",
    stocks: 95,
    status: "In Stock",
    costPrice: 120,
    sellingPrice: 180,
    unit: "pcs",
  },
  {
    sn: 3,
    idNo: "TIN-2090",
    productName: "Peak Milk",
    category: "Beverages",
    stocks: 20,
    status: "Out of Stock",
    costPrice: 70,
    sellingPrice: 110,
    unit: "carton",
  },
  {
    sn: 4,
    idNo: "PAN-0076",
    productName: "Paracetamol",
    category: "Medication",
    stocks: 15,
    status: "Out of Stock",
    costPrice: 40,
    sellingPrice: 65,
    unit: "box",
  },
  {
    sn: 5,
    idNo: "TIN-3044",
    productName: "Nivea",
    category: "Deodorant",
    stocks: 400,
    status: "In Stock",
    costPrice: 150,
    sellingPrice: 210,
    unit: "pcs",
  },
];

const InventoryContext = createContext(null);

const createInventoryStatus = (quantity) => {
  if (quantity <= 0) {
    return "Out of Stock";
  }

  if (quantity <= 20) {
    return "Low Stock";
  }

  return "In Stock";
};

const buildInventoryItem = (product, currentItems) => ({
  sn: currentItems.length + 1,
  idNo: `INV-${String(Date.now()).slice(-6)}`,
  productName: product.inventoryName,
  category: product.category,
  stocks: product.quantity,
  status: createInventoryStatus(product.quantity),
  costPrice: product.costPrice,
  sellingPrice: product.sellingPrice,
  unit: product.unit || "-",
});

const withSerialNumbers = (items) =>
  items.map((item, index) => ({
    ...item,
    sn: index + 1,
  }));

export const InventoryProvider = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState(() => {
    if (typeof window === "undefined") {
      return initialInventoryData;
    }

    try {
      const storedItems = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : initialInventoryData;
    } catch {
      return initialInventoryData;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        INVENTORY_STORAGE_KEY,
        JSON.stringify(inventoryItems)
      );
    } catch {
      // Ignore storage failures and keep the in-memory state.
    }
  }, [inventoryItems]);

  const addProduct = (product) => {
    setInventoryItems((currentItems) => [
      ...currentItems,
      buildInventoryItem(product, currentItems),
    ]);
  };

  const updateProductQuantity = (idNo, quantity) => {
    setInventoryItems((currentItems) =>
      currentItems.map((item) => {
        if (item.idNo !== idNo) {
          return item;
        }

        return {
          ...item,
          stocks: quantity,
          status: createInventoryStatus(quantity),
        };
      })
    );
  };

  const deleteProduct = (idNo) => {
    setInventoryItems((currentItems) =>
      withSerialNumbers(currentItems.filter((item) => item.idNo !== idNo))
    );
  };

  const value = useMemo(
    () => ({
      inventoryItems,
      addProduct,
      updateProductQuantity,
      deleteProduct,
    }),
    [inventoryItems]
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
