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
import api from "../utils/api";

const ReminderPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
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
            Status
            {/* <FiChevronDown className="header-dropdown-icon" /> */}
          </div>
        ),
        render: (value, row) => (
          <div className="status-container">
            <span className={`status-pill ${value?.toLowerCase()}`}>
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
                      : { id: row.id, direction: nextDirection },
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
                        reminders.find((item) => item.id === row.id) || null,
                      );
                      setIsReminderModalOpen(true);
                      setDropdownState({ id: null, direction: "down" });
                    }}
                  >
                    Edit reminder
                  </button>
                  <button
                    type="button"
                    className="reminder-row-menu-item danger"
                    onClick={() => {
                      setReminderToDelete(row);
                      setDropdownState({ id: null, direction: "down" });
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
    [dropdownState, reminders],
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
    [reminders],
  );

  const handleAddReminder = async (nextReminder) => {
    if(!nextReminder.frequency)nextReminder.frequency = "none";
    try {
      const res = selectedReminder
        ? await api.put(`/user/reminder/${selectedReminder.id}`, nextReminder)
        : await api.post("/user/reminder", nextReminder);

      const data = res.data;
   
      const id = data.id;
      const newReminder = data.alert;
      const date = newReminder.date.split('-').reverse().join('/')
      console.log('new reminder date: ', date)

      const remind = {
        id: id,
        title: newReminder.title,
        mode: newReminder.frequency === "none" ? "One-time" : "Recurring",
        date: newReminder.date ? date : "",
        time: newReminder.time,
        frequency: newReminder.frequency,
        weekday: newReminder.weekday || "",
        monthDay: newReminder.monthDay || "",
        note: newReminder.note,
        status: newReminder.sent ? "Sent" : "Scheduled",
      };
      console.log(new Date(newReminder.date).toLocaleDateString())

      setReminders((current) => {
        if (selectedReminder) {
          return current.map((item) =>
            item.id === selectedReminder.id ? { ...item, ...remind } : item,
          );
        }

        return [
          {
            ...remind,
            id: id,
          },
          ...current,
        ];
      });
      if (selectedReminder) window.location.reload();
      setSelectedReminder(null);
      setIsReminderModalOpen(false);
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  const openAddReminderModal = () => {
    setSelectedReminder(null);
    setIsReminderModalOpen(true);
  };
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await api.get("/user/reminder");
        const fetchedReminders = response.data.alerts || [];
        setReminders(
          fetchedReminders.map((reminder) => ({
            id: reminder._id,
            title: reminder.title,
            mode: reminder.frequency === "none" ? "One-time" : "Recurring",
            date: reminder.date
              ? reminder.date.split('-').join('/') : "",
            time: reminder.time,
            frequency: reminder.frequency,
            weekday: reminder.weekday || "",
            monthDay: reminder.monthDay || "",
            note: reminder.note,
            status: reminder.sent ? "Sent" : "Scheduled",
          })),
        );
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    fetchReminders();
    console.log("Fetch reminders called", reminders);
  }, []);

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
        reminder={reminderToDelete?.title}
        onClose={() => setReminderToDelete(null)}
        onConfirm={async () => {
          console.log("Deleting reminder with id:", reminderToDelete?.id);
          try {
            const id = reminderToDelete?._id || reminderToDelete?.id;
            const del = await api.delete(`/user/reminder/${id}`);
          } catch (error) {
            console.error("Error deleting reminder:", error);
            return error;
          }
          setReminders((current) =>
            current.filter((item) => item.id !== reminderToDelete?.id),
          );
          setReminderToDelete(null);
        }}
      />
    </div>
  );
};

export default ReminderPage;
