import { Shield } from "lucide-react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export function LandingPage() {
  const router = useRouter();

  const buttonText = "Get Started";
  const buttonAction = () => router.push("/auth");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">LifeGuard</span>
          </div>
          <Button
            onClick={buttonAction}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 text-base font-semibold shadow-md transition-colors"
          >
            {buttonText}
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center text-center md:text-left px-4 py-8 md:py-16 gap-8 md:gap-16">
        <motion.div
          className="flex flex-col items-center md:items-start"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to LifeGuard
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
            Secure your future with personalized life insurance recommendations.
            Get started to find the best coverage for you and your loved ones.
          </p>
          <Button
            size="lg"
            onClick={buttonAction}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-8 py-3 text-lg font-semibold shadow-md transition-colors"
          >
            {buttonText}
          </Button>
        </motion.div>
        <motion.div
          className="flex-1 flex justify-center items-center w-full max-w-md md:max-w-lg lg:max-w-xl"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring", delay: 0.2 }}
        >
          <Image
            src="/hero-section-image.png"
            alt="Hero section illustration"
            width={800}
            height={400}
            className="w-full h-auto object-contain"
            style={{ maxHeight: 400 }}
          />
        </motion.div>
      </main>
    </div>
  );
}
