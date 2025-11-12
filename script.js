// CleanSeaVision - enhanced frontend script
let model = null;
let labels = [];
const MODEL_PATH = "model_web/model_web/model.json"; // keep your model path intact

// DOM
const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const noPreview = document.getElementById("no-preview");
const predictBtn = document.getElementById("predictBtn");
const clearBtn = document.getElementById("clearBtn");
const resultEl = document.getElementById("result");
const confidenceEl = document.getElementById("confidence");
const ecoTipEl = document.getElementById("ecoTip");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const modelText = document.getElementById("modelText");
const modelStatus = document.getElementById("modelStatus");
const confidenceVisual = document.getElementById("confidenceVisual");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

// helper: show overlay spinner
function showOverlay(text = "Loading...") {
  overlayText.innerText = text;
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}
function hideOverlay() {
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

// load labels.txt and model
async function loadModel() {
  try {
    showOverlay("Loading model...");
    modelText.innerText = "Loading model...";
    // load model
    model = await tf.loadLayersModel(MODEL_PATH);

    // load labels file
    const response = await fetch("labels.txt");
    const txt = await response.text();

    // robust parsing: labels may contain index e.g. "0 Marine_Debris"
    labels = txt
      .trim()
      .split(/\r?\n/)
      .map(line => {
        // remove leading index if present
        const parts = line.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].replace(/_/g, " ");
        // if first token is a number, drop it
        if (!isNaN(parts[0])) parts.shift();
        return parts.join(" ").replace(/_/g, " ");
      });

    modelText.innerText = "Model loaded ✓";
    modelStatus.setAttribute("aria-live", "polite");
    modelStatus.innerText = `Model status: ready`;
    hideOverlay();
    console.log("Model and labels loaded:", labels);

    // enable file control once loaded
    predictBtn.disabled = false;
  } catch (err) {
    hideOverlay();
    console.error(err);
    modelText.innerText = "Failed to load model";
    modelStatus.innerText = "Model failed to load, check console and model path.";
    alert("Error loading model. Make sure the model path and labels.txt are correct. See console for details.");
  }
}

// preview handler (supports drag & drop)
imageUpload.addEventListener("change", showPreview);
function showPreview(event) {
  const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    preview.src = e.target.result;
    preview.style.display = "block";
    noPreview.style.display = "none";
  };
  reader.readAsDataURL(file);
}

// drag & drop support on label
const uploadLabel = document.querySelector(".upload-label");
uploadLabel.addEventListener("dragover", (e) => { e.preventDefault(); uploadLabel.classList.add("drag"); });
uploadLabel.addEventListener("dragleave", () => uploadLabel.classList.remove("drag"));
uploadLabel.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadLabel.classList.remove("drag");
  const dt = e.dataTransfer;
  if (dt && dt.files && dt.files.length) {
    imageUpload.files = dt.files; // set the file input
    const ev = new Event('change');
    imageUpload.dispatchEvent(ev);
  }
});

// clear preview
clearBtn.addEventListener("click", () => {
  preview.src = "";
  preview.style.display = "none";
  noPreview.style.display = "block";
  resultEl.innerText = "No image analyzed yet.";
  confidenceEl.innerText = "";
  ecoTipEl.innerText = "";
  confidenceVisual.style.background = "conic-gradient(rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.06) 0%)";
});

// prediction logic
predictBtn.addEventListener("click", predictImage);

async function predictImage() {
  if (!model) {
    alert("Model not loaded yet. Please wait a moment.");
    return;
  }
  if (!preview.src) {
    alert("Please upload an image first.");
    return;
  }

  try {
    showOverlay("Analyzing image...");
    // prepare tensor
    let tensor = tf.browser.fromPixels(preview)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(255.0)
      .expandDims();

    // run prediction
    const predictionTensor = model.predict(tensor);
    const prediction = await predictionTensor.data();
    const highestIndex = prediction.indexOf(Math.max(...prediction));
    const confidenceScore = prediction[highestIndex];
    const label = labels[highestIndex] || `Label ${highestIndex}`;

    // format texts
    resultEl.innerText = `Prediction: ${label}`;
    confidenceEl.innerText = `Confidence: ${(confidenceScore * 100).toFixed(2)}%`;

    // update circular visual (conic-gradient)
    const pct = Math.round(confidenceScore * 100);
    const color = confidenceScore >= 0.8 ? "linear-gradient(180deg,#00e6a8,#00b47a)" : (confidenceScore >= 0.5 ? "linear-gradient(180deg,#ffd166,#ff8a00)" : "linear-gradient(180deg,#ff8a8a,#ff6b6b)");
    confidenceVisual.style.background = `conic-gradient(rgba(255,255,255,0.95) ${pct}%, rgba(255,255,255,0.06) ${pct}% )`;
    confidenceVisual.innerHTML = `<div style="text-align:center"><div style="font-weight:800;color:#012">${pct}%</div><div style="font-size:11px;color:rgba(0,0,0,0.6)">confidence</div></div>`;

    // eco tips mapping (use normalized label)
    const normalized = label.toLowerCase();
    const ecoTips = {
      "marine debris": "⚠️ Tip: Organize beach clean-ups, reduce single-use plastics, and dispose of waste properly.",
      "clean water": "💧 Tip: Maintain clean waterways by avoiding littering and supporting local conservation efforts.",
      "oil spill": "🛢️ Tip: Report oil spills to local authorities immediately and support response teams."
    };
    ecoTipEl.innerText = ecoTips[normalized] || "🌍 Be kind to our oceans — reduce, reuse, recycle.";

    // save to history
    addToHistory({ label, confidence: (confidenceScore * 100).toFixed(2), timestamp: new Date().toISOString(), imgSrc: preview.src });

    hideOverlay();
    // memory cleanup
    tensor.dispose();
    if (predictionTensor.dispose) predictionTensor.dispose();
  } catch (err) {
    console.error(err);
    hideOverlay();
    alert("Prediction error. See console for details.");
  }
}

// History storage
const HISTORY_KEY = "cleanseavision_history";
function loadHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch (e) { return []; }
}
function saveHistory(arr) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
  renderHistory();
}
function addToHistory(entry) {
  const arr = loadHistory();
  arr.unshift(entry);
  if (arr.length > 20) arr.pop();
  saveHistory(arr);
}
function renderHistory() {
  const arr = loadHistory();
  historyList.innerHTML = "";
  if (arr.length === 0) {
    historyList.innerHTML = "<li style='opacity:.8'>No predictions yet.</li>";
    return;
  }
  arr.forEach(item => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    left.style.maxWidth = "70%";
    left.innerHTML = `<div style="font-weight:700">${item.label}</div><div style="font-size:12px;opacity:.85">${new Date(item.timestamp).toLocaleString()}</div>`;
    const right = document.createElement("div");
    right.style.textAlign = "right";
    right.innerHTML = `<div style="font-weight:800">${item.confidence}%</div>`;
    li.appendChild(left);
    li.appendChild(right);
    historyList.appendChild(li);
  });
}
clearHistoryBtn.addEventListener("click", () => {
  if (!confirm("Clear prediction history?")) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

// initialize
(function init() {
  // render initial UI state
  preview.style.display = "none";
  noPreview.style.display = "block";
  resultEl.innerText = "No image analyzed yet.";
  ecoTipEl.innerText = "Eco tip will show here.";
  modelText.innerText = "Initializing...";
  renderHistory();
  // load model
  loadModel();
})();
