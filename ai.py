# AI Prescription Recommender - Streamlit App

import streamlit as st
import pandas as pd
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import sqlite3
from reportlab.pdfgen import canvas
import base64
import tempfile
import streamlit.components.v1 as components

# Database setup
def init_db():
    conn = sqlite3.connect('prescriptions.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS corrections (
            Patient_ID TEXT,
            Predicted_Disease TEXT,
            Final_Meds TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Load CSV files
def load_csvs():
    patient_data = st.file_uploader("Upload patient_data.csv", type="csv")
    medicine_data = st.file_uploader("Upload disease_meds.csv", type="csv")
    if patient_data and medicine_data:
        df_patient = pd.read_csv(patient_data)
        df_meds = pd.read_csv(medicine_data)
        return df_patient, df_meds
    return None, None

# Train model
def train_model(df_patient):
    X = df_patient['Symptoms'] + ' ' + df_patient['History']
    y = df_patient['Disease']
    model = make_pipeline(CountVectorizer(), MultinomialNB())
    model.fit(X, y)
    return model

# Predict disease
def predict_disease(model, symptoms, history):
    input_text = history + ' ' + symptoms
    return model.predict([input_text])[0]

# Fetch medicines
def fetch_medicines(disease, meds_df):
    disease_to_meds = pd.Series(meds_df.Medicines.values, index=meds_df.Disease).to_dict()
    return disease_to_meds.get(disease, "❌ No medicine found")

# Save correction to database
def save_to_db(patient_id, disease, corrected_meds):
    conn = sqlite3.connect('prescriptions.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO corrections VALUES (?, ?, ?)", (patient_id, disease, corrected_meds))
    conn.commit()
    conn.close()

# Generate PDF

def generate_pdf(patient_id, disease, meds):
    tmpfile = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    c = canvas.Canvas(tmpfile.name)
    c.drawString(100, 800, f"Patient ID: {patient_id}")
    c.drawString(100, 780, f"Predicted Disease: {disease}")
    c.drawString(100, 760, f"Medicines: {meds}")
    c.save()
    return tmpfile.name

# Embed PDF in browser

def display_pdf(file_path):
    with open(file_path, "rb") as f:
        base64_pdf = base64.b64encode(f.read()).decode('utf-8')
    pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="700" height="500" type="application/pdf"></iframe>'
    st.markdown(pdf_display, unsafe_allow_html=True)
    st.download_button("Download PDF", data=open(file_path, "rb"), file_name="prescription.pdf")

# Streamlit App

def main():
    st.title("AI Prescription Recommender")
    st.subheader("By Fusion Squad")
    init_db()

    df_patient, df_meds = load_csvs()
    if df_patient is not None and df_meds is not None:
        model = train_model(df_patient)

        st.header("Enter New Patient Data")
        patient_id = st.text_input("Patient ID")
        history = st.text_input("Patient History")
        symptoms = st.text_input("Current Symptoms")

        if st.button("Predict Disease"):
            disease = predict_disease(model, symptoms, history)
            meds = fetch_medicines(disease, df_meds)

            st.success(f"Predicted Disease: {disease}")
            st.text_area("Suggested Medicines", value=meds, height=100)

            corrected_meds = st.text_area("Final Medicines (Editable)", value=meds)

            if st.button("Save Final Prescription"):
                save_to_db(patient_id, disease, corrected_meds)
                st.success("Saved to database")

                pdf_file = generate_pdf(patient_id, disease, corrected_meds)
                display_pdf(pdf_file)

if _name_ == "_main_":
    main()