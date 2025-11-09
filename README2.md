# 🌊 CleanSeaVision — Week 2 Progress Report

## 🔍 Objective
Continue building CleanSeaVision, an AI model that detects marine pollution types from images.  
This week focused on *model testing, visualization, and UI preparation*.

## ⚙ Work Done
1. *Model Testing in Kaggle*
   - Imported the Teachable Machine model (keras_model.h5, labels.txt).
   - Verified successful loading in TensorFlow 2.18.
   - Tested multiple marine waste images for predictions.
   - Displayed prediction labels and confidence percentages.

2. *Result Visualization*
   - Added a *bar chart* to show confidence scores for each class.
   - Observed highest confidence in the correct category for most samples.
   - Integrated eco-friendly tips based on predicted waste type.


3. *Learning Outcome*
   - Understood model inference flow in TensorFlow.
   - Gained practice connecting Teachable Machine output to custom Python visualization.
   - Prepared foundation for deployment in Week 3.

## 📁 Files in this Repository
| File | Description |
|------|--------------|
| CleanSeaVision_Test.ipynb | Kaggle notebook for model testing and visualization |
| keras_model.h5, labels.txt | Trained model and class labels |
| DataSets | Datasets that used in training the model |
| README.md | Project documentation and progress summary |

## 🚀 Next Steps (Week 3 Plan)
- will be Creating app.py using streamlit that allows users to upload images and see results.
- Streamlit couldn’t run on Kaggle, but the script works locally or on Streamlit Cloud.
- Deploy the Streamlit app online.  
- Add a cleaner user interface with images and eco-impact icons.  
