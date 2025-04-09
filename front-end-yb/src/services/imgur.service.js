import axios from "axios";

const IMGUR_CLIENT_ID = "5be05eaf808763a"; // Ganti ini pakai Client ID dari Imgur

export const uploadImageToImgur = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post("https://api.imgur.com/3/image", formData, {
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    },
  });

  return res.data.data.link;
};
