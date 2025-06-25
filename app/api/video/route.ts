import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const videos = await Video.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json({ message: "No videos found" }, { status: 200 });
    }

    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body: IVideo = await request.json();
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const videoData = {
      ...body,
      userId: session.user.id,
      controls: body?.controls ?? true,
      transformation: {
        width: 1080,
        height: 1920,
        quality: body.transformation?.quality ?? 100,
      },
    };
    const newVideo = await Video.create(videoData);
    return NextResponse.json({ newVideo }, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
