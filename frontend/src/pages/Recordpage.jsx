import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiCheckSquare,
  FiChevronDown,
} from "react-icons/fi";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import Table from "../components/Layout/Tables";
import "../styles/pages/record.css";
import ReminderModal from "../components/ReminderModal";
import DeleteReminderModal from "../components/DeleteReminderModal";

const initialReminders = [
  {
    id: 1,
    title: "Review vendor invoice",
    mode: "One-time",
    date: "24/06/2026",
    time: "10:30 AM",
    frequency: "",
    weekday: "",
    monthDay: "",
    note: "Approve before end of day.",
    status: "Scheduled",
  },
  {
    id: 2,
    title: "Check stock levels",
    mode: "Recurring",
    date: "",
    time: "09:00 AM",
    frequency: "Weekly",
    weekday: "Monday",
    monthDay: "",
    note: "Prepare reorder list.",
    status: "Active",
  },
  {
    id: 3,
    title: "Send monthly summary",
    mode: "Recurring",
    date: "",
    time: "05:00 PM",
    frequency: "Monthly",
    weekday: "",
    monthDay: "1",
    note: "Share with the finance team.",
    status: "Active",
  },
];

const RecordPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reminders, setReminders] = useState(initialReminders);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [dropdownState, setDropdownState] = useState({
    id: null,
    direction: "down",
  });
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [reminderToDelete, setReminderToDelete] = useState(null);

  useEffect(() => {
    const handleDismiss = (event) => {
      if (event.key === "Escape") {
        setDropdownState({ id: null, direction: "down" });
        return;
      }

      if (!event.target.closest?.(".more-options-wrap")) {
        setDropdownState({ id: null, direction: "down" });
      }
    };

    document.addEventListener("mousedown", handleDismiss);
    document.addEventListener("touchstart", handleDismiss);
    document.addEventListener("keydown", handleDismiss);

    return () => {
      document.removeEventListener("mousedown", handleDismiss);
      document.removeEventListener("touchstart", handleDismiss);
      document.removeEventListener("keydown", handleDismiss);
    };
  }, []);

  const reminderColumns = useMemo(
    () => [
      { key: "sn", header: "S/N", width: "50px" },
      { key: "title", header: "Reminder" },
      {
        key: "schedule",
        header: "Schedule",
        render: (_, row) => (
          <div className="record-schedule-cell">
            <span className="schedule-primary">{row.scheduleLabel}</span>
            <span className="schedule-secondary">{row.scheduleDetail}</span>
          </div>
        ),
      },
      {
        key: "status",
        header: (
          <div className="header-with-icon">
            Status <FiChevronDown className="header-dropdown-icon" />
          </div>
        ),
        render: (value, row) => (
          <div className="status-container">
            <span className={`status-pill ${value.toLowerCase()}`}>
              <FiCheckSquare className="status-icon" /> {value}
            </span>
            <div className="more-options-wrap">
              <button
                type="button"
                className="more-options-icon-btn"
                onClick={(event) => {
                  const buttonRect =
                    event.currentTarget.getBoundingClientRect();
                  const estimatedMenuHeight = 110;
                  const spaceBelow = window.innerHeight - buttonRect.bottom;
                  const spaceAbove = buttonRect.top;

                  const nextDirection =
                    spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow
                      ? "up"
                      : "down";

                  setDropdownState((current) =>
                    current.id === row.id
                      ? { id: null, direction: "down" }
                      : { id: row.id, direction: nextDirection }
                  );
                }}
                aria-label="Open reminder actions"
              >
                <FiMoreVertical className="more-options-icon" />
              </button>
              {dropdownState.id === row.id && (
                <div
                  className={`reminder-row-menu reminder-row-menu-${dropdownState.direction}`}
                >
                  <button
                    type="button"
                    className="reminder-row-menu-item"
                    onClick={() => {
                      setSelectedReminder(
                        reminders.find((item) => item.id === row.id) || null
                      );
                      setIsReminderModalOpen(true);
                      setDropdownOpenId(null);
                    }}
                  >
                    Edit reminder
                  </button>
                  <button
                    type="button"
                    className="reminder-row-menu-item danger"
                    onClick={() => {
                      setReminderToDelete(row);
                      setDropdownOpenId(null);
                    }}
                  >
                    Delete reminder
                  </button>
                </div>
              )}
            </div>
          </div>
        ),
      },
    ],
    [dropdownState, reminders]
  );

  const reminderData = useMemo(
    () =>
      reminders.map((reminder, index) => ({
        ...reminder,
        sn: index + 1,
        scheduleLabel:
          reminder.mode === "One-time"
            ? `Once on ${reminder.date}`
            : reminder.frequency,
        scheduleDetail:
          reminder.mode === "One-time"
            ? reminder.time
            : reminder.frequency === "Daily"
            ? `Every day at ${reminder.time}`
            : reminder.frequency === "Weekly"
            ? `Every ${reminder.weekday} at ${reminder.time}`
            : `Every month on day ${reminder.monthDay} at ${reminder.time}`,
      })),
    [reminders]
  );

  const handleAddReminder = (nextReminder) => {
    setReminders((current) => {
      if (selectedReminder) {
        return current.map((item) =>
          item.id === selectedReminder.id
            ? { ...nextReminder, id: selectedReminder.id }
            : item
        );
      }

      return [
        {
          ...nextReminder,
          id: Date.now(),
        },
        ...current,
      ];
    });
    setSelectedReminder(null);
    setIsReminderModalOpen(false);
  };

  const openAddReminderModal = () => {
    setSelectedReminder(null);
    setIsReminderModalOpen(true);
  };

  return (
    <div className="record-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="record-main">
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <div className="record-content">
          <div className="record-header">
            <h1 className="page-title">Reminders</h1>
            <div className="header-actions">
              <button className="icon-btn-gray" type="button">
                <FiFilter />
              </button>
              <button className="icon-btn-gray" type="button">
                <FiSearch />
              </button>
              <button
                className="add-task-btn"
                type="button"
                onClick={openAddReminderModal}
              >
                <FiPlus /> Add Reminder
              </button>
            </div>
          </div>
          {reminderData.length > 0 ? (
            <Table columns={reminderColumns} data={reminderData} />
          ) : (
            <div className="empty-reminders-state">
              <div className="empty-reminders-card">
                <p className="empty-reminders-eyebrow">No reminders yet</p>
                <h2 className="empty-reminders-title">
                  There are no current reminders.
                </h2>
                <p className="empty-reminders-copy">
                  Add a one-time reminder or set up a repeating schedule to get
                  started.
                </p>
                <button
                  type="button"
                  className="add-task-btn"
                  onClick={openAddReminderModal}
                >
                  <FiPlus /> Set Reminder
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setSelectedReminder(null);
        }}
        onSubmit={handleAddReminder}
        initialReminder={selectedReminder}
      />

      <DeleteReminderModal
        isOpen={Boolean(reminderToDelete)}
        reminder={reminderToDelete}
        onClose={() => setReminderToDelete(null)}
        onConfirm={() => {
          setReminders((current) =>
            current.filter((item) => item.id !== reminderToDelete?.id)
          );
          setReminderToDelete(null);
        }}
      />
    </div>
  );
};

export default RecordPage;
