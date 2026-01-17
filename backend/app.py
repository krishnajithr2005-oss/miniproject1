from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "AI Risk Analysis Backend Running"

@app.route("/analyze", methods=["POST"])
def analyze_risk():
    data = request.json

    district = data.get("district")
    state = data.get("state")
    disaster = data.get("disaster")

    # SIMPLE AI LOGIC (Explainable)
    if disaster in ["Flood", "Cyclone"]:
        risk_level = "HIGH"
        risk_score = 8.5
        explanation = (
            "The area is prone to heavy rainfall, coastal influence, "
            "and historical flooding patterns."
        )

    elif disaster in ["Earthquake", "Landslide"]:
        risk_level = "MEDIUM"
        risk_score = 6.0
        explanation = (
            "The region lies near seismic zones or hilly terrain, "
            "making it moderately vulnerable."
        )

    else:
        risk_level = "LOW"
        risk_score = 3.0
        explanation = (
            "No major historical disaster patterns detected "
            "in this region."
        )

    return jsonify({
        "district": district,
        "state": state,
        "disaster": disaster,
        "riskLevel": risk_level,
        "riskScore": risk_score,
        "explanation": explanation
    })

if __name__ == "__main__":
    app.run(debug=True)
