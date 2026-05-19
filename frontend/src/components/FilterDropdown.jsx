import { useEffect, useRef } from "react";
import { LuChevronDown } from "react-icons/lu";
import "../styles/components/filterDropdown.css";

const FilterDropdown = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}) => {
  const rootRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        isOpen &&
        rootRef.current &&
        !rootRef.current.contains(event.target)
      ) {
        onToggle(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onToggle(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onToggle]);

  return (
    <div ref={rootRef} className="inventory-dropdown">
      <button
        type="button"
        className={`filter-btn inventory-dropdown-trigger${
          isOpen ? " is-open" : ""
        }`}
        onClick={() => onToggle(!isOpen)}
      >
        {label}: {value}
        <LuChevronDown
          className={`inventory-dropdown-icon${isOpen ? " is-open" : ""}`}
        />
      </button>

      <div className={`inventory-dropdown-menu${isOpen ? " is-open" : ""}`}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`inventory-dropdown-item${
              value === option.label || value === option.value
                ? " is-selected"
                : ""
            }`}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterDropdown;
