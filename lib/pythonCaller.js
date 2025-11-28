const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const path = require('path');

exports.Prediction = async (imagePath) => {
  const formData = new FormData();
  const fileStream = fs.createReadStream(imagePath);
  
  formData.append('image', fileStream, {
    filename: path.basename(imagePath),
    contentType: 'image/jpeg',
  });

  try {
    const response = await axios.post(`http://${process.env.FLASK_NAME}:5000/predict`, formData, {
      headers: formData.getHeaders(),
    });
    console.log("Flask 응답:", response.data);
    return response.data;
  } catch (err) {
    console.error("Flask 호출 실패:", err);
    throw err;
  }
};
