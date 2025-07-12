import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "../lib/api";

interface HeaderProps {
  showLogout?: boolean;
}

export function Header({ showLogout }: HeaderProps) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.push("/auth");
  };
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield
              className="h-8 w-8 text-blue-600 cursor-pointer"
              onClick={() => router.push("/")}
            />
            <span className="text-xl font-bold text-gray-900">LifeGuard</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              How It Works
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </nav>
          {showLogout && (
            <div className="flex gap-2 ml-4">
              <button
                className="bg-gray-100 hover:bg-blue-50 text-blue-700 rounded-md px-4 py-2 font-semibold transition-colors border border-blue-200"
                onClick={() => router.push("/profile")}
              >
                Profile
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 font-semibold transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
