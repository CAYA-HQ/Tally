import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "../styles/components/addProductModal.css";

const initialFormState = {
  inventoryName: "",
  category: "",
  costPrice: "",
  sellingPrice: "",
  unit: "",
  quantity: "",
};

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleEscape = (event) => {
      if (isOpen && event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!formData.inventoryName.trim()) {
      nextErrors.inventoryName = "Inventory name is required";
    }

    if (!formData.category.trim()) {
      nextErrors.category = "Category is required";
    }

    if (formData.costPrice === "" || Number(formData.costPrice) <= 0) {
      nextErrors.costPrice = "Cost price is required";
    }

    if (formData.sellingPrice === "" || Number(formData.sellingPrice) <= 0) {
      nextErrors.sellingPrice = "Selling price is required";
    }

    if (formData.quantity === "" || Number(formData.quantity) < 0) {
      nextErrors.quantity = "Quantity is required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      inventoryName: formData.inventoryName.trim(),
      category: formData.category.trim(),
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      unit: formData.unit.trim(),
      quantity: Number(formData.quantity),
    });

    onClose();
  };

  return (
    <div
      className={`inventory-modal-overlay${isOpen ? " is-open" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`inventory-modal${isOpen ? " is-open" : ""}`}>
        <div className="inventory-modal-header">
          <div>
            <h2 className="inventory-modal-title">Add New Item</h2>
            <p className="inventory-modal-eyebrow">
              Start by adding an item you want to track. You can update it
              anytime.
            </p>
          </div>
          <button
            type="button"
            className="inventory-modal-close"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <form className="inventory-modal-form" onSubmit={handleSubmit}>
          <div className="inventory-modal-grid">
            <label className="inventory-modal-field">
              <span>Inventory name</span>
              <input
                type="text"
                name="inventoryName"
                value={formData.inventoryName}
                onChange={handleChange}
                placeholder="Enter inventory name"
              />
              {errors.inventoryName && <small>{errors.inventoryName}</small>}
            </label>

            <label className="inventory-modal-field">
              <span>Category</span>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
              {errors.category && <small>{errors.category}</small>}
            </label>

            <label className="inventory-modal-field">
              <span>Cost price</span>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="Enter cost price"
                min="0"
                step="0.01"
              />
              {errors.costPrice && <small>{errors.costPrice}</small>}
            </label>

            <label className="inventory-modal-field">
              <span>Selling price</span>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="Enter selling price"
                min="0"
                step="0.01"
              />
              {errors.sellingPrice && <small>{errors.sellingPrice}</small>}
            </label>

            <label className="inventory-modal-field">
              <span>
                Unit <em>(optional)</em>
              </span>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g. pcs, carton, box"
              />
            </label>

            <label className="inventory-modal-field">
              <span>Quantity</span>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                step="1"
              />
              {errors.quantity && <small>{errors.quantity}</small>}
            </label>
          </div>

          <div className="inventory-modal-actions">
            <button
              type="button"
              className="inventory-modal-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="inventory-modal-primary">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
