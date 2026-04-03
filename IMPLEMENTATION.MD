# Implementation Plan

## Project Structure

internet-speed-monitor

main
- main.js
- networkMonitor.js

renderer
- index.html
- ui.js
- styles.css

package.json

---

## Step 1 – Setup Project

Create project folder.

Initialize Node project.

npm init

Install dependencies.

npm install electron systeminformation chart.js

---

## Step 2 – Create Electron Window

Create a small frameless Electron window.

Window properties:

- frameless
- always on top
- small width
- positioned at screen edge

Example configuration:

frame: false  
alwaysOnTop: true  
resizable: false

---

## Step 3 – Build Sidebar

Create a thin vertical sidebar.

The sidebar should be positioned on the edge of the screen.

When clicked:

- show pop-out dashboard

---

## Step 4 – Create Pop-out Dashboard

The dashboard should appear next to the sidebar.

The panel contains:

- download speed
- upload speed
- speed graph
- network info

The dashboard should remain small and should not occupy the full screen.

---

## Step 5 – Implement Network Monitor

Create a background module to collect network statistics.

Use the **systeminformation** library.

Read network stats every **1 second**.

Calculate:

download speed  
upload speed

using byte difference between two readings.

---

## Step 6 – Send Data to UI

Use Electron IPC to send speed data to the renderer process.

Data sent:

download speed  
upload speed  
ping

The UI updates every second.

---

## Step 7 – Implement Speed Graph

Use Chart.js to display speed history.

Store last **60 seconds** of data.

Update graph continuously.

---

## Step 8 – Optimize Resource Usage

Avoid heavy frameworks.

Use:

- plain HTML
- vanilla JavaScript
- minimal CSS

This keeps the memory footprint low.

---

## Step 9 – Package Application

Use electron-builder to generate desktop builds.

Outputs:

Windows executable  
macOS package  
Linux package