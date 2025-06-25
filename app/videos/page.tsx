"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import type { IVideo } from "@/models/Video"

export default function VideoListPage() {
  const [videos, setVideos] = useState<IVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null)
  const router = useRouter()

  const filteredVideos = videos
    .filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case "oldest":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = (await apiClient.getVideos()) as { videos: IVideo[] }

        if (res && Array.isArray(res.videos)) {
          setVideos(res.videos)
        } else {
          console.error("Unexpected API response shape:", res)
          setVideos([])
        }
      } catch (err: any) {
        setError("Failed to load videos")
        console.error(err)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-mono text-green-400">Loading your masterpieces...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-mono text-lg mb-4">// Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 text-gray-900 px-4 py-2 rounded font-mono hover:bg-green-400 transition-colors"
          >
            retry()
          </button>
        </div>
      </div>
    )
  }

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
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors duration-200 font-mono text-sm"
              >
                <span>←</span> cd ../dashboard
              </button>
              <div>
                <h1 className="text-xl font-mono text-green-400">videos.browse()</h1>
                <p className="text-sm text-gray-400 font-mono">
                  {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/upload")}
              className="bg-green-500 text-gray-900 px-4 py-2 rounded font-mono hover:bg-green-400 transition-colors duration-200"
            >
              upload.new()
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search videos... (title, description)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono focus:border-green-500 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">A-Z</option>
              </select>
              <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-3 font-mono text-sm transition-colors ${
                    viewMode === "grid" ? "bg-green-500 text-gray-900" : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-3 font-mono text-sm transition-colors ${
                    viewMode === "list" ? "bg-green-500 text-gray-900" : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* No videos state */}
        {filteredVideos.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-mono text-green-400 mb-2">
              {searchTerm ? "No matches found" : "No videos yet"}
            </h2>
            <p className="text-gray-400 font-mono mb-6">
              {searchTerm ? "Try a different search term" : "Time to upload your first masterpiece!"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push("/upload")}
                className="bg-green-500 text-gray-900 px-6 py-3 rounded font-mono hover:bg-green-400 transition-colors duration-200"
              >
                Upload First Video
              </button>
            )}
          </div>
        )}

        {/* Videos Grid/List */}
        {filteredVideos.length > 0 && (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredVideos.map((video) => (
              <div
                key={video._id?.toString()}
                className={`bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  viewMode === "list" ? "flex gap-4 p-4" : "flex flex-col"
                }`}
                onClick={() => setSelectedVideo(video)}
              >
                <div className={viewMode === "list" ? "w-48 flex-shrink-0" : ""}>
                  <video
                    src={video.videoUrl}
                    className={`rounded-lg w-full h-auto ${viewMode === "list" ? "h-32 object-cover" : ""}`}
                    width={video.transformation?.width || 1080}
                    height={video.transformation?.height || 1920}
                    preload="metadata"
                  />
                </div>
                <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <h2 className="text-lg font-semibold font-mono text-green-400 mb-2">{video.title}</h2>
                  <p className="text-sm text-gray-400 font-mono mb-2">{video.description}</p>
                  {video.createdAt && (
                    <p className="text-xs text-gray-500 font-mono">{new Date(video.createdAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-mono text-green-400">{selectedVideo.title}</h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 font-mono"
              >
                close()
              </button>
            </div>
            <div className="p-6">
              <video
                src={selectedVideo.videoUrl}
                controls
                className="w-full rounded-lg mb-4"
                width={selectedVideo.transformation?.width || 1080}
                height={selectedVideo.transformation?.height || 1920}
              />
              <p className="text-gray-300 font-mono">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
