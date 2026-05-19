import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { TailSpin } from "react-loader-spinner";
import "../styles/components/addProductModal.css";

const initialFormState = {
  inventoryName: "",
  category: "",
  costPrice: "",
  sellingPrice: "",
  unit: "",
  quantity: "",
};

const AddProductModal = ({
  isOpen,
  isSubmitting = false,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleEscape = (event) => {
      if (isOpen && !isSubmitting && event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSubmitting, onClose]);

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
  };

  return (
    <div
      className={`inventory-modal-overlay${isOpen ? " is-open" : ""}`}
      onMouseDown={(event) => {
        if (!isSubmitting && event.target === event.currentTarget) {
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
            disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              {errors.quantity && <small>{errors.quantity}</small>}
            </label>
          </div>

          <div className="inventory-modal-actions">
            <button
              type="button"
              className="inventory-modal-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inventory-modal-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inventory-modal-loading">
                  <TailSpin
                    height="18"
                    width="18"
                    color="#fff"
                    ariaLabel="saving inventory product"
                    radius="1"
                    visible
                  />
                  Saving...
                </span>
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
