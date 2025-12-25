import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account to start shopping with us.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white">
            SuperStore
          </Link>
          <p className="text-white/70 mt-2">Create an account to get started.</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>
          
          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-purple-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white/70 hover:text-white text-sm">
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}
