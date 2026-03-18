Railway Traffic Control AI Prototype

A comprehensive web application prototype for AI-powered railway traffic control system, designed for hackathon presentation.

Features

🎯 Dashboard

Real-time metrics display (throughput, delays, utilization, on-time performance)
Interactive charts and visualizations
Live data updates every 2 seconds
Track utilization pie charts
🚂 Live Simulation

Animated train movement visualization
Multiple scenario testing:
Normal operations
VIP train priority
Track washout emergency
Heavy congestion
Real-time train status monitoring
System alerts and notifications
📊 What-If Analysis

Scenario comparison tool
Performance impact analysis
Cost-benefit calculations
Time series analysis
Interactive charts for all scenarios
🤖 AI Recommendations

Intelligent analysis and recommendations
Priority-based categorization
Impact and effort assessment
Implementation timelines
Confidence scoring
Getting Started

Prerequisites

Node.js (v16 or higher)
npm or yarn
Installation

Install dependencies:
npm install
Start the development server:
npm run dev
Open your browser and navigate to http://localhost:3000
Building for Production

npm run build
Project Structure

src/
├── components/
│   └── Navbar.jsx          # Navigation component
├── pages/
│   ├── Dashboard.jsx       # Main dashboard with metrics
│   ├── LiveSimulation.jsx  # Train simulation with scenarios
│   ├── WhatIfAnalysis.jsx  # Scenario comparison tool
│   └── AIRecommendations.jsx # AI-powered recommendations
├── App.jsx                 # Main app component with routing
├── main.jsx               # React entry point
└── index.css              # Global styles and Tailwind CSS
Key Technologies

React 18 - Frontend framework
React Router - Client-side routing
Tailwind CSS - Utility-first CSS framework
Recharts - Data visualization library
Framer Motion - Animation library
Lucide React - Icon library
Vite - Build tool and dev server
Presentation Tips

Dashboard: Show real-time metrics and explain how AI monitoring improves efficiency
Live Simulation: Demonstrate different scenarios and how the system adapts
What-If Analysis: Compare scenarios and show cost-benefit analysis
AI Recommendations: Highlight intelligent decision-making and automation
Customization

Modify train data in LiveSimulation.jsx
Update metrics in Dashboard.jsx
Add new scenarios in WhatIfAnalysis.jsx
Customize AI recommendations in AIRecommendations.jsx
Demo Scenarios

Normal Operations: Show baseline performance
VIP Train: Demonstrate priority handling
Track Washout: Show emergency response
Congestion: Display traffic management

## 👩‍💻 Contribution
- Developed an AI-powered railway traffic control prototype in a hackathon environment  
- Built real-time simulation workflows and interactive dashboards  
- Designed scenario-based analysis tools and decision-support logic  
- Delivered a scalable, presentation-ready application using modern frontend technologies  

## 📌 Conclusion
This project showcases how intelligent systems can transform traditional infrastructure into data-driven, adaptive, and efficient networks.
