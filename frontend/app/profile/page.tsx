"use client";

import { UserHistory } from "../components/UserHistory";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showLogout />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Profile
            </h1>
            <p className="text-lg text-gray-600">
              View your recommendation history and provide feedback
            </p>
          </div>

          <UserHistory />
        </div>
      </main>
      <Footer />
    </div>
  );
}
