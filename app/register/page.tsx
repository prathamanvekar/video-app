"use client"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"

const RegisterPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    return strength
  }

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd)
    setPasswordStrength(checkPasswordStrength(pwd))
  }

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-blue-500"
      case 4:
        return "bg-green-500"
      default:
        return "bg-gray-600"
    }
  }

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "// Weak (even my grandma could crack this)"
      case 2:
        return "// Fair (getting warmer...)"
      case 3:
        return "// Good (now we're talking)"
      case 4:
        return "// Strong (hackerman approved)"
      default:
        return ""
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("// Error: Passwords don't match. Copy-paste is your friend.")
      setIsLoading(false)
      return
    }

    if (passwordStrength < 2) {
      setError("// Error: Password too weak. We're not running a charity here.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }
      console.log(data)
      router.push("/login")
    } catch (error) {
      setError(`// Error: ${error instanceof Error ? error.message : "Something went wrong. Blame the backend."}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Floating code snippets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-8 text-green-500/20 font-mono text-sm animate-pulse">
          const user = new User()
        </div>
        <div
          className="absolute top-32 right-12 text-green-500/20 font-mono text-sm animate-pulse"
          style={{ animationDelay: "2s" }}
        >
          user.validate()
        </div>
        <div
          className="absolute bottom-40 left-20 text-green-500/20 font-mono text-sm animate-pulse"
          style={{ animationDelay: "4s" }}
        >
          await database.save(user)
        </div>
        <div
          className="absolute bottom-20 right-16 text-green-500/20 font-mono text-sm animate-pulse"
          style={{ animationDelay: "6s" }}
        >
          return success()
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors duration-200 font-mono text-sm"
          >
            <span>←</span> cd ../
          </button>

          {/* Terminal window */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-2 text-gray-400 font-mono text-sm">user.create()</span>
            </div>

            {/* Terminal content */}
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold font-mono text-green-400 mb-2">$ register --new-user</h1>
                <p className="text-gray-400 font-mono text-sm">// Creating your digital identity...</p>
              </div>

              {/* Error display */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 font-mono text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 font-mono text-sm mb-2">email: string</label>
                  <input
                    type="email"
                    placeholder="your.name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-mono text-sm mb-2">password: string</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors duration-200"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= passwordStrength ? getStrengthColor() : "bg-gray-700"
                            } transition-colors duration-200`}
                          ></div>
                        ))}
                      </div>
                      <p className="text-xs font-mono text-gray-400">{getStrengthText()}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 font-mono text-sm mb-2">confirmPassword: string</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white font-mono focus:outline-none focus:ring-1 transition-all duration-200 pr-12 ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : confirmPassword && password === confirmPassword
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                            : "border-gray-600 focus:border-green-500 focus:ring-green-500"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors duration-200"
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs font-mono text-red-400">// Passwords don't match</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="mt-1 text-xs font-mono text-green-400">// Perfect match ✓</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || password !== confirmPassword || passwordStrength < 2}
                  className="w-full py-3 bg-green-500 text-gray-900 font-semibold font-mono rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                >
                  <span className="relative z-10">{isLoading ? "creating user..." : "execute register()"}</span>
                  {isLoading && (
                    <div className="absolute inset-0 bg-green-600">
                      <div className="h-full bg-green-400 animate-pulse"></div>
                    </div>
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-400 font-mono text-sm text-center">
                  <span className="text-gray-500">// </span>
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="text-green-400 hover:text-green-300 underline transition-colors duration-200"
                  >
                    login.existing()
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer hint */}
          <p className="mt-4 text-center text-gray-500 font-mono text-xs">
            Pro tip: Use a password manager. Your future self will thank you.
          </p>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-30"></div>
    </div>
  )
}

export default RegisterPage
