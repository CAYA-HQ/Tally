import { FiAlertTriangle, FiX } from "react-icons/fi";
import "../styles/components/reminderModal.css";

const DeleteReminderModal = ({ isOpen, reminder, onClose, onConfirm }) => {
  if (!isOpen || !reminder) {
    return null;
  }

  return (
    <div
      className="delete-reminder-overlay is-open"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="delete-reminder-modal is-open">
        <div className="delete-reminder-icon-wrap">
          <FiAlertTriangle className="delete-reminder-icon" />
        </div>

        <button
          type="button"
          className="delete-reminder-close"
          onClick={onClose}
          aria-label="Close delete confirmation"
        >
          <FiX />
        </button>

        <div className="delete-reminder-content">
          <h2 className="delete-reminder-title">Delete reminder?</h2>
          <p className="delete-reminder-copy">
            This will remove <strong>{reminder.title}</strong> from your
            reminders list. This action cannot be undone.
          </p>
        </div>

        <div className="delete-reminder-actions">
          <button
            type="button"
            className="delete-reminder-cancel"
            onClick={onClose}
          >
            Keep reminder
          </button>
          <button
            type="button"
            className="delete-reminder-confirm"
            onClick={onConfirm}
          >
            Delete reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReminderModal;
