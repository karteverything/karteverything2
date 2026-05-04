import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");

    if (!file || !title) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const fileName = `portraits/${Date.now()}-${file.name}`;

    // upload to storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // get public URL
    const { data } = supabaseAdmin.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const image_url = data.publicUrl;

    // insert into DB
    const { error: dbError } = await supabaseAdmin
      .from("portraits")
      .insert([{ title, image_url }]);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, image_url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}