# 🍽️ Mall Food Court Management Platform (Full-Stack Project)
📌 Project Overview

This project is a real-world full-stack web platform designed to connect all food courts inside a mall into a single website. It enables users to order food online from multiple food stalls, while providing dedicated dashboards for Food Owners, Delivery Boys, and Admin Authority to manage operations efficiently.

The system is built as a multi-role, multi-dashboard architecture, closely simulating how an actual mall food ecosystem works.

👥 User Roles & Responsibilities

🧑‍🍳 User

1. Create an account and manage personal profile

2. Browse available food stalls and menus

3. Add food items to cart and place orders

4. Make online payments

5. Receive OTP for delivery verification

6. Get invoice automatically via email after successful delivery

🏪 Food Owner

1. Register and manage food stalls

2. Add, update, or remove food items

3. Control food availability, prices, and quantities

4. Accept or reject user orders

5. Monitor stall and order status in real time

🚴 Delivery Boy

1. Create profile and manage availability status

2. Automatically receive delivery assignments

3. Deliver food orders to users

4. Verify delivery using OTP

5. Update delivery status after successful verification

🛠️ Admin Authority

1. Monitor the entire business ecosystem

2. View all users, food owners, delivery boys, and stalls

3. Track all orders and transactions

4. Monitor delivery availability and order status

5. Access complete business analytics and records

⚙️ Project Workflow

1. User registers and logs into the main website.

2. User selects food items, adds them to cart, and places an order after payment.

3. Food Owner receives the order request and accepts or declines it.

4. Upon acceptance, a Delivery Boy is automatically assigned using a Round Robin algorithm.

5. An OTP is sent to the user for delivery authentication.

6. Delivery Boy delivers the order and submits the OTP.

7. If OTP matches, order status is updated to Delivered.

8. An invoice is automatically generated and emailed to the user.

9. Admin can monitor every step of this workflow in real time.

🧠 Delivery Assignment Logic

1. Implemented Round Robin Algorithm for fair and automatic delivery boy assignment

2. Ensures equal workload distribution among available delivery boys

3. Delivery boys can enable or disable their availability

🧑‍💻 Tech Stack Used
🌐 Frontend

1. React (Vite)

2. Normal CSS (User, Food Owner, Delivery Boy dashboards)

3. Tailwind CSS (Admin dashboard)

🔧 Backend

1. Node.js

2. Express.js

3. MongoDB (Database)

4. REST APIs

🔐 Other Features

1. Role-based authentication

2. OTP-based delivery verification

3. Automated invoice generation via email

4. Secure order and transaction handling

🤝 Team Contribution

This was a group project with distributed responsibilities:

My Contribution

1. Frontend development for User, Food Owner, and Delivery Boy

2. Backend development for User module

Teammate Contribution

1. Admin frontend development

2. Backend development for Admin, Food Owner, and Delivery Boy modules

🎯 Key Highlights

1. Real-world multi-role system design

2. Scalable and modular architecture

3. Automated delivery assignment

4. Secure OTP verification

5. Centralized admin monitoring system
