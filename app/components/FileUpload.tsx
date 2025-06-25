"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { on } from "events";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //optional validation

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Only video files are allowed");
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size should be less than 100MB");
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      // Destructure actual values
      const { token, expire, signature } = auth.authenticationParameters;

      const uploadResponse = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        expire,
        token,
        signature,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      onSuccess(uploadResponse);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <span>Uploading</span>}
    </>
  );
};

export default FileUpload;
