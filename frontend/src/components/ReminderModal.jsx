import { useEffect, useRef, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiRepeat,
  FiX,
} from "react-icons/fi";
import "../styles/components/reminderModal.css";
import { formatDateForInput } from "../utils/helperFn";

const initialFormState = {
  title: "",
  mode: "One-time",
  date: "",
  time: "",
  frequency: "Daily",
  weekday: "Monday",
  monthDay: "1",
  note: "",
};

const weekdayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const monthDayOptions = Array.from({ length: 31 }, (_, index) =>
  String(index + 1)
);

const reminderModeOptions = ["One-time", "Recurring"];
const frequencyOptions = ["Daily", "Weekly", "Monthly"];

const buildInitialFormState = (initialReminder) => {
  if (!initialReminder) {
    return initialFormState;
  }

  return {
    title: initialReminder.title ?? "",
    mode: initialReminder.mode ?? "One-time",
    date: formatDateForInput(initialReminder.date) ?? "",
    time: initialReminder.time ?? "",
    frequency: initialReminder.frequency || "Daily",
    weekday: initialReminder.weekday || "Monday",
    monthDay: initialReminder.monthDay || "1",
    note: initialReminder.note ?? "",
  };
};

const DropdownField = ({
  label,
  value,
  options,
  icon,
  onSelect,
  placeholder,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="reminder-dropdown">
      <span>{label}</span>
      <button
        type="button"
        className={`reminder-dropdown-trigger${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="reminder-dropdown-trigger-label">
          {icon}
          {value || placeholder}
        </span>
        <FiChevronDown className="reminder-dropdown-trigger-icon" />
      </button>
      <div className={`reminder-dropdown-menu${isOpen ? " is-open" : ""}`}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`reminder-dropdown-item${
              value === option ? " is-selected" : ""
            }`}
            onClick={() => {
              onSelect(option);
              setIsOpen(false);
            }}
          >
            <span>{option}</span>
            {value === option && <FiCheck />}
          </button>
        ))}
      </div>
      {error && <small>{error}</small>}
    </div>
  );
};

const ReminderModal = ({ isOpen, onClose, onSubmit, initialReminder }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(initialReminder);

  useEffect(() => {
    if (isOpen) {
      setFormData(buildInitialFormState(initialReminder));
      setErrors({});
    }
  }, [isOpen, initialReminder]);

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

    if (!formData.title.trim()) {
      nextErrors.title = "Reminder title is required";
    }

    if (!formData.time) {
      nextErrors.time = "Time is required";
    }

    if (formData.mode === "One-time") {
      if (!formData.date) {
        nextErrors.date = "Choose a reminder date";
      }
    
      if (formData.date && formData.time) {
        const reminderDateTime = new Date(
          `${formData.date}T${formData.time}`
        );
      
        if (reminderDateTime <= new Date()) {
          nextErrors.date = "Date and time must be in the future";
        }
      }
    } else if (
      formData.frequency === "Weekly" &&
      !formData.weekday
    ) {
      nextErrors.weekday = "Pick a weekday";
    } else if (
      formData.frequency === "Monthly" &&
      !formData.monthDay
    ) {
      nextErrors.monthDay = "Pick a day of the month";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      mode: formData.mode,
      date: formData.date,
      time: formData.time,
      frequency: formData.mode === "Recurring" ? formData.frequency : "",
      weekday: formData.mode === "Recurring" ? formData.weekday : "",
      monthDay: formData.mode === "Recurring" ? formData.monthDay : "",
      note: formData.note.trim(),
      status: formData.mode === "One-time" ? "Scheduled" : "Active",
    });
  };

  const isRecurring = formData.mode === "Recurring";

  return (
    <div
      className={`reminder-modal-overlay${isOpen ? " is-open" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`reminder-modal${isOpen ? " is-open" : ""}`}>
        <div className="reminder-modal-header">
          <div className="reminder-modal-title-wrap">
            <p className="reminder-modal-eyebrow">
              <FiRepeat /> Reminder setup
            </p>
            <h2 className="reminder-modal-title">
              {isEditing ? "Edit reminder" : "Create a reminder"}
            </h2>
            <p className="reminder-modal-copy">
              {isEditing
                ? "Update the schedule, details, or repeat pattern for this reminder."
                : "Choose a one-time date or set a recurring pattern for daily, weekly, or monthly nudges."}
            </p>
          </div>
          <button
            type="button"
            className="reminder-modal-close"
            onClick={onClose}
            aria-label="Close reminder modal"
          >
            <FiX />
          </button>
        </div>

        <form className="reminder-modal-form" onSubmit={handleSubmit}>
          <div className="reminder-mode-switch">
            {reminderModeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`mode-chip${
                  formData.mode === option ? " is-active" : ""
                }`}
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    mode: option,
                  }))
                }
              >
                {option}
              </button>
            ))}
          </div>

          <div className="reminder-grid">
            <label className="reminder-field reminder-field-full">
              <span>Reminder title</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Follow up with supplier"
              />
              {errors.title && <small>{errors.title}</small>}
            </label>

            {!isRecurring ? (
              <>
                <label className="reminder-field">
                  <span>
                    <FiCalendar /> Date
                  </span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                  {errors.date && <small>{errors.date}</small>}
                </label>

                <label className="reminder-field">
                  <span>
                    <FiClock /> Time
                  </span>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                  {errors.time && <small>{errors.time}</small>}
                </label>
              </>
            ) : (
              <>
                <DropdownField
                  label="Repeat"
                  value={formData.frequency}
                  placeholder="Select repeat pattern"
                  icon={<FiRepeat />}
                  options={frequencyOptions}
                  onSelect={(value) =>
                    setFormData((current) => ({
                      ...current,
                      frequency: value,
                    }))
                  }
                />

                <label className="reminder-field">
                  <span>
                    <FiClock /> Time
                  </span>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                  {errors.time && <small>{errors.time}</small>}
                </label>

                {formData.frequency === "Weekly" && (
                  <DropdownField
                    label="Day of week"
                    value={formData.weekday}
                    placeholder="Pick a weekday"
                    icon={<FiCalendar />}
                    options={weekdayOptions}
                    error={errors.weekday}
                    onSelect={(value) =>
                      setFormData((current) => ({
                        ...current,
                        weekday: value,
                      }))
                    }
                  />
                )}

                {formData.frequency === "Monthly" && (
                  <DropdownField
                    label="Day of month"
                    value={formData.monthDay}
                    placeholder="Pick a day"
                    icon={<FiCalendar />}
                    options={monthDayOptions}
                    error={errors.monthDay}
                    onSelect={(value) =>
                      setFormData((current) => ({
                        ...current,
                        monthDay: value,
                      }))
                    }
                  />
                )}
              </>
            )}

            <label className="reminder-field reminder-field-full">
              <span>Note</span>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Optional reminder note or context"
                rows="4"
              />
            </label>
          </div>

          <div className="reminder-modal-actions">
            <button
              type="button"
              className="reminder-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="reminder-primary">
              {isEditing ? "Update reminder" : "Save reminder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
