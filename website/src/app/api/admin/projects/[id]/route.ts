import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { ProjectUpdate } from "@/types/database";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error in admin project API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, location, area, category, image_url, images, video_url, description, published } = body;

    // Build update object with only provided fields
    const updateData: ProjectUpdate = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (location !== undefined) updateData.location = location;
    if (area !== undefined) updateData.area = area;
    if (category !== undefined) updateData.category = category;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (images !== undefined) updateData.images = images;
    if (video_url !== undefined) updateData.video_url = video_url;
    if (description !== undefined) updateData.description = description;
    if (published !== undefined) updateData.published = published;

    const { data: project, error } = await supabase
      .from("projects")
      .update(updateData as never)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating project:", error);
      return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error in admin project API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, get the project to find all media URLs
    const { data: project } = await supabase
      .from("projects")
      .select("image_url, images, video_url")
      .eq("id", id)
      .single() as { data: { image_url: string; images: string[]; video_url: string | null } | null };

    // Delete the project
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }

    // Helper function to delete file from storage
    const deleteFromStorage = async (url: string) => {
      if (!url || !url.includes("supabase.co")) return;
      try {
        const urlParts = url.split("/storage/v1/object/public/");
        if (urlParts.length > 1) {
          const pathParts = urlParts[1].split("/");
          const bucket = pathParts[0];
          const filePath = pathParts.slice(1).join("/");
          await supabase.storage.from(bucket).remove([filePath]);
        }
      } catch (storageError) {
        console.warn("Could not delete file from storage:", storageError);
      }
    };

    // Try to delete all media from storage
    if (project) {
      await deleteFromStorage(project.image_url);
      if (project.images && Array.isArray(project.images)) {
        for (const imageUrl of project.images) {
          await deleteFromStorage(imageUrl);
        }
      }
      if (project.video_url) {
        await deleteFromStorage(project.video_url);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in admin project API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
