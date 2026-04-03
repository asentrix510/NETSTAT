# Internet Speed Edge Monitor – PRD

## Overview
Internet Speed Edge Monitor is a lightweight desktop utility that displays real-time internet speed through a small sidebar widget.

A thin bar remains attached to the edge of the screen. When the user clicks the bar, a small pop-out panel appears showing network statistics such as download speed, upload speed, and basic network information.

The panel is small and does not occupy the full screen, allowing users to quickly check internet speed without interrupting their workflow.

---

## Problem
Most internet speed monitoring tools require opening a separate application or browser tab. This interrupts the user's workflow.

This application solves the problem by providing a small edge widget that allows users to check network speed instantly.

---

## Goals

Primary goals:

- Provide real-time internet speed monitoring
- Allow quick access through an edge sidebar
- Maintain very low CPU and memory usage
- Avoid full-screen UI interruptions

---

## Core Features

### Edge Sidebar

A thin vertical bar attached to the edge of the screen.

Collapsed state:

- Thin clickable bar
- Minimal screen space usage

Expanded state:

- A small pop-out dashboard appears next to the bar

---

### Real-Time Speed Display

Displays:

- Download speed
- Upload speed

Update interval: **1 second**

---

### Speed Graph

Displays internet speed history for the last **60 seconds**.

---

### Network Information

Displays:

- WiFi name
- Connection type
- Ping

---

## Architecture

The application uses a lightweight architecture with two parts:

### Background Monitor

Responsible for:

- Reading network statistics
- Calculating download and upload speeds
- Sending updates to the UI

### UI Widget

Responsible for:

- Rendering the sidebar
- Displaying the pop-out dashboard
- Showing network data

---

## Target Users

- Developers
- Gamers
- Users who want quick internet monitoring

---

## Platform

Desktop only:

- Windows
- macOS
- Linux

---

## Success Criteria

- Speed updates every second
- Sidebar opens instantly
- Pop-out panel is small and non-intrusive
- Memory usage stays low