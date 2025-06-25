"use client";
import { useState, useEffect } from "react";
import type React from "react";

import { useRouter } from "next/navigation";
import FileUpload from "../components/FileUpload";
import { apiClient, type videoFormData } from "@/lib/api-client";

export default function UploadVideoPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [titleSuggestions] = useState([
    "My Epic Creation",
    "Untitled Masterpiece",
    "Video_Final_v2",
    "This Will Go Viral",
    "Random Footage",
    "Definitely Not Boring",
  ]);

  const router = useRouter();

  const uploadTips = [
    "Pro tip: A good title is half the battle. The other half is actually watching it.",
    "Description hack: Tell people what they're about to see. Revolutionary, I know.",
    "Fun fact: Videos with thumbnails get 90% more clicks. Math checks out.",
    "Remember: If your video is longer than 5 minutes, it better be worth it.",
    "Upload wisdom: Compress your files. Your internet connection will thank you.",
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % uploadTips.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    if (uploading) {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
      return () => clearInterval(progressInterval);
    }
  }, [uploading]);

  const handleVideoUpload = (res: any) => {
    setVideoUrl(res.url);
    setFileUploadProgress(0);
  };

  const handleFileUploadProgress = (progress: number) => {
    setFileUploadProgress(progress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !videoUrl) {
      alert(
        "// Error: Missing required fields. Even I can't work with incomplete data."
      );
      return;
    }

    const videoData: videoFormData = {
      title,
      description,
      videoUrl,
      thumbnailUrl: videoUrl + "?tr=w-300,h-500,fo-auto",
    };

    try {
      setUploading(true);
      setUploadProgress(0);
      await apiClient.createVideo(videoData);
      setUploadProgress(100);
      setTimeout(() => {
        alert("🎉 Video uploaded successfully! Your masterpiece is now live!");
        router.push("/videos");
      }, 500);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("// Error: Upload failed. Blame the server, not your content.");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getRandomSuggestion = () => {
    const randomIndex = Math.floor(Math.random() * titleSuggestions.length);
    setTitle(titleSuggestions[randomIndex]);
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setFileUploadProgress(0);
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
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors duration-200 font-mono text-sm"
              >
                <span>←</span> cd ../dashboard
              </button>
              <div>
                <h1 className="text-xl font-mono text-green-400">
                  video.upload()
                </h1>
                <p className="text-sm text-gray-400 font-mono">
                  Share your digital masterpiece with the world
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/videos")}
              className="text-gray-400 hover:text-green-400 transition-colors duration-200 font-mono text-sm"
            >
              browse.existing()
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-2 text-gray-400 font-mono text-sm">
                  upload.form
                </span>
              </div>

              <div className="p-6">
                {/* File Upload Section */}
                <div className="mb-6 relative">
                  <label className="block text-gray-400 font-mono text-sm mb-3">
                    videoFile: File
                  </label>

                  {/* Styled Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 relative ${
                      videoUrl
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-600 bg-gray-800/30 hover:border-green-500/50 hover:bg-gray-800/50"
                    }`}
                  >
                    {!videoUrl ? (
                      <div className="space-y-4">
                        <div className="text-6xl">📁</div>
                        <div>
                          <h3 className="text-lg font-mono text-green-400 mb-2">
                            Drop your video here
                          </h3>
                          <p className="text-gray-400 font-mono text-sm mb-4">
                            or click to browse files
                          </p>
                          <div className="text-xs font-mono text-gray-500">
                            Supports: MP4, MOV, AVI • Max size: 100MB
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl text-green-400">✅</div>
                        <p className="font-mono text-green-400">
                          File uploaded successfully!
                        </p>
                        <p className="text-xs font-mono text-gray-400">
                          Ready to add details below
                        </p>
                      </div>
                    )}

                    {/* File Upload Progress */}
                    {fileUploadProgress > 0 && fileUploadProgress < 100 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono text-gray-400">
                            Uploading file...
                          </span>
                          <span className="text-sm font-mono text-green-400">
                            {fileUploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${fileUploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* FileUpload Component - positioned to cover the entire area */}
                    <div className="absolute flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center text-green-500">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                        <FileUpload
                          onSuccess={handleVideoUpload}
                          onProgress={handleFileUploadProgress}
                          fileType="video"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Preview */}
                {videoUrl && (
                  <div className="mb-6">
                    <label className="block text-gray-400 font-mono text-sm mb-3">
                      preview: VideoElement
                    </label>
                    <div className="relative">
                      <video
                        src={videoUrl}
                        controls
                        className="rounded-lg w-full h-auto border border-gray-600"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-gray-900 px-2 py-1 rounded text-xs font-mono">
                        ✓ Uploaded
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-gray-400 font-mono text-sm">
                        title: string
                      </label>
                      <button
                        type="button"
                        onClick={getRandomSuggestion}
                        className="text-xs font-mono text-green-400 hover:text-green-300 transition-colors"
                      >
                        random()
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your video title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-mono text-sm mb-2">
                      description: string
                    </label>
                    <textarea
                      placeholder="Describe your masterpiece... (optional but recommended)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200 resize-none"
                      required
                    />
                  </div>

                  {/* Progress Bar */}
                  {uploading && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-gray-400">
                          Processing...
                        </span>
                        <span className="text-sm font-mono text-green-400">
                          {Math.round(uploadProgress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={uploading || !videoUrl}
                      className="flex-1 py-3 bg-green-500 text-gray-900 font-semibold font-mono rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {uploading ? "processing..." : "execute upload()"}
                    </button>
                    <button
                      type="button"
                      onClick={clearForm}
                      disabled={uploading}
                      className="px-6 py-3 border border-gray-600 text-gray-400 font-mono rounded-lg hover:border-red-500 hover:text-red-400 disabled:opacity-50 transition-all duration-200"
                    >
                      clear()
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Tips */}
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💡</span>
                <h3 className="text-lg font-mono text-green-400">
                  upload.tips[]
                </h3>
              </div>
              <div className="h-16 overflow-hidden">
                <p
                  className="text-gray-300 font-mono text-sm transition-transform duration-500 ease-in-out leading-relaxed"
                  style={{ transform: `translateY(-${currentTip * 64}px)` }}
                >
                  {uploadTips.map((tip, index) => (
                    <span key={index} className="block h-16 py-2">
                      {tip}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Upload Stats */}
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📊</span>
                <h3 className="text-lg font-mono text-green-400">
                  session.stats
                </h3>
              </div>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">
                    {videoUrl ? "Ready" : "Waiting"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Title length:</span>
                  <span className="text-blue-400">{title.length}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Description:</span>
                  <span className="text-purple-400">
                    {description.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚡</span>
                <h3 className="text-lg font-mono text-green-400">
                  quick.actions
                </h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/videos")}
                  className="w-full text-left px-3 py-2 text-sm font-mono text-gray-400 hover:text-green-400 hover:bg-gray-800/50 rounded transition-all duration-200"
                >
                  → Browse existing videos
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full text-left px-3 py-2 text-sm font-mono text-gray-400 hover:text-green-400 hover:bg-gray-800/50 rounded transition-all duration-200"
                >
                  → Back to dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
