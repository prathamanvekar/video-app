"use client"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("// Error: Invalid credentials. Try again or blame the intern.")
      setIsLoading(false)
    } else {
      router.push("/dashboard")
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

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-green-500/20 font-mono text-sm animate-pulse">
          if (user.authenticated)
        </div>
        <div
          className="absolute top-40 right-20 text-green-500/20 font-mono text-sm animate-pulse"
          style={{ animationDelay: "2s" }}
        >
          return &lt;Dashboard /&gt;
        </div>
        <div
          className="absolute bottom-32 left-16 text-green-500/20 font-mono text-sm animate-pulse"
          style={{ animationDelay: "4s" }}
        >
          catch(error)
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
              <span className="ml-2 text-gray-400 font-mono text-sm">auth.login()</span>
            </div>

            {/* Terminal content */}
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold font-mono text-green-400 mb-2">$ authenticate --user</h1>
                <p className="text-gray-400 font-mono text-sm">// Please provide your credentials to proceed</p>
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
                    placeholder="user@domain.com"
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
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-green-500 text-gray-900 font-semibold font-mono rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                >
                  <span className="relative z-10">{isLoading ? "authenticating..." : "execute login()"}</span>
                  {isLoading && (
                    <div className="absolute inset-0 bg-green-600">
                      <div className="h-full bg-green-400 animate-pulse"></div>
                    </div>
                  )}
                </button>
              </form>

              {/* Register link */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-400 font-mono text-sm text-center">
                  <span className="text-gray-500">// </span>
                  No account found?{" "}
                  <button
                    onClick={() => router.push("/register")}
                    className="text-green-400 hover:text-green-300 underline transition-colors duration-200"
                  >
                    register.new()
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer hint */}
          <p className="mt-4 text-center text-gray-500 font-mono text-xs">
            Hint: Your password is probably not "password123"
          </p>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-30"></div>
    </div>
  )
}

export default LoginPage
