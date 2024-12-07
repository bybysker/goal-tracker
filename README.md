# Goal Tracker App 🎯

A modern, intuitive web application designed to help users track and achieve their personal and professional goals. Built with Next.js 14, React, and TypeScript, featuring a beautiful UI with Tailwind CSS.

## 🌟 Live Demo

[Visit Goal Tracker App](https://goal-tracker-bybyskers-projects.vercel.app) - You can create a dummy acc to try

## ✨ Features

### Core Features
- 📊 **Interactive Dashboard**
  - Visual progress tracking
  - Goal completion statistics

- 🎯 **Goal Management**
  - Create and track multiple goals
  - Set deadlines and priorities
  - Track progress with subtasks


- 📝 **Task Management**
  - Create, edit, and delete tasks
  - Mark tasks as complete
  - Organize tasks by goals

- 👤 **User Profile**
  - Customize personal information
  - Track achievement history
  - Set preferences

### Additional Features
- 📱 **Responsive Design**
- 🔒 **Secure Authentication**
- 💾 **Data Persistence**

## 🛠️ Tech Stack

- **Frontend:**
  - Next.js 14 (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Lucide Icons

- **Backend:**
  - Python FastAPI
  - PostgreSQL
  - SQLAlchemy

- **Authentication:**
  - NextAuth.js
  - Google OAuth

- **Deployment:**
  - Frontend: Vercel
  - Backend: Google Cloud Run
  - Database: Google Cloud SQL

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- PostgreSQL
- Git

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/goal-tracker.git
   cd goal-tracker
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Set up Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/goaltracker
   SECRET_KEY=your_secret_key
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

## 📝 Project Structure

```
goal-tracker/
├── frontend/
│   ├── app/              # Next.js pages and layouts
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript types
├── backend/
│   ├── api/             # API routes
│   ├── models/          # Database models
│   └── services/        # Business logic
└── docs/               # Documentation
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Bybysker** - *Initial work* - [bybysker@gmail.com](mailto:bybysker@gmail.com)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries

## 📞 Support

If you have any questions or need help, please:
- Open an issue
- Contact us at [bybysker@gmail.com](mailto:bybysker@gmail.com)