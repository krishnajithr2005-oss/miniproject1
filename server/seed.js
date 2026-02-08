const mongoose = require("mongoose");
require("dotenv").config();

const Place = require("./models/Place");
const Alert = require("./models/Alert");
const Shelter = require("./models/Shelter");
const Resource = require("./models/Resource");
const History = require("./models/History");
const RiskZone = require("./models/RiskZone");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedDatabase();
    process.exit();
  })
  .catch((err) => {
    console.log("❌ MongoDB error:", err);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    // Clear existing data
    await Place.deleteMany({});
    await Alert.deleteMany({});
    await Shelter.deleteMany({});
    await Resource.deleteMany({});
    await History.deleteMany({});
    await RiskZone.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Create Places
    const idukki = await Place.create({
      name: "Idukki",
      district: "Idukki",
      state: "Kerala",
      coordinates: { latitude: 10.3669, longitude: 76.7184 },
      riskLevel: "HIGH",
      riskScore: 78,
      riskColor: "#ff3b3b",
      activeLayers: {
        flood: true,
        landslide: true,
        coastal: false,
        dam: true,
      },
      description: "High altitude district with mountainous terrain",
    });

    const ernakulam = await Place.create({
      name: "Ernakulam",
      district: "Ernakulam",
      state: "Kerala",
      coordinates: { latitude: 9.9673, longitude: 76.2431 },
      riskLevel: "MEDIUM",
      riskScore: 55,
      riskColor: "#ff9f3b",
      activeLayers: {
        flood: true,
        landslide: false,
        coastal: true,
        dam: false,
      },
      description: "Coastal district with backwaters",
    });

    const wayanad = await Place.create({
      name: "Wayanad",
      district: "Wayanad",
      state: "Kerala",
      coordinates: { latitude: 11.6855, longitude: 76.1308 },
      riskLevel: "HIGH",
      riskScore: 72,
      riskColor: "#ff3b3b",
      activeLayers: {
        flood: true,
        landslide: true,
        coastal: false,
        dam: false,
      },
      description: "Agricultural district with forest coverage",
    });

    console.log("✅ Places created");

    // Create Alerts
    await Alert.create([
      {
        placeId: idukki._id,
        placeName: "Idukki",
        title: "Heavy rainfall detected",
        description: "Continuous heavy rainfall in Idukki district",
        severity: "HIGH",
        type: "flood",
      },
      {
        placeId: idukki._id,
        placeName: "Idukki",
        title: "High landslide probability",
        description: "Landslide risk in hilly areas due to water saturation",
        severity: "HIGH",
        type: "landslide",
      },
      {
        placeId: ernakulam._id,
        placeName: "Ernakulam",
        title: "Coastal alert",
        description: "High tide warning in coastal areas",
        severity: "MEDIUM",
        type: "coastal",
      },
      {
        placeId: wayanad._id,
        placeName: "Wayanad",
        title: "Flash flood warning",
        description: "Flash flood risk in river valleys",
        severity: "HIGH",
        type: "flood",
      },
    ]);

    console.log("✅ Alerts created");

    // Create Shelters
    await Shelter.create([
      {
        placeId: idukki._id,
        placeName: "Idukki",
        name: "Government School Idukki",
        location: { latitude: 10.37, longitude: 76.72 },
        address: "Peerumade",
        capacity: 150,
        facilities: ["food", "water", "medical", "bathroom"],
        contactPerson: "Ramu",
        phone: "04869-123456",
      },
      {
        placeId: ernakulam._id,
        placeName: "Ernakulam",
        name: "Community Hall Ernakulam",
        location: { latitude: 9.97, longitude: 76.24 },
        address: "Kochi",
        capacity: 200,
        facilities: ["food", "water", "medical"],
        contactPerson: "Asha",
        phone: "04842-567890",
      },
      {
        placeId: wayanad._id,
        placeName: "Wayanad",
        name: "Model School Wayanad",
        location: { latitude: 11.69, longitude: 76.13 },
        address: "Kalpetta",
        capacity: 180,
        facilities: ["food", "water", "medical", "bathroom"],
        contactPerson: "John",
        phone: "04936-234567",
      },
    ]);

    console.log("✅ Shelters created");

    // Create Resources
    await Resource.create([
      {
        placeId: idukki._id,
        placeName: "Idukki",
        name: "NDRF Team",
        type: "rescue",
        location: { latitude: 10.37, longitude: 76.72 },
        availability: true,
        contact: "9876543210",
        responseTime: "30 minutes",
      },
      {
        placeId: idukki._id,
        placeName: "Idukki",
        name: "District Hospital",
        type: "medical",
        location: { latitude: 10.38, longitude: 76.71 },
        availability: true,
        contact: "0486-234567",
        responseTime: "20 minutes",
      },
      {
        placeId: ernakulam._id,
        placeName: "Ernakulam",
        name: "Fire Brigade",
        type: "fire",
        location: { latitude: 9.98, longitude: 76.25 },
        availability: true,
        contact: "101",
        responseTime: "15 minutes",
      },
      {
        placeId: wayanad._id,
        placeName: "Wayanad",
        name: "KSDMA",
        type: "rescue",
        location: { latitude: 11.68, longitude: 76.13 },
        availability: true,
        contact: "9876543211",
        responseTime: "40 minutes",
      },
    ]);

    console.log("✅ Resources created");

    // Create History
    await History.create([
      {
        placeId: idukki._id,
        placeName: "Idukki",
        eventDate: new Date("2023-07-15"),
        eventType: "flood",
        severity: "HIGH",
        description: "Heavy rainfall caused flooding in Peerumade",
        affectedArea: "Peerumade taluk",
        casualties: 2,
        damageAssessment: "30 houses damaged",
      },
      {
        placeId: idukki._id,
        placeName: "Idukki",
        eventDate: new Date("2022-08-20"),
        eventType: "landslide",
        severity: "HIGH",
        description: "Landslide blocked main highway",
        affectedArea: "Kumily-Thekkady road",
        casualties: 0,
        damageAssessment: "Road closure for 5 days",
      },
      {
        placeId: ernakulam._id,
        placeName: "Ernakulam",
        eventDate: new Date("2023-10-10"),
        eventType: "coastal",
        severity: "MEDIUM",
        description: "High tide affected low-lying areas",
        affectedArea: "Kochi backwaters",
        casualties: 0,
        damageAssessment: "Fishing nets lost",
      },
    ]);

    console.log("✅ History created");

    console.log("✨ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}
