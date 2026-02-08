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
    const { title, location, area, category, image_url, description, published } = body;

    // Build update object with only provided fields
    const updateData: ProjectUpdate = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (location !== undefined) updateData.location = location;
    if (area !== undefined) updateData.area = area;
    if (category !== undefined) updateData.category = category;
    if (image_url !== undefined) updateData.image_url = image_url;
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

    // First, get the project to find the image URL
    const { data: project } = await supabase
      .from("projects")
      .select("image_url")
      .eq("id", id)
      .single() as { data: { image_url: string } | null };

    // Delete the project
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }

    // Try to delete the image from storage if it exists
    if (project?.image_url && project.image_url.includes("supabase.co")) {
      try {
        // Extract the path from the URL
        const urlParts = project.image_url.split("/storage/v1/object/public/");
        if (urlParts.length > 1) {
          const pathParts = urlParts[1].split("/");
          const bucket = pathParts[0];
          const filePath = pathParts.slice(1).join("/");

          await supabase.storage.from(bucket).remove([filePath]);
        }
      } catch (storageError) {
        // Log but don't fail if image deletion fails
        console.warn("Could not delete image from storage:", storageError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in admin project API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
