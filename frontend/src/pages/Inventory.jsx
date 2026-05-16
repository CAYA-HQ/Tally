import { useMemo, useState } from "react";
import { FiPlus, FiSearch, FiCalendar } from "react-icons/fi";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";
import FilterDropdown from "../components/FilterDropdown";
import AddProductModal from "../components/AddProductModal";
import { toast } from "react-toastify";
import "../styles/pages/inventory.css";

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

const inventoryColumns = [
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
];

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

const createInventoryStatus = (quantity) => {
  if (quantity <= 0) {
    return "Out of Stock";
  }

  if (quantity <= 20) {
    return "Low Stock";
  }

  return "In Stock";
};

const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortDirection, setSortDirection] = useState("desc");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalInstanceKey, setModalInstanceKey] = useState(0);

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

  const handleAddProduct = (product) => {
    setInventoryItems((currentItems) => {
      const nextItem = {
        sn: currentItems.length + 1,
        idNo: `INV-${String(Date.now()).slice(-6)}`,
        productName: product.inventoryName,
        category: product.category,
        stocks: product.quantity,
        status: createInventoryStatus(product.quantity),
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        unit: product.unit || "-",
      };

      return [...currentItems, nextItem];
    });

    toast.success("Product added successfully");
  };

  const openAddModal = () => {
    setModalInstanceKey((current) => current + 1);
    setIsAddModalOpen(true);
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
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
};

export default InventoryPage;
