"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTip, setCurrentTip] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [konami, setKonami] = useState("");

  const tips = [
    "Pro tip: Name your files properly. 'video_final_FINAL_v2.mp4' isn't helping anyone.",
    "Remember: The cloud is just someone else's computer. But at least it's not yours.",
    "Fun fact: 90% of storage issues can be solved by deleting old memes.",
    "Debugging tip: If it works on your machine, it's probably the server's fault.",
    "Life hack: Ctrl+Z works in real life too. Just kidding, it doesn't.",
  ];

  const popuMoods = [
    { emoji: "🎬", text: "Ready to create magic" },
    { emoji: "🚀", text: "Launching into creativity" },
    { emoji: "⚡", text: "High voltage vibes" },
    { emoji: "🎯", text: "Locked and loaded" },
    { emoji: "🔥", text: "On fire today" },
    { emoji: "✨", text: "Sparkling with ideas" },
  ];

  const quickActions = [
    {
      name: "Upload Video",
      icon: "📤",
      action: () => router.push("/upload"),
      shortcut: "U",
      description: "Because your masterpiece needs a home",
    },
    {
      name: "Browse Videos",
      icon: "🎬",
      action: () => router.push("/videos"),
      shortcut: "V",
      description: "Your digital film festival awaits",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        const action = quickActions.find(
          (a) => a.shortcut.toLowerCase() === e.key.toLowerCase()
        );
        if (action) {
          e.preventDefault();
          action.action();
        }
      }

      // Konami code easter egg
      const key = e.key.toLowerCase();
      const sequence =
        "arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba";
      const newKonami = konami + key;

      if (sequence.startsWith(newKonami)) {
        setKonami(newKonami);
        if (newKonami === sequence) {
          alert("🎉 Konami Code activated! Panchi and Popu approve! 🥷");
          setKonami("");
        }
      } else {
        setKonami("");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [konami]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return "Still awake? Impressive dedication.";
    if (hour < 12) return "Good morning, code warrior.";
    if (hour < 17) return "Afternoon productivity session?";
    if (hour < 22) return "Evening upload marathon?";
    return "Late night coding session detected.";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold font-mono">VH</span>
              </div>
              <div>
                <h1 className="text-xl font-mono text-green-400">
                  VideoHub.dashboard()
                </h1>
                <p className="text-sm text-gray-400 font-mono">
                  {getGreeting()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Status indicators */}
              <div className="flex items-center gap-3 text-sm font-mono">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? "bg-green-400" : "bg-red-400"
                    } animate-pulse`}
                  ></div>
                  <span className="text-gray-400">
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="text-gray-500">|</div>
                <span className="text-gray-400">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>

              {/* User menu */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-mono">
                    {session?.user?.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200 font-mono text-sm"
                >
                  logout()
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-mono text-green-400 mb-4">
            // Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={action.name}
                onClick={action.action}
                className="group bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </span>
                  <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">
                    Alt+{action.shortcut}
                  </span>
                </div>
                <h3 className="font-mono text-white font-semibold mb-1">
                  {action.name}
                </h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-8">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💡</span>
              <h2 className="text-lg font-mono text-green-400">
                developer.tips[]
              </h2>
            </div>
            <div className="h-6 overflow-hidden">
              <p
                className="text-gray-300 font-mono text-sm transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentTip * 24}px)` }}
              >
                {tips.map((tip, index) => (
                  <span key={index} className="block h-6 leading-6">
                    {tip}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-mono text-green-400 mb-4">
            // Recent Activity
          </h2>
          <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-2 text-gray-400 font-mono text-sm">
                  activity.log
                </span>
              </div>
            </div>
            <div className="p-4 font-mono text-sm space-y-2">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-green-400">✓</span>
                <span>User authenticated successfully</span>
                <span className="text-gray-600 ml-auto">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-blue-400">i</span>
                <span>Dashboard loaded in 0.42s</span>
                <span className="text-gray-600 ml-auto">Just now</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-yellow-400">⚠</span>
                <span>
                  Remember to upload that video you've been procrastinating
                </span>
                <span className="text-gray-600 ml-auto">Always</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-purple-400">🎮</span>
                <span>Easter egg hint: Try the Konami code</span>
                <span className="text-gray-600 ml-auto">Secret</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-gray-900/50 backdrop-blur mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm font-mono text-gray-500">
            <span>
              built by{" "}
              <a
                href="https://portfolio-prathamanvekar.vercel.app/"
                className="text-green-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                prathamesh anvekar
              </a>{" "} 💙
            </span>
            <span>Keyboard shortcuts enabled // Alt + [U,V] </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
