# Tally: Inventory and Task Management System

Tally is a comprehensive web application designed to help users streamline their business operations through efficient inventory management, task tracking, and insightful data visualization. This project was developed following a rigorous **2-week execution plan**.

## Key Objectives

By the conclusion of the development cycle, the system supports the following core features:

* 
Authentication & Onboarding: Secure sign-up, email verification, and a multi-step onboarding process.


* 
Inventory Management: Full CRUD (Create, Read, Update, Delete) capabilities for managing product stocks, assets, and categories.


* 
Task & Record Tracking: A dedicated system to create and manage business tasks and reminders.


* 
Data Dashboard: A centralized view of business metrics, including total assets value, revenue, and sales trends.


* 
Real-time Notifications: Basic notification UI for alerts and toasts.



## Tech Stack

* 
Frontend: React (JSX), React Router for navigation.


* 
Styling: Vanilla CSS for custom, high-performance UI components.


* Icons: React Icons (Fi, Lu, Md, Ri, Io) for a modern interface.
* 
State & Auth: Cookie-based authentication and protected routing (Auth Guards).



##  Project Structure & Components

The project utilizes a modular, reusable component architecture:

### Core Components

* Reusable Table: A generic table component that accepts dynamic `columns` and `data`, supporting custom rendering for different page needs (e.g., Inventory vs. Task History).
* Stat Cards: Reusable cards used on the dashboard to display key metrics like Capital, Revenue, and Sales with integrated chart visualizations.
* 
Guards: `AuthGuard` and `GuestGuard` to manage page access based on user authentication status.



### Main Pages

* 
**Dashboard**: Features metric cards, visual charts, and an "Upcoming Reminders" summary.



Inventory: Includes a total assets summary, stock status progress bar (In stock, Low stock, Out of stock), and a detailed searchable product table.


 
Task/Record: A dedicated area for managing business tasks with status tracking.



Orders: Detailed tracking of customer orders and history.



Note: This project follows a "visible progress" rule—ensuring that at the end of every development day, a functional part of the UI or logic is built and demonstrable.