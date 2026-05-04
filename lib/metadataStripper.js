export async function stripImageMetadata(file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((resolve) => 
        canvas.toBlob(resolve, "image/jpeg", 0.92)
    );

    return new File([blob], `portrait-${Date.now()}.jpg`, {
        type: "image/jpeg",
    });
}