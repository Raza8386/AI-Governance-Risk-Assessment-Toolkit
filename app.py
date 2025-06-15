import streamlit as st
from risk_assessment import RiskAssessment
from fpdf import FPDF
import os

st.title("🛡️ AI Governance Risk Assessment Toolkit")

st.markdown("Provide scores (0-5) for each risk category:")

data_quality = st.slider("Data Quality", 0, 5, 3)
bias = st.slider("Bias Presence", 0, 5, 3)
explainability = st.slider("Explainability", 0, 5, 3)
robustness = st.slider("Robustness", 0, 5, 3)
privacy = st.slider("Privacy Compliance", 0, 5, 3)

if st.button("Calculate Risk"):
    assessment = RiskAssessment(data_quality, bias, explainability, robustness, privacy)
    total = assessment.total_score()
    level = assessment.risk_level()

    st.success(f"Total Score: {total} / 25")
    st.info(f"Risk Level: {level}")

    if not os.path.exists("reports"):
        os.makedirs("reports")

    # Generate PDF report
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="AI Governance Risk Assessment Report", ln=True, align='C')
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"Data Quality: {data_quality}/5", ln=True)
    pdf.cell(200, 10, txt=f"Bias Presence: {bias}/5", ln=True)
    pdf.cell(200, 10, txt=f"Explainability: {explainability}/5", ln=True)
    pdf.cell(200, 10, txt=f"Robustness: {robustness}/5", ln=True)
    pdf.cell(200, 10, txt=f"Privacy Compliance: {privacy}/5", ln=True)
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"Total Score: {total}/25", ln=True)
    pdf.cell(200, 10, txt=f"Risk Level: {level}", ln=True)

    filename = f"reports/Risk_Report_{total}.pdf"
    pdf.output(filename)
    st.success(f"PDF Report generated: {filename}")
