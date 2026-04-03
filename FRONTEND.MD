# Frontend

## Overview
The frontend is responsible for displaying the sidebar widget and the pop-out dashboard that shows internet speed and network information.

---

## Technologies

- React
- Electron Renderer
- Chart.js
- CSS

---

## Main Components

### Sidebar
A thin vertical bar attached to the edge of the screen.

Functions:

- Open dashboard
- Close dashboard

---

### Dashboard Popout

A small panel that appears next to the sidebar.

Displays:

- Download speed
- Upload speed
- Speed graph
- Network information

The panel should not occupy the full screen.

---

### Speed Display

Text or gauge showing:

- Download speed
- Upload speed

Updates every second.

---

### Speed Graph

Line graph showing network speed history.

Displays last **60 seconds** of data.

Updates every second.

---

## UI States

Collapsed sidebar

Sidebar clicked → dashboard pop-out

Dashboard updating with new speed data