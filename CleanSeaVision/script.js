let model, labels = [];

async function loadModel() {
  document.getElementById("result").innerText = "Loading model...";
  model = await tf.loadLayersModel("model_web/model_web/model.json");

  const response = await fetch("labels.txt");
  const text = await response.text();
  labels = text.trim().split("\n");

  document.getElementById("result").innerText = "Model loaded successfully!";
  console.log("Model and labels loaded.");
}

function showPreview(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("preview");
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}


async function predictImage() {
  const imgElement = document.getElementById("preview");
  if (!imgElement.src) {
    alert("Please upload an image first!");
    return;
  }

  let tensor = tf.browser.fromPixels(imgElement)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(255.0)
    .expandDims();

  const prediction = await model.predict(tensor).data();
  const highest = prediction.indexOf(Math.max(...prediction));

  const result = labels[highest];
  const confidence = (prediction[highest] * 100).toFixed(2);

  document.getElementById("result").innerText = `Prediction: ${result}`;
  document.getElementById("confidence").innerText = `Confidence: ${confidence}%`;

  const ecoTips = {
    "marine debris": "⚠ Tip: Organize beach clean-ups and reduce plastic use.",
    "clean water": "💧 Tip: Keep it clean! Avoid dumping or littering near water sources.",
    "oil spill": "🛢 Tip: Report oil spills immediately and support cleanup initiatives."
  };

  document.getElementById("ecoTip").innerText = ecoTips[result.toLowerCase()] || "🌍 Be kind to our oceans!";
}

document.getElementById("imageUpload").addEventListener("change", showPreview);
document.getElementById("predictBtn").addEventListener("click", predictImage);

loadModel();