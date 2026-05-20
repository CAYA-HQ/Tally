import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiSearch, FiCalendar, FiTrash2 } from "react-icons/fi";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";
import FilterDropdown from "../components/FilterDropdown";
import AddProductModal from "../components/AddProductModal";
import { useInventory } from "../context/InventoryContext";
import { toast } from "react-toastify";
import "../styles/pages/inventory.css";

const statusOptions = [
  { label: "All", value: "All" },
  { label: "In Stock", value: "In Stock" },
  { label: "Low Stock", value: "Low Stock" },
  { label: "Out of Stock", value: "Out of Stock" },
];

const sortOptions = [
  { label: "High to Low", value: "desc" },
  { label: "Low to High", value: "asc" },
];

const InventoryPage = () => {
  const { inventoryItems, addProduct, updateProductQuantity, deleteProduct } =
    useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortDirection, setSortDirection] = useState("desc");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalInstanceKey, setModalInstanceKey] = useState(0);
  const [quantityDrafts, setQuantityDrafts] = useState({});

  useEffect(() => {
    setQuantityDrafts((currentDrafts) => {
      const nextDrafts = {};

      inventoryItems.forEach((item) => {
        nextDrafts[item.idNo] = currentDrafts[item.idNo] ?? String(item.stocks);
      });

      return nextDrafts;
    });
  }, [inventoryItems]);

  const filteredInventory = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...inventoryItems]
      .filter((item) => {
        const searchableText = [
          item.idNo,
          item.productName,
          item.category,
          item.status,
          item.unit,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !normalizedSearch || searchableText.includes(normalizedSearch);
        const matchesStatus =
          selectedStatus === "All" || item.status === selectedStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((left, right) => {
        if (sortDirection === "asc") {
          return left.stocks - right.stocks;
        }

        return right.stocks - left.stocks;
      });
  }, [inventoryItems, searchTerm, selectedStatus, sortDirection]);

  const inventoryStats = useMemo(
    () =>
      filteredInventory.reduce(
        (stats, item) => {
          stats.totalProducts += 1;
          stats.totalAssetsValue += item.stocks * item.costPrice;

          if (item.status === "In Stock") {
            stats.inStock += 1;
          }

          if (item.status === "Low Stock") {
            stats.lowStock += 1;
          }

          if (item.status === "Out of Stock") {
            stats.outOfStock += 1;
          }

          return stats;
        },
        {
          totalProducts: 0,
          totalAssetsValue: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
        }
      ),
    [filteredInventory]
  );

  const totalStockBuckets = Math.max(
    inventoryStats.inStock +
      inventoryStats.lowStock +
      inventoryStats.outOfStock,
    1
  );

  const stockDistribution = {
    inStock: `${(inventoryStats.inStock / totalStockBuckets) * 100}%`,
    lowStock: `${(inventoryStats.lowStock / totalStockBuckets) * 100}%`,
    outOfStock: `${(inventoryStats.outOfStock / totalStockBuckets) * 100}%`,
  };

  const openAddModal = () => {
    setModalInstanceKey((current) => current + 1);
    setIsAddModalOpen(true);
  };

  const handleQuantityDraftChange = (idNo, nextValue) => {
    setQuantityDrafts((currentDrafts) => ({
      ...currentDrafts,
      [idNo]: nextValue,
    }));
  };

  const handleUpdateQuantity = (item) => {
    const draftValue = quantityDrafts[item.idNo];
    const parsedQuantity = Number(draftValue);

    if (
      draftValue === "" ||
      Number.isNaN(parsedQuantity) ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      toast.error("Quantity must be a whole number greater than or equal to 0");
      return;
    }

    if (parsedQuantity === item.stocks) {
      toast.info("Quantity is already up to date");
      return;
    }

    updateProductQuantity(item.idNo, parsedQuantity);
    toast.success(`${item.productName} quantity updated`);
  };

  const handleDeleteProduct = (item) => {
    const shouldDelete = window.confirm(
      `Delete ${item.productName} from inventory?`
    );

    if (!shouldDelete) {
      return;
    }

    deleteProduct(item.idNo);
    toast.success(`${item.productName} deleted`);
  };

  const inventoryColumns = useMemo(
    () => [
      { key: "sn", header: "S/N", width: "50px" },
      { key: "idNo", header: "ID No." },
      { key: "productName", header: "Product name" },
      { key: "category", header: "Category" },
      { key: "stocks", header: "Stocks" },
      {
        key: "status",
        header: "Status",
        sortable: true,
        render: (value) => {
          const statusClass = value.toLowerCase().replace(/\s+/g, "-");
          return <span className={`status-pill ${statusClass}`}>{value}</span>;
        },
      },
      {
        key: "actions",
        header: "Actions",
        width: "260px",
        render: (_, item) => (
          <div className="inventory-actions-cell">
            <input
              type="number"
              min="0"
              step="1"
              className="inventory-actions-qty"
              value={quantityDrafts[item.idNo] ?? String(item.stocks)}
              onChange={(event) =>
                handleQuantityDraftChange(item.idNo, event.target.value)
              }
              aria-label={`Update quantity for ${item.productName}`}
            />
            <button
              type="button"
              className="inventory-actions-save"
              onClick={() => handleUpdateQuantity(item)}
            >
              Save
            </button>
            <button
              type="button"
              className="inventory-actions-delete"
              onClick={() => handleDeleteProduct(item)}
              aria-label={`Delete ${item.productName}`}
            >
              <FiTrash2 />
            </button>
          </div>
        ),
      },
    ],
    [quantityDrafts]
  );

  const handleAddProduct = async (product) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      addProduct(product);
      toast.success("Product added successfully");
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inventory-wrapper">
      <Sidebar />

      <main className="inventory-main">
        <Navbar />

        <div className="inventory-content">
          <div className="inventory-header">
            <h1 className="page-title">Inventory</h1>
            <button
              className="add-product-btn"
              type="button"
              onClick={openAddModal}
            >
              <FiPlus /> Add Product
            </button>
          </div>

          <div className="summary-card">
            <div className="assets-value">
              <p className="label">Total Assets Value</p>
              <h2 className="value">
                ${inventoryStats.totalAssetsValue.toLocaleString()}
              </h2>
            </div>

            <div className="divider"></div>

            <div className="product-stock-stats">
              <div className="stats-header">
                <span className="product-count">
                  <strong>{inventoryStats.totalProducts}</strong> Product
                </span>
              </div>

              <div className="stock-progress-bar">
                <div
                  className="segment green"
                  style={{ width: stockDistribution.inStock }}
                ></div>
                <div
                  className="segment yellow"
                  style={{ width: stockDistribution.lowStock }}
                ></div>
                <div
                  className="segment red"
                  style={{ width: stockDistribution.outOfStock }}
                ></div>
              </div>

              <div className="stock-legend">
                <span className="legend-item">
                  <span className="dot green"></span> In stock:{" "}
                  <strong className="stock-value">
                    {inventoryStats.inStock}
                  </strong>
                </span>
                <span className="legend-item">
                  <span className="dot yellow"></span> low stock:{" "}
                  <strong className="stock-value">
                    {inventoryStats.lowStock}
                  </strong>
                </span>
                <span className="legend-item">
                  <span className="dot red"></span> out of stock:{" "}
                  <strong className="stock-value">
                    {inventoryStats.outOfStock}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="table-controls">
            <div className="table-search">
              <FiSearch className="search-icon-inner" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="filter-group">
              <button className="filter-btn" type="button">
                <FiCalendar /> Jan-Sept 2026
              </button>

              <FilterDropdown
                label="Status"
                value={selectedStatus}
                options={statusOptions}
                isOpen={openDropdown === "status"}
                onToggle={(isOpen) => setOpenDropdown(isOpen ? "status" : null)}
                onSelect={(value) => {
                  setSelectedStatus(value);
                  setOpenDropdown(null);
                }}
              />

              <FilterDropdown
                label="Sort"
                value={sortDirection === "desc" ? "High to Low" : "Low to High"}
                options={sortOptions}
                isOpen={openDropdown === "sort"}
                onToggle={(isOpen) => setOpenDropdown(isOpen ? "sort" : null)}
                onSelect={(value) => {
                  setSortDirection(value);
                  setOpenDropdown(null);
                }}
              />
            </div>
          </div>

          <Table columns={inventoryColumns} data={filteredInventory} />
        </div>
      </main>

      <AddProductModal
        key={modalInstanceKey}
        isOpen={isAddModalOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
};

export default InventoryPage;
