# GoalTrackerApp

**GoalTrackerApp** is a Next.js-based web application designed to help users manage their personal and professional goals. Featuring goal setting, task management, challenge tracking, calendar integration, voice memos, and AI-driven insights, it offers a seamless and interactive experience using React, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Dashboard**: Overview of goals, challenges, progress tracking, and AI insights.
- **Goals & Challenges**: Create, edit, and delete goals and challenges with deadlines and categories.
- **Tasks Management**: Add, edit, delete, and toggle task completion.
- **Calendar Integration**: View and manage tasks on specific dates.
- **Voice Memos**: Record and transcribe voice memos for daily reflections.
- **AI Insights**: Receive AI-generated insights based on your activities.
- **Settings**: Customize preferences including dark mode and API key management.
- **User Profile**: View and update user profile information.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Firebase](https://firebase.google.com/) (optional)
- [OpenAI API](https://openai.com/api/)


Configure Environment Variables
Create a .env.local file in the root directory and add the necessary environment variables:

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

OPENAI_API_KEY=your_openai_api_key