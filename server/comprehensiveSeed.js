const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import all models
const Place = require("./models/Place");
const Alert = require("./models/Alert");
const Shelter = require("./models/Shelter");
const Resource = require("./models/Resource");
const History = require("./models/History");
const RiskZone = require("./models/RiskZone");
const Volunteer = require("./models/Volunteer");
const ShelterRegistration = require("./models/ShelterRegistration");
const User = require("./models/User");
const Admin = require("./models/Admin");
const Application = require("./models/Application");
const Beneficiary = require("./models/Beneficiary");
const ApprovalHistory = require("./models/ApprovalHistory");
const AdminKnowledge = require("./models/AdminKnowledge");

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
    // Clear existing data (only seed/admin users, preserve web-registered users)
    await Place.deleteMany({});
    await Alert.deleteMany({});
    await Shelter.deleteMany({});
    await Resource.deleteMany({});
    await History.deleteMany({});
    await RiskZone.deleteMany({});
    await Volunteer.deleteMany({});
    await ShelterRegistration.deleteMany({});
    await User.deleteMany({ registrationSource: { $in: ['seed', 'admin'] } });
    await Admin.deleteMany({});
    await Application.deleteMany({});
    await Beneficiary.deleteMany({});
    await ApprovalHistory.deleteMany({});
    await AdminKnowledge.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Create default admin user
    const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
    const adminUser = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@disaster.gov",
      phone: "9999999999",
      district: "Thiruvananthapuram",
      passwordHash: adminPasswordHash,
      role: "admin",
      status: "active",
      registrationSource: "admin",
      registrationDate: new Date(),
    });

    await Admin.create({
      userId: adminUser._id,
      email: adminUser.email,
      isActive: true,
    });

    console.log("✅ Admin user created");

    // Kerala districts with realistic data
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

    // Create regular users
    const regularUsers = [
      { firstName: "Rahul", lastName: "Menon", email: "rahul.m@email.com", district: "Ernakulam", role: "user" },
      { firstName: "Anita", lastName: "Nair", email: "anita.n@email.com", district: "Thiruvananthapuram", role: "user" },
      { firstName: "Suresh", lastName: "Pillai", email: "suresh.p@email.com", district: "Kozhikode", role: "user" },
      { firstName: "Meera", lastName: "Rao", email: "meera.r@email.com", district: "Thrissur", role: "user" },
      { firstName: "Arjun", lastName: "Varma", email: "arjun.v@email.com", district: "Kottayam", role: "user" }
    ];

    for (const userData of regularUsers) {
      const userPasswordHash = await bcrypt.hash("User@123", 10);
      const user = await User.create({
        ...userData,
        phone: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
        passwordHash: userPasswordHash,
        status: "active",
        registrationSource: "seed",
        registrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      });
    }

    console.log("✅ Regular users created");

    // Create volunteer users
    const volunteerUsers = [
      { firstName: "Ramesh", lastName: "Kumar", email: "ramesh.k@email.com", district: "Idukki", phone: "9876543210" },
      { firstName: "Deepa", lastName: "Sharma", email: "deepa.s@email.com", district: "Alappuzha", phone: "9876543211" },
      { firstName: "Vikram", lastName: "Singh", email: "vikram.s@email.com", district: "Wayanad", phone: "9876543212" },
      { firstName: "Priya", lastName: "Patel", email: "priya.p@email.com", district: "Kannur", phone: "9876543213" },
      { firstName: "Amit", lastName: "Verma", email: "amit.v@email.com", district: "Malappuram", phone: "9876543214" }
    ];

    for (const volunteerData of volunteerUsers) {
      const volunteerPasswordHash = await bcrypt.hash("Volunteer@123", 10);
      const user = await User.create({
        ...volunteerData,
        role: "volunteer",
        passwordHash: volunteerPasswordHash,
        registrationSource: "seed",
        status: Math.random() > 0.3 ? "active" : "suspended",
        registrationDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date in last 60 days
      });

      // Create corresponding volunteer record
      await Volunteer.create({
        userId: user._id,
        firstName: volunteerData.firstName,
        lastName: volunteerData.lastName,
        email: volunteerData.email,
        phone: volunteerData.phone,
        district: volunteerData.district,
        skills: ["First Aid", "Rescue Operations", "Communication"],
        availability: Math.random() > 0.5 ? "full-time" : "part-time",
        status: Math.random() > 0.3 ? "approved" : "pending",
        registrationDate: user.registrationDate,
        approvalDate: Math.random() > 0.5 ? new Date() : null,
        approvedBy: Math.random() > 0.5 ? "admin" : null,
      });

      // Create application for volunteer
      await Application.create({
        type: "volunteer",
        sourceId: user._id,
        applicantName: `${volunteerData.firstName} ${volunteerData.lastName}`,
        applicantEmail: volunteerData.email,
        district: volunteerData.district,
        submittedAt: user.registrationDate,
        status: Math.random() > 0.3 ? "approved" : "pending",
        metadata: {
          phone: volunteerData.phone,
          skills: ["First Aid", "Rescue Operations", "Communication"],
          availability: Math.random() > 0.5 ? "full-time" : "part-time"
        }
      });
    }

    console.log("✅ Volunteer users and applications created");

    // Create shelter operator users
    const shelterOperators = [
      { firstName: "John", lastName: "Matthew", email: "john.m@shelter.gov", district: "Ernakulam", phone: "9876543220" },
      { firstName: "Mary", lastName: "Joseph", email: "mary.j@shelter.gov", district: "Kozhikode", phone: "9876543221" },
      { firstName: "David", lastName: "Thomas", email: "david.t@shelter.gov", district: "Thrissur", phone: "9876543222" }
    ];

    for (const operatorData of shelterOperators) {
      const operatorPasswordHash = await bcrypt.hash("Shelter@123", 10);
      const user = await User.create({
        ...operatorData,
        role: "shelter_operator",
        passwordHash: operatorPasswordHash,
        registrationSource: "seed",
        status: "active",
        registrationDate: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000),
      });

      // Create shelter registration
      await ShelterRegistration.create({
        userId: user._id,
        ownerName: `${operatorData.firstName} ${operatorData.lastName}`,
        ownerEmail: operatorData.email,
        ownerPhone: operatorData.phone,
        shelterName: `${operatorData.firstName}'s Community Shelter`,
        district: operatorData.district,
        address: `${operatorData.district} District, Kerala`,
        capacity: Math.floor(Math.random() * 200) + 100,
        facilities: ["food", "water", "medical", "bathroom"],
        submittedDate: user.registrationDate,
        status: Math.random() > 0.4 ? "approved" : "pending",
        approvedDate: Math.random() > 0.5 ? new Date() : null,
        approvedBy: Math.random() > 0.5 ? "admin" : null,
      });

      // Create application for shelter
      await Application.create({
        type: "shelter",
        sourceId: user._id,
        applicantName: `${operatorData.firstName} ${operatorData.lastName}`,
        applicantEmail: operatorData.email,
        district: operatorData.district,
        submittedAt: user.registrationDate,
        status: Math.random() > 0.4 ? "approved" : "pending",
        metadata: {
          phone: operatorData.phone,
          shelterName: `${operatorData.firstName}'s Community Shelter`,
          capacity: Math.floor(Math.random() * 200) + 100,
          facilities: ["food", "water", "medical", "bathroom"]
        }
      });
    }

    console.log("✅ Shelter operators and registrations created");

    // Create beneficiaries
    const beneficiaries = [
      { name: "Lakshmi", email: "lakshmi.b@email.com", district: "Ernakulam", familySize: 4, assisted: true },
      { name: "Gopal", email: "gopal.b@email.com", district: "Idukki", familySize: 2, assisted: false },
      { name: "Saritha", email: "saritha.b@email.com", district: "Alappuzha", familySize: 3, assisted: true },
      { name: "Mohan", email: "mohan.b@email.com", district: "Wayanad", familySize: 5, assisted: false },
      { name: "Radhika", email: "radhika.b@email.com", district: "Kannur", familySize: 1, assisted: true },
      { name: "Sunil", email: "sunil.b@email.com", district: "Thrissur", familySize: 6, assisted: false },
      { name: "Anjana", email: "anjana.b@email.com", district: "Kottayam", familySize: 2, assisted: true },
      { name: "Vinod", email: "vinod.b@email.com", district: "Malappuram", familySize: 3, assisted: false }
    ];

    for (const beneficiaryData of beneficiaries) {
      const beneficiaryPasswordHash = await bcrypt.hash("Beneficiary@123", 10);
      const user = await User.create({
        firstName: beneficiaryData.name.split(" ")[0],
        lastName: beneficiaryData.name.split(" ")[1] || "Nair",
        email: beneficiaryData.email,
        phone: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
        district: beneficiaryData.district,
        role: "user",
        passwordHash: beneficiaryPasswordHash,
        status: "active",
        registrationDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      });

      await Beneficiary.create({
        sourceType: "volunteer",
        sourceId: user._id,
        name: beneficiaryData.name,
        email: beneficiaryData.email,
        district: beneficiaryData.district,
        details: {
          phone: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
          familySize: beneficiaryData.familySize,
          assisted: beneficiaryData.assisted,
          userId: user._id
        },
        approvedAt: Math.random() > 0.5 ? new Date() : null,
        approvedBy: Math.random() > 0.5 ? "admin" : null,
      });

      // Note: Beneficiary applications are not created as the Application model doesn't support 'beneficiary' type
      // Beneficiaries are directly approved in the system
    }

    console.log("✅ Beneficiaries created");

    // Create comprehensive alerts
    const alertData = [
      { place: "Idukki", title: "Heavy rainfall alert", desc: "Continuous heavy rainfall expected in next 48 hours", severity: "HIGH", type: "flood", status: "published" },
      { place: "Idukki", title: "Landslide warning", desc: "High landslide risk in hilly areas due to soil saturation", severity: "HIGH", type: "landslide", status: "published" },
      { place: "Alappuzha", title: "Flood warning", desc: "Water levels rising in backwaters; residents advised to move to higher ground", severity: "HIGH", type: "flood", status: "published" },
      { place: "Wayanad", title: "Landslide alert", desc: "Landslide risk due to continuous rainfall", severity: "HIGH", type: "landslide", status: "published" },
      { place: "Ernakulam", title: "Coastal alert", desc: "High tide warning for coastal areas", severity: "MEDIUM", type: "coastal", status: "published" },
      { place: "Kottayam", title: "Heavy rain alert", desc: "Moderate to heavy rainfall expected", severity: "MEDIUM", type: "flood", status: "published" },
      { place: "Thrissur", title: "Weather update", desc: "Monsoon activity intensifying across the district", severity: "MEDIUM", type: "weather", status: "published" },
      { place: "Kozhikode", title: "Emergency notice", desc: "Emergency services on high alert due to unstable weather", severity: "MEDIUM", type: "emergency", status: "published" },
      { place: "Malappuram", title: "River watch", desc: "Malabar river catchments being monitored for rising water levels", severity: "LOW", type: "flood", status: "published" },
      { place: "Kannur", title: "Administrative notice", desc: "District administration meeting scheduled to review preparedness plans", severity: "LOW", type: "admin-update", status: "published" },
      { place: "Thiruvananthapuram", title: "Coastal advisory", desc: "Strong winds and high surf expected along the coast", severity: "MEDIUM", type: "coastal", status: "published" },
      { place: "Kollam", title: "Backwater alert", desc: "Sea level rise may affect low-lying backwater islands", severity: "MEDIUM", type: "flood", status: "published" },
      { place: "Pathanamthitta", title: "Landslide watch", desc: "Soil moisture levels high in hilly areas; avoid steep slopes", severity: "MEDIUM", type: "landslide", status: "published" },
      { place: "Palakkad", title: "River alert", desc: "Bharathapuzha river levels are rising; monitor local updates", severity: "MEDIUM", type: "flood", status: "published" },
      { place: "Kasaragod", title: "Monsoon advisory", desc: "Intermittent heavy rain expected in northern districts", severity: "LOW", type: "weather", status: "published" }
    ];

    for (const alert of alertData) {
      const createdAlert = await Alert.create({
        placeId: placeMap[alert.place]._id,
        placeName: alert.place,
        title: alert.title,
        description: alert.desc,
        severity: alert.severity,
        type: alert.type,
        status: alert.status,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in last week
      });

      // Create application for alert if pending
      if (alert.status === "pending") {
        await Application.create({
          type: "alert",
          sourceId: createdAlert._id,
          applicantName: "System Generated",
          applicantEmail: "system@disaster.gov",
          district: alert.place,
          submittedAt: createdAlert.createdAt,
          status: "pending",
          metadata: {
            title: alert.title,
            severity: alert.severity,
            type: alert.type
          }
        });
      }
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
      "Community Center",
      "Panchayat Office"
    ];

    let shelterCount = 0;
    for (const [districtName, place] of Object.entries(placeMap)) {
      const numShelters = Math.floor(Math.random() * 4) + 3; // 3-6 shelters per district
      for (let i = 0; i < numShelters; i++) {
        const shelterName = shelterNames[Math.floor(Math.random() * shelterNames.length)];
        const shelter = await Shelter.create({
          placeId: place._id,
          placeName: districtName,
          district: districtName,
          name: `${shelterName} - ${districtName} ${i + 1}`,
          location: {
            latitude: place.coordinates.latitude + (Math.random() - 0.5) * 0.1,
            longitude: place.coordinates.longitude + (Math.random() - 0.5) * 0.1
          },
          address: `${districtName} District, Kerala`,
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
      { place: "Kottayam", event: "2020 Landslide", severity: "MEDIUM", casualties: 1, damage: "Village affected" },
      { place: "Thrissur", event: "2019 Flood", severity: "HIGH", casualties: 4, damage: "Infrastructure damaged" },
      { place: "Thiruvananthapuram", event: "2022 Coastal Storm", severity: "MEDIUM", casualties: 0, damage: "Minor road flooding" },
      { place: "Kollam", event: "2021 Backwater Surge", severity: "MEDIUM", casualties: 0, damage: "Boat service disruptions" },
      { place: "Pathanamthitta", event: "2020 Flash Flood", severity: "HIGH", casualties: 3, damage: "Bridge damage" },
      { place: "Palakkad", event: "2021 River Flood", severity: "MEDIUM", casualties: 1, damage: "Farmland inundated" },
      { place: "Malappuram", event: "2019 Monsoon Flood", severity: "MEDIUM", casualties: 2, damage: "Local road damage" },
      { place: "Kozhikode", event: "2020 Cyclone", severity: "HIGH", casualties: 2, damage: "Power outages across the city" },
      { place: "Kannur", event: "2022 Heavy Rain", severity: "LOW", casualties: 0, damage: "Landslip near coastal road" },
      { place: "Kasaragod", event: "2021 Coastal Flood", severity: "LOW", casualties: 0, damage: "Small-scale property flooding" }
    ];

    for (const hist of historyData) {
      await History.create({
        placeId: placeMap[hist.place]._id,
        placeName: hist.place,
        eventDate: new Date(`2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`),
        eventType: hist.event.toLowerCase().includes("flood") ? "flood" : hist.event.toLowerCase().includes("landslide") ? "landslide" : "weather",
        severity: hist.severity,
        description: hist.event,
        affectedArea: `${hist.place} District`,
        casualties: hist.casualties,
        damageAssessment: hist.damage,
      });
    }

    console.log("✅ Historical data created");

    // Create admin knowledge base
    const knowledgeData = [
      {
        title: "Flood Safety Guidelines",
        category: "safety",
        content: "During floods, move to higher ground immediately. Avoid walking through moving water. Keep emergency supplies ready. Follow official evacuation orders."
      },
      {
        title: "Landslide Warning Signs",
        category: "emergency",
        content: "Watch for cracks in ground, tilting trees, unusual sounds, muddy water in streams. Report immediately to authorities if you notice these signs."
      },
      {
        title: "Emergency Contact Numbers",
        category: "general",
        content: "Emergency: 108 | Fire: 101 | Police: 100 | Ambulance: 102 | Disaster Management: 1077 | District Control Room numbers available on official website."
      },
      {
        title: "Evacuation Procedures",
        category: "evacuation",
        content: "Follow designated evacuation routes. Carry essential documents, medicines, and emergency kit. Help elderly and children during evacuation."
      },
      {
        title: "First Aid Basics",
        category: "medical",
        content: "Learn CPR, basic wound care, and how to treat fractures. Keep first aid kit ready with bandages, antiseptics, and essential medicines."
      },
      {
        title: "Weather Monitoring",
        category: "weather",
        content: "Regularly check weather updates from IMD. Use official apps and websites. Pay attention to warning levels and take appropriate action."
      },
      {
        title: "Shelter Management",
        category: "general",
        content: "Maintain hygiene in shelters. Follow COVID protocols. Register all occupants. Coordinate with relief agencies for supplies."
      },
      {
        title: "Communication During Disasters",
        category: "emergency",
        content: "Use text messages when calls fail. Keep battery backup. Know emergency frequencies. Use social media for updates from official sources."
      }
    ];

    for (const knowledge of knowledgeData) {
      await AdminKnowledge.create({
        title: knowledge.title,
        category: knowledge.category,
        content: knowledge.content,
        createdBy: "admin",
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    console.log("✅ Admin knowledge base created");

    // Create approval history
    const approvalHistoryData = [
      { type: "volunteer", action: "approve", performedBy: "admin", notes: "Well qualified with relevant experience" },
      { type: "shelter", action: "approve", performedBy: "admin", notes: "Facility meets all requirements" },
      { type: "volunteer", action: "reject", performedBy: "admin", notes: "Incomplete documentation" },
      { type: "alert", action: "approve", performedBy: "admin", notes: "Critical information for public safety" }
    ];

    for (const history of approvalHistoryData) {
      await ApprovalHistory.create({
        applicationType: history.type,
        applicationId: new mongoose.Types.ObjectId(), // Random ID for demonstration
        action: history.action === "approve" ? "approved" : "rejected",
        performedBy: "admin@disaster.gov",
        performedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Random date in last 2 weeks
        notes: history.notes,
      });
    }

    console.log("✅ Approval history created");

    console.log("\n🎉 Database seeded successfully with comprehensive data!");
    console.log(`Summary:`);
    console.log(`- Admin Users: 1`);
    console.log(`- Regular Users: ${regularUsers.length}`);
    console.log(`- Volunteer Users: ${volunteerUsers.length}`);
    console.log(`- Shelter Operators: ${shelterOperators.length}`);
    console.log(`- Beneficiaries: ${beneficiaries.length}`);
    console.log(`- Places: 14 districts`);
    console.log(`- Shelters: ${shelterCount}`);
    console.log(`- Resources: ${resourceCount}`);
    console.log(`- Alerts: ${alertData.length}`);
    console.log(`- Historical events: ${historyData.length}`);
    console.log(`- Knowledge Articles: ${knowledgeData.length}`);
    console.log(`- Applications: ${volunteerUsers.length + shelterOperators.length + beneficiaries.length + alertData.filter(a => a.status === 'pending').length}`);
    console.log(`- Approval History: ${approvalHistoryData.length}`);

    console.log("\n📝 Login Credentials:");
    console.log(`Admin: admin@disaster.gov / Admin@12345`);
    console.log(`Users: *.email.com / User@123`);
    console.log(`Volunteers: *.email.com / Volunteer@123`);
    console.log(`Shelter Operators: *.email.com / Shelter@123`);
    console.log(`Beneficiaries: *.email.com / Beneficiary@123`);

    // Create demo alerts for Thiruvananthapuram
    await createDemoAlerts();
    
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
}

async function createDemoAlerts() {
  console.log("\n🚨 Creating Demo Alerts...");
  
  const district = 'Thiruvananthapuram';
  
  const demoAlerts = [
    {
      placeName: district,
      district: district,
      title: '🚨 CRITICAL: Severe Flooding Expected',
      description: 'Heavy rainfall of 200mm+ expected in next 24 hours. Multiple areas at risk of severe flooding. Immediate evacuation recommended for low-lying areas.',
      severity: 'CRITICAL',
      type: 'flood',
      status: 'published',
      isPublished: true,
      submittedBy: 'system@demo.com',
      submittedAt: new Date(),
      verifiedBy: 'admin@disaster.gov',
      verifiedAt: new Date(),
      timestamp: new Date()
    },
    {
      placeName: district,
      district: district,
      title: '🔴 CRITICAL: Landslide Warning',
      description: 'Soil saturation at critical levels. High risk of landslides in hilly regions. Avoid travel to mountainous areas.',
      severity: 'CRITICAL',
      type: 'landslide',
      status: 'published',
      isPublished: true,
      submittedBy: 'system@demo.com',
      submittedAt: new Date(Date.now() - 3600000),
      verifiedBy: 'admin@disaster.gov',
      verifiedAt: new Date(Date.now() - 3600000),
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      placeName: district,
      district: district,
      title: '🟠 HIGH: Dam Water Level Rising',
      description: 'Reservoir at 85% capacity. Controlled release planned. Stay alert for downstream warnings.',
      severity: 'HIGH',
      type: 'dam',
      status: 'published',
      isPublished: true,
      submittedBy: 'system@demo.com',
      submittedAt: new Date(Date.now() - 7200000),
      verifiedBy: 'admin@disaster.gov',
      verifiedAt: new Date(Date.now() - 7200000),
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      placeName: district,
      district: district,
      title: '🟠 HIGH: Coastal Erosion Alert',
      description: 'High tide warning with strong waves. Coastal areas at risk. Avoid beaches and coastal roads.',
      severity: 'HIGH',
      type: 'coastal',
      status: 'published',
      isPublished: true,
      submittedBy: 'system@demo.com',
      submittedAt: new Date(Date.now() - 10800000),
      verifiedBy: 'admin@disaster.gov',
      verifiedAt: new Date(Date.now() - 10800000),
      timestamp: new Date(Date.now() - 10800000)
    },
    {
      placeName: district,
      district: district,
      title: '🟠 HIGH: Thunderstorm Warning',
      description: 'Severe thunderstorms expected with lightning and strong winds. Stay indoors.',
      severity: 'HIGH',
      type: 'flood',
      status: 'published',
      isPublished: true,
      submittedBy: 'system@demo.com',
      submittedAt: new Date(Date.now() - 14400000),
      verifiedBy: 'admin@disaster.gov',
      verifiedAt: new Date(Date.now() - 14400000),
      timestamp: new Date(Date.now() - 14400000)
    },
    {
      placeName: district,
      district: district,
      title: '🟡 MODERATE: Heavy Rain Alert',
      description: 'Moderate to heavy rainfall expected. Be cautious while traveling. Check road conditions.',
      severity: 'MODERATE',
      type: 'flood',
      status: 'published',
      isPublished: true,
      submittedBy: 'system@demo.com',
      submittedAt: new Date(Date.now() - 18000000),
      verifiedBy: 'admin@disaster.gov',
      verifiedAt: new Date(Date.now() - 18000000),
      timestamp: new Date(Date.now() - 18000000)
    },
    {
      placeName: district,
      district: district,
      title: '🟡 MODERATE: Wind Advisory',
      description: 'Strong winds expected. Secure loose objects outdoors. Drive carefully on exposed roads.',
      severity: 'MODERATE',
      type: 'coastal',
      status: 'published',
      isPublished: true,
      submittedBy: 'system@demo.com',
      submittedAt: new Date(Date.now() - 21600000),
      verifiedBy: 'admin@disaster.gov',
      verifiedAt: new Date(Date.now() - 21600000),
      timestamp: new Date(Date.now() - 21600000)
    },
    {
      placeName: district,
      district: district,
      title: '🟡 MODERATE: Waterlogging Risk',
      description: 'Urban areas may experience waterlogging. Avoid flood-prone routes.',
      severity: 'MODERATE',
      type: 'flood',
      status: 'published',
      isPublished: true,
      submittedBy: 'system@demo.com',
      submittedAt: new Date(Date.now() - 25200000),
      verifiedBy: 'admin@disaster.gov',
      verifiedAt: new Date(Date.now() - 25200000),
      timestamp: new Date(Date.now() - 25200000)
    },
    {
      placeName: district,
      district: district,
      title: '🟢 LOW: General Weather Update',
      description: 'Light showers expected. Normal activities can continue with basic precautions.',
      severity: 'LOW',
      type: 'flood',
      status: 'published',
      isPublished: true,
      submittedBy: 'system@demo.com',
      submittedAt: new Date(Date.now() - 28800000),
      verifiedBy: 'admin@disaster.gov',
      verifiedAt: new Date(Date.now() - 28800000),
      timestamp: new Date(Date.now() - 28800000)
    }
  ];

  await Alert.insertMany(demoAlerts);
  console.log(`✅ Created ${demoAlerts.length} demo alerts`);
}
