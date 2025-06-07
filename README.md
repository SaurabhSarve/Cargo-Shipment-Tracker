# 🚚 Cargo Shipments Tracker

A full-stack web application to monitor and manage cargo shipments in real-time. It allows users to create shipments, view live locations on maps, track ETAs, and visualize routes using Leaflet and OpenStreetMap.

---

## 📦 Features

- Create and manage cargo shipments
- Real-time geolocation tracking
- ETA calculation using haversine formula
- Route and live location display using Leaflet
- Shipment status updates (Pending, In Transit, Delivered)
- User-friendly dashboard with responsive UI

---

## 🛠️ Tech Stack


**Frontend:**
- React.js
- Leaflet.js
- Axios
- React Bootstrap
- Redux Toolkit

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- dotenv, bcrypt, cors

---

## 📁 Project Structure

/backend

├── models/ # Shipment & User models

├── routes/ # API routes (auth, shipment)

├── server.js # Express entry point

└── .env # Backend config

/frontend

├── components/

│ ├── dashboard/ # Dashboard UI

│ ├── login/ # Login screen

│ ├── signup/ # Signup screen

│ ├── ShipmentMap/ # Static map view

│ └── TrackShipment.js # Live location tracking

├── hooks/ # Custom hooks (ETA fetcher)

├── redux/ # Actions, reducers, store

├── App.js # Frontend entry point

└── .env # Frontend API config
