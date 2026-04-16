const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import Models
const Place = require("./models/Place");
const Alert = require("./models/Alert");
const Shelter = require("./models/Shelter");
const Resource = require("./models/Resource");
const History = require("./models/History");
const RiskZone = require("./models/RiskZone");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MONGODB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// 🔹 API: GET place details with alerts, shelters, resources
app.get("/api/analyze", async (req, res) => {
  try {
    const placeName = req.query.place;

    if (!placeName) {
      return res.status(400).json({ error: "Place is required" });
    }

    // Get place details
    const place = await Place.findOne({ name: placeName });
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    // Get alerts for this place
    const alerts = await Alert.find({ placeName });

    // Get shelters for this place
    const shelters = await Shelter.find({ placeName });

    // Get resources for this place
    const resources = await Resource.find({ placeName });

    // Get risk zones for this place
    const riskZones = await RiskZone.find({ placeName });

    res.json({
      place: place.name,
      district: place.district,
      coordinates: [place.coordinates.latitude, place.coordinates.longitude],
      risk: {
        score: place.riskScore,
        level: place.riskLevel,
        color: place.riskColor,
      },
      activeLayers: place.activeLayers,
      alerts: alerts.map((a) => a.title),
      shelters: shelters.map((s) => ({
        name: s.name,
        capacity: s.capacity,
        location: s.location,
      })),
      resources: resources.map((r) => ({
        name: r.name,
        type: r.type,
        contact: r.contact,
      })),
      riskZones: riskZones,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔹 EXISTING POST ROUTE (KEEP IT)
 * Used later for AI / ML / form-based analysis
 */
app.post("/analyze", (req, res) => {
  const { district, state, disaster } = req.body;

  const riskLevels = ["LOW", "MEDIUM", "HIGH"];
  const riskLevel = riskLevels[Math.floor(Math.random() * 3)];
  const riskScore =
    riskLevel === "HIGH" ? 8 :
      riskLevel === "MEDIUM" ? 5 : 2;

  res.json({
    district,
    state,
    disaster,
    riskLevel,
    riskScore
  });
});

// 🔹 API: Send SOS SMS (uses DB alerts if available, falls back to provided placeData)
app.post("/api/sos", async (req, res) => {
  try {
    const { place, phone, placeData } = req.body;

    if (!place) return res.status(400).json({ error: "place is required" });

    // Default target phone if not provided
    const targetPhone = phone || "8078518247";

    // Try to fetch alerts from DB for this place
    let alerts = [];
    try {
      alerts = await Alert.find({ placeName: place });
    } catch (err) {
      // ignore DB errors and fallback to placeData
      alerts = [];
    }

    // If no DB alerts, try incoming placeData.alerts
    if ((!alerts || alerts.length === 0) && placeData && placeData.alerts) {
      alerts = placeData.alerts.map((a) => ({
        title: a.title || a.message || "Alert",
        description: a.description || a.message || "",
        severity: a.severity || "MEDIUM",
        type: a.type || "unknown",
      }));
    }

    // Compose SMS body based on alerts
    let body = `SOS from ${place}: `;
    if (alerts && alerts.length > 0) {
      // determine highest severity
      const severities = { LOW: 1, MEDIUM: 2, HIGH: 3 };
      alerts.sort((a, b) => (severities[b.severity || 'MEDIUM'] || 2) - (severities[a.severity || 'MEDIUM'] || 2));
      const top = alerts[0];
      const types = Array.from(new Set(alerts.map((a) => (a.type || (a.title || '').toLowerCase()).toString())));
      body += `${top.severity || 'MEDIUM'} alert. `;
      body += `Hazards: ${types.slice(0, 3).join(', ')}. `;
      body += `${top.title || top.description || ''}`;
    } else {
      body += "No detailed alert data available. Please check the app for details.";
    }

    // Optional: send via Twilio when configured
    if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_FROM) {
      const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      try {
        await twilio.messages.create({
          body,
          from: process.env.TWILIO_FROM,
          to: targetPhone.startsWith('+') ? targetPhone : `+91${targetPhone}`,
        });
        return res.json({ ok: true, sent: true, via: 'twilio', body });
      } catch (err) {
        console.error('Twilio send error:', err.message || err);
        // fallthrough to simulated response
      }
    }

    // If Twilio not configured or failed, simulate/send response and log
    console.log('Simulated SMS to', targetPhone, ':', body);

    return res.json({ ok: true, sent: false, simulated: true, body });
  } catch (error) {
    console.error('SOS error', error);
    res.status(500).json({ error: error.message });
  }
});


// 🔹 API: GET published alerts (public)
app.get("/api/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find({ status: "published" }).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 API: GET pending alerts (admin only)
app.get("/api/alerts/pending", async (req, res) => {
  try {
    // TODO: Add authentication check for admin
    const pendingAlerts = await Alert.find({ status: "pending" }).sort({ submittedAt: -1 });
    res.json(pendingAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 API: Submit user alert (creates pending alert)
app.post("/api/alerts/submit", async (req, res) => {
  try {
    const { placeName, title, description, severity, email } = req.body;

    if (!placeName || !description || !severity || !email) {
      return res.status(400).json({ error: "placeName, description, severity, and email are required" });
    }

    const newAlert = new Alert({
      placeName,
      title: title || "User Report: " + placeName,
      description,
      severity: severity.toUpperCase(),
      type: "user-report",
      status: "pending",
      submittedBy: email,
      submittedAt: new Date(),
      isPublished: false,
      timestamp: new Date()
    });

    await newAlert.save();

    res.status(201).json({
      ok: true,
      message: "Alert submitted successfully. Our team will review and publish it soon.",
      alertId: newAlert._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 API: Verify and publish/reject alert (admin only)
app.put("/api/alerts/:id/verify", async (req, res) => {
  try {
    const { action, verifiedBy } = req.body; // action: "publish" or "reject"

    if (!action || !["publish", "reject"].includes(action)) {
      return res.status(400).json({ error: "action must be 'publish' or 'reject'" });
    }

    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    if (action === "publish") {
      alert.status = "published";
      alert.isPublished = true;
    } else {
      alert.status = "rejected";
      alert.isPublished = false;
    }

    alert.verifiedBy = verifiedBy || "admin";
    alert.verifiedAt = new Date();

    await alert.save();

    res.json({
      ok: true,
      message: `Alert ${action}ed successfully`,
      alert
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Backend running on port " + PORT);
});
