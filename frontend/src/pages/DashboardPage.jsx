import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Card from "../components/Layout/Cards";
import Table from "../components/Layout/Tables";
import {
  FiBox,
  FiTrendingUp,
  FiAlertTriangle,
  FiTrendingDown,
} from "react-icons/fi";
import { useMemo } from "react";
import { useInventory } from "../context/InventoryContext";
import "../styles/pages/dashboard.css";

const dashboardColumns = [
  { key: "productName", header: "Product" },
  { key: "category", header: "Category" },
  { key: "stocks", header: "Stock" },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const statusClass = value.toLowerCase().replace(/\s+/g, "-");
      return <span className={`status-pill ${statusClass}`}>{value}</span>;
    },
  },
];

const DashboardPage = () => {
  const { inventoryItems } = useInventory();

  const dashboardStats = useMemo(() => {
    const totals = inventoryItems.reduce(
      (stats, item) => {
        stats.totalProducts += 1;
        stats.totalValue += item.stocks * item.costPrice;

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
        totalValue: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
      }
    );

    return [
      {
        title: "Total Products",
        amount: totals.totalProducts,
        icon: FiBox,
        iconColor: "blue",
      },
      {
        title: "Total Value",
        amount: `$${totals.totalValue.toLocaleString()}`,
        icon: FiTrendingUp,
        iconColor: "green",
      },
      {
        title: "Low Stock",
        amount: totals.lowStock,
        icon: FiAlertTriangle,
        iconColor: "yellow",
      },
      {
        title: "Out of Stock",
        amount: totals.outOfStock,
        icon: FiTrendingDown,
        iconColor: "red",
      },
    ];
  }, [inventoryItems]);

  const recentProducts = [...inventoryItems].slice(-5).reverse();

  return (
    <div className="dashboard-wrapper">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="content-padding">
          <div className="stats-grid">
            {dashboardStats.map((stat) => (
              <Card
                key={stat.title}
                title={stat.title}
                amount={stat.amount}
                icon={stat.icon}
                iconColor={stat.iconColor}
              />
            ))}
          </div>

          <section className="table-section">
            <h2 className="section-title">Recent inventory additions</h2>
            <Table columns={dashboardColumns} data={recentProducts} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
