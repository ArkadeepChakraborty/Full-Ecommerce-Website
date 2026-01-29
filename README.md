# 🍽️ Mall Food Court Management Platform (Full-Stack Project)
📌 Project Overview

This project is a real-world full-stack web platform designed to connect all food courts inside a mall into a single website. It enables users to order food online from multiple food stalls, while providing dedicated dashboards for Food Owners, Delivery Boys, and Admin Authority to manage operations efficiently.

The system is built as a multi-role, multi-dashboard architecture, closely simulating how an actual mall food ecosystem works.

👥 User Roles & Responsibilities
🧑‍🍳 User

Create an account and manage personal profile

Browse available food stalls and menus

Add food items to cart and place orders

Make online payments

Receive OTP for delivery verification

Get invoice automatically via email after successful delivery

🏪 Food Owner

Register and manage food stalls

Add, update, or remove food items

Control food availability, prices, and quantities

Accept or reject user orders

Monitor stall and order status in real time

🚴 Delivery Boy

Create profile and manage availability status

Automatically receive delivery assignments

Deliver food orders to users

Verify delivery using OTP

Update delivery status after successful verification

🛠️ Admin Authority

Monitor the entire business ecosystem

View all users, food owners, delivery boys, and stalls

Track all orders and transactions

Monitor delivery availability and order status

Access complete business analytics and records

⚙️ Project Workflow

User registers and logs into the main website.

User selects food items, adds them to cart, and places an order after payment.

Food Owner receives the order request and accepts or declines it.

Upon acceptance, a Delivery Boy is automatically assigned using a Round Robin algorithm.

An OTP is sent to the user for delivery authentication.

Delivery Boy delivers the order and submits the OTP.

If OTP matches, order status is updated to Delivered.

An invoice is automatically generated and emailed to the user.

Admin can monitor every step of this workflow in real time.

🧠 Delivery Assignment Logic

Implemented Round Robin Algorithm for fair and automatic delivery boy assignment

Ensures equal workload distribution among available delivery boys

Delivery boys can enable or disable their availability

🧑‍💻 Tech Stack Used
🌐 Frontend

React (Vite)

Normal CSS (User, Food Owner, Delivery Boy dashboards)

Tailwind CSS (Admin dashboard)

🔧 Backend

Node.js

Express.js

MongoDB (Database)

REST APIs

🔐 Other Features

Role-based authentication

OTP-based delivery verification

Automated invoice generation via email

Secure order and transaction handling

🤝 Team Contribution

This was a group project with distributed responsibilities:

My Contribution

Frontend development for User, Food Owner, and Delivery Boy

Backend development for User module

Teammate Contribution

Admin frontend development

Backend development for Admin, Food Owner, and Delivery Boy modules

🎯 Key Highlights

Real-world multi-role system design

Scalable and modular architecture

Automated delivery assignment

Secure OTP verification

Centralized admin monitoring system
