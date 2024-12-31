# UTE TOEIC

## Overview
**UTE TOEIC** is a multi-platform learning application designed to help students prepare for TOEIC exams. It offers features such as realistic mock tests, role-based user management, and support for uploading test content via Excel, images, and audio files. The project includes a web application, Android app, and Chrome extension to provide seamless access across devices.

## Features
- **Mock TOEIC Tests**: Simulates TOEIC exams with 99% accuracy.
- **Content Management**: Allows uploading and managing test content through Excel, images, and audio files.
- **Offline Functionality**: Utilizes Web Workers and IndexedDB for efficient data handling.
- **Progress Tracking**: Integrated with Chart.js for detailed user progress visualization.
- **Role-based Access Control**: Differentiates user privileges (e.g., admins, students).
- **Multi-platform Support**: Accessible via web, Android, and Chrome extension.
- **Authentication**: Secured with Google OAuth2 for user login and access control.

## Technologies
### Frontend (Web)
- **Languages**: TypeScript, JavaScript
- **Frameworks/Libraries**: ReactJS, PrimeReact, PrimeFlex
- **Tools**: Chart.js, React.lazy, Web Workers, IndexedDB
- **Optimization**: Prefetching techniques and async/await for improved performance

### Backend
- **Technology**: Java Spring Boot
- **Database**: MongoDB
- **Hosting**: Azure

### Mobile
- **Framework**: React Native

### Chrome Extension
- Built with web technologies to integrate with the browser seamlessly.

## Installation
### Prerequisites
- **Node.js** and **npm**
- **MongoDB** for backend database
- **Java** for Spring Boot backend
- A Google Cloud project with OAuth2 credentials

### Steps to Run
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Tuavsn/toiec_practice_frontend.git
