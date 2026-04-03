# Backend

## Overview

The backend is responsible for collecting network statistics from the system and sending the data to the UI.

The backend runs in the Electron **main process** and acts as a lightweight background monitor.

Its responsibilities include:

- reading system network statistics
- calculating download speed
- calculating upload speed
- measuring ping
- sending data updates to the renderer UI

---

## Architecture

The backend consists of two main parts.

### Network Monitor Module

A background module that reads network statistics every second and calculates internet speed.

Responsibilities:

- read transmitted and received bytes
- calculate speed difference
- track network changes

---

### Main Process Controller

The Electron main process controls:

- application lifecycle
- window creation
- communication with the UI

The main process sends network data to the renderer using Electron IPC.

---

## Technologies

Runtime:

- Node.js

Libraries:

- systeminformation

Purpose of systeminformation:

- access system network statistics
- read received and transmitted byte counts

---

## Speed Calculation

Network statistics are read once every **1 second**.

Download speed is calculated using the difference between received bytes.

Upload speed is calculated using the difference between transmitted bytes.

Formula:

download_speed = (current_rx_bytes - previous_rx_bytes) / time_interval

upload_speed = (current_tx_bytes - previous_tx_bytes) / time_interval

This gives real-time network speed.

---

## Ping Measurement

Ping is measured by sending a request to a stable external server.

Example server:

8.8.8.8

The response time is used as the ping value.

---

## Data Flow

Network statistics are collected by the backend module.

The backend sends updates to the UI every second.

Example data structure sent to the UI:

{
  download: number,
  upload: number,
  ping: number
}

---

## Communication with Frontend

Electron IPC is used to send network data from the main process to the renderer.

Process:

1. backend collects speed data
2. backend sends data using IPC
3. renderer receives data
4. UI updates speed values and graph