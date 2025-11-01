# 🌊 CleanSeaVision: AI-Powered Ocean Waste Detection

## 🧠 Problem Statement
Every year, millions of tons of waste and oil leaks enter our oceans, threatening marine life and ecosystems. Manual detection of ocean pollution through human monitoring or drones is slow, expensive, and inconsistent.  

*CleanSeaVision* aims to create an *AI-powered image classification system* that can automatically identify:
- Marine Waste (trash or litter floating in water)  
- Oil Spills  
- Clean Ocean surfaces  

This project supports *UN Sustainable Development Goal 14 (Life Below Water)* by helping raise awareness and encouraging smarter marine monitoring.

---

## 🎯 Objectives
- Train a deep-learning image model that classifies ocean images into **Clean Ocean**, **Marine Waste**, or **Oil Spill**.  
- Use *Google Teachable Machine* to build a lightweight CNN model.  

---

## 📸 Dataset Description
The dataset was created using *Google Teachable Machine*, combining public marine images from Kaggle and open web sources.

| Class | Description | Approx. Images |
|-------|--------------|----------------|
| Clean Ocean | clear water surfaces with no pollution | ~50 |
| Marine Waste | visible trash, plastic bottles, debris | ~50 |
| Oil Spill | dark or rainbow-sheen slicks on water | ~50 |

Each class folder was uploaded to Teachable Machine, trained using transfer learning, and exported as a *TensorFlow 2 (.h5)* model.

---

## ⚙ Model & Tools
| Component | Tool / Framework |
|------------|------------------|
| Model Training | Google Teachable Machine |
| Framework | TensorFlow 2 / Keras |
| Files | keras_model.h5, labels.txt |
---

## 🧩 Current Work (Week 1)
- ✅ Finalized problem statement and project goal  
- ✅ Created and trained Teachable Machine model with 3 classes  
- ✅ Exported TensorFlow model (keras_model.h5) and labels.txt  

Next Week:
- Set up Kaggle notebook for testing and analysis
- Evaluate accuracy and confusion matrix in Kaggle  
- Integrate eco-tip output (e.g., “Recycle plastics responsibly”)  
- Prepare simple web demo (Gradio / Streamlit)

---

## 🌱 Sustainability Impact
By detecting and classifying pollution types automatically, *CleanSeaVision* can:
- Help NGOs and researchers monitor marine pollution faster  
- Encourage sustainable waste management awareness  
- Provide data insights for cleanup operations  

---

## 📂 Repository Structure
