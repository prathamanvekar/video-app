"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function Home() {
  const router = useRouter()
  const [currentJoke, setCurrentJoke] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)

  const jokes = [
    "// TODO: Fix this later (narrator: they never did)",
    "Your videos won't disappear like your motivation",
    "More reliable than your last deployment",
    "404: Excuses not found",
    "Git commit -m 'fixed everything (probably)'",
    "Stack Overflow for your video storage needs",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJoke((prev) => (prev + 1) % jokes.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 8000)
    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
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
        {[
          { text: "npm install", top: "10%", left: "10%", delay: "0s" },
          { text: "git push", top: "20%", right: "15%", delay: "2s" },
          { text: "console.log()", top: "70%", left: "5%", delay: "4s" },
          { text: "sudo rm -rf", top: "60%", right: "10%", delay: "6s" },
        ].map((snippet, i) => (
          <div
            key={i}
            className="absolute text-green-500/30 font-mono text-sm animate-pulse"
            style={{
              top: snippet.top,
              left: snippet.left,
              right: snippet.right,
              animationDelay: snippet.delay,
              animationDuration: "3s",
            }}
          >
            {snippet.text}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Terminal-style header */}
          <div className="inline-block mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-left max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-green-400 text-sm">
                <span className="text-gray-500">$</span> ./video-app --start
                <div className="text-gray-400 mt-1">Initializing awesome...</div>
              </div>
            </div>
          </div>

          {/* Main title with glitch effect */}
          <h1
            className={`text-6xl md:text-7xl font-bold mb-6 transition-all duration-200 ${
              glitchActive ? "animate-pulse text-red-400" : "text-white"
            }`}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              textShadow: glitchActive ? "2px 0 #ff0000, -2px 0 #00ff00" : "none",
            }}
          >
            Video<span className="text-green-400">{"<Hub/>"}</span>
          </h1>

          {/* Rotating jokes */}
          <div className="h-16 mb-8 flex items-center justify-center">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg px-6 py-3 font-mono text-green-400 max-w-2xl">
              <div className="overflow-hidden h-6">
                <div
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${currentJoke * 24}px)` }}
                >
                  {jokes.map((joke, index) => (
                    <div key={index} className="h-6 leading-6 text-sm md:text-base">
                      {joke}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex justify-center gap-8 mb-8 text-sm font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Server: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              <span className="text-gray-400">Bugs: Minimal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
              <span className="text-gray-400">Coffee: Required</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/login")}
              className="group relative px-8 py-4 bg-green-500 text-gray-900 font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-green-400 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
            >
              <span className="relative z-10 font-mono">sudo login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() => router.push("/register")}
              className="group relative px-8 py-4 border-2 border-green-500 text-green-400 font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-green-500/10 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
            >
              <span className="relative z-10 font-mono">git clone user</span>
              <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-12 text-gray-500 font-mono text-sm">
            <p>// Warning: May cause addiction to organized file storage</p>
            <p className="mt-2 text-xs">Built with ❤️ and excessive amounts of caffeine</p>
          </div>
        </div>
      </div>

      {/* Subtle animated accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50">
        <div className="h-full bg-gradient-to-r from-green-400 to-green-600 animate-pulse"></div>
      </div>
    </div>
  )
}
