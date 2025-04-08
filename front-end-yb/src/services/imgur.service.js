const IMGUR_CLIENT_ID = "5be05eaf808763a"; // Ganti dengan Client ID kamu

export async function uploadToImgur(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (response.ok && result.success) {
    return result.data.link; // URL gambar permanen
  } else {
    throw new Error(result.data?.error || "Upload gagal ke Imgur");
  }
}
