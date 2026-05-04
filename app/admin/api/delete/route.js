import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, image_url } = await req.json();

    const fileName = image_url.split("/").pop();
    const filePath = `portraits/${fileName}`;

    await supabaseAdmin.storage.from("gallery").remove([filePath]);
    await supabaseAdmin.from("portraits").delete().eq("id", id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}