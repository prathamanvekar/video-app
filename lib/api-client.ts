import { IVideo } from "@/models/Video";

export type videoFormData = Omit<
  IVideo,
  "_id" | "userId" | "createdAt" | "updatedAt"
>;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: defaultHeaders,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  async getVideos() {
    return this.fetch("/video");
  }
  async createVideo(video: videoFormData) {
    return this.fetch("/video", { method: "POST", body: video });
  }
}

export const apiClient = new ApiClient();
