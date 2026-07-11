const mongoose = require("mongoose");
require("dotenv").config();

const Place = require("./models/Place");
const Alert = require("./models/Alert");
const Shelter = require("./models/Shelter");
const Resource = require("./models/Resource");
const History = require("./models/History");
const RiskZone = require("./models/RiskZone");
const Volunteer = require("./models/Volunteer");

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
    await Volunteer.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // All 14 Kerala Districts with coordinates
    const districts = [
      { name: "Thiruvananthapuram", lat: 8.7439, lng: 76.7273, risk: "MEDIUM", score: 55 },
      { name: "Kollam", lat: 8.8932, lng: 76.5832, risk: "MEDIUM", score: 52 },
      { name: "Pathanamthitta", lat: 9.2618, lng: 76.7597, risk: "MEDIUM", score: 58 },
      { name: "Alappuzha", lat: 9.4981, lng: 76.3388, risk: "HIGH", score: 72 },
      { name: "Kottayam", lat: 9.5906, lng: 76.8152, risk: "MEDIUM", score: 62 },
      { name: "Ernakulam", lat: 9.9673, lng: 76.2431, risk: "MEDIUM", score: 55 },
      { name: "Idukki", lat: 10.3669, lng: 76.7184, risk: "HIGH", score: 78 },
      { name: "Thrissur", lat: 10.5276, lng: 76.2144, risk: "MEDIUM", score: 50 },
      { name: "Malappuram", lat: 11.0476, lng: 76.1663, risk: "MEDIUM", score: 48 },
      { name: "Kozhikode", lat: 11.2588, lng: 75.7804, risk: "LOW", score: 35 },
      { name: "Wayanad", lat: 11.6855, lng: 76.1308, risk: "HIGH", score: 72 },
      { name: "Kannur", lat: 12.1833, lng: 75.3667, risk: "LOW", score: 32 },
      { name: "Kasaragod", lat: 12.5030, lng: 75.3439, risk: "LOW", score: 30 },
      { name: "Palakkad", lat: 10.7667, lng: 76.6500, risk: "MEDIUM", score: 54 }
    ];

    const placeMap = {};
    const riskColors = { HIGH: "#ff3b3b", MEDIUM: "#ff9f3b", LOW: "#3bff3b" };

    // Create Places
    for (const dist of districts) {
      const place = await Place.create({
        name: dist.name,
        district: dist.name,
        state: "Kerala",
        coordinates: { latitude: dist.lat, longitude: dist.lng },
        riskLevel: dist.risk,
        riskScore: dist.score,
        riskColor: riskColors[dist.risk],
        activeLayers: {
          flood: dist.risk === "HIGH" || dist.risk === "MEDIUM",
          landslide: dist.risk === "HIGH",
          coastal: dist.lat < 9,
          dam: dist.name === "Idukki" || dist.name === "Pathanamthitta",
        },
        description: `${dist.name} district with risk level ${dist.risk}`,
      });
      placeMap[dist.name] = place;
    }

    console.log("✅ All 14 districts created");

    // Create realistic alerts
    const alertData = [
      { place: "Idukki", title: "Heavy rainfall alert", desc: "Continuous heavy rainfall expected", severity: "HIGH", type: "flood" },
      { place: "Idukki", title: "Landslide warning", desc: "High landslide risk in hilly areas", severity: "HIGH", type: "landslide" },
      { place: "Alappuzha", title: "Flood warning", desc: "Water levels rising in backwaters", severity: "HIGH", type: "flood" },
      { place: "Wayanad", title: "Landslide alert", desc: "Landslide risk due to soil saturation", severity: "HIGH", type: "landslide" },
      { place: "Ernakulam", title: "Coastal alert", desc: "High tide warning", severity: "MEDIUM", type: "coastal" },
      { place: "Kottayam", title: "Heavy rain alert", desc: "Moderate to heavy rainfall", severity: "MEDIUM", type: "flood" },
    ];

    for (const alert of alertData) {
      await Alert.create({
        placeId: placeMap[alert.place]._id,
        placeName: alert.place,
        title: alert.title,
        description: alert.desc,
        severity: alert.severity,
        type: alert.type,
        status: "published",
      });
    }

    console.log("✅ Alerts created");

    // Create shelters for each district
    const shelterNames = [
      "Government School",
      "Community Hall",
      "Indoor Stadium",
      "Government College",
      "District Hospital",
      "Government Office",
      "Temple Hall",
      "Community Center"
    ];

    let shelterCount = 0;
    for (const [districtName, place] of Object.entries(placeMap)) {
      const numShelters = Math.floor(Math.random() * 4) + 3; // 3-6 shelters per district
      for (let i = 0; i < numShelters; i++) {
        const shelterName = shelterNames[Math.floor(Math.random() * shelterNames.length)];
        await Shelter.create({
          placeId: place._id,
          placeName: districtName,
          district: districtName,
          name: `${shelterName} - ${districtName} ${i + 1}`,
          location: {
            latitude: place.coordinates.latitude + (Math.random() - 0.5) * 0.1,
            longitude: place.coordinates.longitude + (Math.random() - 0.5) * 0.1
          },
          address: `${districtName} District`,
          capacity: Math.floor(Math.random() * 200) + 100, // 100-300
          currentOccupancy: Math.floor(Math.random() * 100),
          facilities: ["food", "water", "medical", "bathroom"],
          contactPerson: `Contact ${i + 1}`,
          phone: `948${Math.floor(Math.random() * 10000000)}`,
        });
        shelterCount++;
      }
    }

    console.log(`✅ ${shelterCount} shelters created across all districts`);

    // Create resources for each district
    const resourceTypes = [
      { type: "rescue", name: "NDRF Team" },
      { type: "rescue", name: "KSDMA Team" },
      { type: "medical", name: "District Hospital" },
      { type: "medical", name: "Ambulance Service" },
      { type: "fire", name: "Fire Brigade" },
      { type: "police", name: "Police Station" },
      { type: "rescue", name: "Civil Defence" }
    ];

    let resourceCount = 0;
    for (const [districtName, place] of Object.entries(placeMap)) {
      const numResources = Math.floor(Math.random() * 4) + 3; // 3-6 resources per district
      const selectedTypes = resourceTypes
        .sort(() => Math.random() - 0.5)
        .slice(0, numResources);

      for (const resource of selectedTypes) {
        await Resource.create({
          placeId: place._id,
          placeName: districtName,
          district: districtName,
          name: resource.name,
          type: resource.type,
          location: {
            latitude: place.coordinates.latitude + (Math.random() - 0.5) * 0.05,
            longitude: place.coordinates.longitude + (Math.random() - 0.5) * 0.05
          },
          availability: Math.random() > 0.1, // 90% availability
          contact: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          responseTime: `${Math.floor(Math.random() * 30) + 10} minutes`,
        });
        resourceCount++;
      }
    }

    console.log(`✅ ${resourceCount} resources created`);

    // Create historical disasters
    const historyData = [
      { place: "Idukki", event: "2023 Floods", severity: "HIGH", casualties: 5, damage: "100+ homes" },
      { place: "Wayanad", event: "2023 Landslides", severity: "HIGH", casualties: 3, damage: "Roads blocked" },
      { place: "Alappuzha", event: "2022 Flooding", severity: "HIGH", casualties: 2, damage: "Crops destroyed" },
      { place: "Ernakulam", event: "2021 High Tide", severity: "MEDIUM", casualties: 0, damage: "Fishing nets lost" },
    ];

    for (const hist of historyData) {
      await History.create({
        placeId: placeMap[hist.place]._id,
        placeName: hist.place,
        eventDate: new Date(`2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`),
        eventType: hist.event.toLowerCase().includes("flood") ? "flood" : "landslide",
        severity: hist.severity,
        description: hist.event,
        affectedArea: `${hist.place} District`,
        casualties: hist.casualties,
        damageAssessment: hist.damage,
      });
    }

    console.log("✅ Historical data created");

    // Create sample approved volunteers for admin dashboard
    const volunteerNames = [
      { first: "Rajesh", last: "Kumar" },
      { first: "Priya", last: "Sharma" },
      { first: "Amit", last: "Patel" },
      { first: "Anjali", last: "Singh" },
      { first: "Vikram", last: "Verma" },
    ];

    for (const name of volunteerNames) {
      await Volunteer.create({
        firstName: name.first,
        lastName: name.last,
        email: `${name.first.toLowerCase()}@volunteer.gov`,
        phone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        district: districts[Math.floor(Math.random() * districts.length)].name,
        skillsAndExperience: "First aid, Community engagement, Disaster response",
        availability: Math.random() > 0.5 ? "full-time" : "part-time",
        status: "approved",
        approvedBy: "admin",
        registrationDate: new Date(),
        approvalDate: new Date(),
      });
    }

    console.log("✅ Sample volunteers created");

    console.log("\n🎉 Database seeded successfully with all 14 Kerala districts!");
    console.log(`Summary:`);
    console.log(`- Places: 14 districts`);
    console.log(`- Shelters: ${shelterCount}`);
    console.log(`- Resources: ${resourceCount}`);
    console.log(`- Alerts: 6`);
    console.log(`- Historical events: 4`);
    console.log(`- Approved volunteers: 5`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}
