const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const { connectDB } = require("./config/db");
const { getWeather } = require("./config/weatherApi");

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
const SOSRequest = require("./models/SOSRequest");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "change-this-jwt-secret";
const JWT_EXPIRES_IN = "7d";

const normalizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^0-9]/g, '');
};

connectDB()
  .then(async () => {
    await ensureDefaultAdmin();
  })
  .catch((err) => {
    console.log("MongoDB error:", err.message || err);
  });

const createToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const ensureDefaultAdmin = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@disaster.gov").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    adminUser = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      phone: "9999999999",
      district: "Kerala",
      passwordHash,
      role: "admin",
      status: "active",
      registrationDate: new Date(),
    });
    console.log("Default admin account created:", adminEmail);
  } else if (adminUser.role !== "admin") {
    adminUser.role = "admin";
    await adminUser.save();
  }

  await Admin.findOneAndUpdate(
    { userId: adminUser._id },
    { $set: { email: adminUser.email, isActive: true } },
    { upsert: true, new: true }
  );
};

const upsertApplication = async ({ type, sourceId, applicantName, applicantEmail, district, submittedAt, metadata }) => {
  return Application.findOneAndUpdate(
    { type, sourceId },
    {
      $set: {
        applicantName,
        applicantEmail,
        district,
        submittedAt: submittedAt || new Date(),
        metadata: metadata || {},
      },
      $setOnInsert: { status: "pending" },
    },
    { upsert: true, new: true }
  );
};

const markApplicationReview = async ({ type, sourceId, action, performedBy, notes }) => {
  const status = action === "approve" || action === "publish" ? "approved" : "rejected";
  const application = await Application.findOneAndUpdate(
    { type, sourceId },
    {
      $set: {
        status,
        reviewedAt: new Date(),
        reviewedBy: performedBy,
        notes: notes || "",
      },
    },
    { new: true }
  );

  if (application) {
    await ApprovalHistory.create({
      applicationType: type,
      applicationId: application._id,
      action: status,
      performedBy,
      notes: notes || "",
      performedAt: new Date(),
    });
  }
};

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
};

const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ error: "Authentication required" });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "Invalid token user" });
    if (user.status !== "active") return res.status(403).json({ error: "User is not active" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const requireAdmin = async (req, res, next) => {
  await requireAuth(req, res, async () => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin access required" });
    next();
  });
};

const formatApplication = (type, doc) => {
  if (type === "volunteer") {
    return {
      id: doc._id,
      type,
      name: `${doc.firstName || ""} ${doc.lastName || ""}`.trim(),
      email: doc.email || "",
      district: doc.district || "",
      submittedAt: doc.registrationDate || doc.createdAt,
      status: doc.status,
      details: {
        phone: doc.phone,
        availability: doc.availability,
        skillsAndExperience: doc.skillsAndExperience,
      },
    };
  }
  if (type === "shelter") {
    return {
      id: doc._id,
      type,
      name: doc.shelterName,
      email: doc.ownerEmail || "",
      district: doc.district || "",
      submittedAt: doc.submittedDate || doc.createdAt,
      status: doc.status,
      details: {
        ownerName: doc.ownerName,
        capacity: doc.capacity,
        ownerPhone: doc.ownerPhone,
      },
    };
  }
  return {
    id: doc._id,
    type: "alert",
    name: doc.title || "Alert",
    email: doc.submittedBy || "",
    district: doc.district || "",
    submittedAt: doc.submittedAt || doc.timestamp,
    status: doc.status,
    details: {
      placeName: doc.placeName,
      severity: doc.severity,
      disasterType: doc.type,
    },
  };
};

app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("📝 REGISTRATION REQUEST:", req.body);
    const { firstName, lastName, email, phone, district, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !password) {
      console.log("❌ MISSING FIELDS:", { firstName, lastName, email, phone, password: !!password });
      return res.status(400).json({ error: "firstName, lastName, email, phone, password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone);
    console.log("🔍 CHECKING FOR EXISTING USER:", { normalizedEmail, normalizedPhone });
    
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone }
      ]
    });
    if (existingUser) {
      console.log("❌ USER ALREADY EXISTS:", existingUser.email);
      return res.status(409).json({ error: "Email or phone already registered" });
    }

    console.log("🔐 HASHING PASSWORD...");
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("✅ PASSWORD HASHED");
    
    console.log("💾 CREATING USER...");
    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone: normalizedPhone,
      district: district || "Kerala",
      passwordHash,
      role: "user",
      registrationSource: "web",
      registrationDate: new Date(),
    });
    console.log("✅ USER CREATED:", user.email, "ID:", user._id);

    const token = createToken(user);
    console.log("🎫 TOKEN CREATED, SENDING RESPONSE");
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (error) {
    console.log("❌ REGISTRATION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("🔐 LOGIN REQUEST:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("❌ MISSING CREDENTIALS");
      return res.status(400).json({ error: "Email/phone and password are required" });
    }

    const rawIdentifier = email.trim();
    const normalizedEmail = rawIdentifier.toLowerCase();
    const normalizedPhone = normalizePhone(rawIdentifier);
    const rawPhone = rawIdentifier.replace(/[^0-9+]/g, '');
    console.log("🔍 SEARCHING FOR USER:", { normalizedEmail, normalizedPhone });

    const user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
        { phone: rawPhone }
      ]
    });

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log("✅ USER FOUND:", user.email, "ID:", user._id);

    if (user.status !== 'active') {
      console.log("❌ USER NOT ACTIVE", user.status);
      return res.status(403).json({ error: "User account is not active" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log("❌ PASSWORD MISMATCH");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log("✅ PASSWORD MATCH");

    user.lastLogin = new Date();
    await user.save();
    console.log("✅ LAST LOGIN UPDATED");

    const token = createToken(user);
    console.log("🎫 TOKEN CREATED, SENDING RESPONSE");
    res.json({ token, user: user.toSafeObject() });
  } catch (error) {
    console.log("❌ LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

app.put("/api/auth/profile", requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, phone, district, bio, avatar } = req.body;
    if (firstName !== undefined) req.user.firstName = firstName;
    if (lastName !== undefined) req.user.lastName = lastName;
    if (phone !== undefined) req.user.phone = phone;
    if (district !== undefined) req.user.district = district;
    req.user.profile = {
      ...req.user.profile,
      bio: bio !== undefined ? bio : req.user.profile?.bio,
      avatar: avatar !== undefined ? avatar : req.user.profile?.avatar,
      phone: phone !== undefined ? phone : req.user.profile?.phone,
    };
    await req.user.save();
    res.json({ ok: true, user: req.user.toSafeObject() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalApplications,
      pendingCount,
      approvedCount,
      rejectedCount,
      latestApplications,
    ] = await Promise.all([
      User.countDocuments({}),
      Application.countDocuments({}),
      Application.countDocuments({ status: "pending" }),
      Application.countDocuments({ status: "approved" }),
      Application.countDocuments({ status: "rejected" }),
      Application.find({}).sort({ submittedAt: -1 }).limit(10),
    ]);
    const latestSubmissions = latestApplications.map((item) => ({
      id: item.sourceId,
      type: item.type,
      name: item.applicantName,
      email: item.applicantEmail,
      district: item.district,
      submittedAt: item.submittedAt,
      status: item.status,
      details: item.metadata || {},
    }));

    res.json({
      totalUsers,
      totalApplications,
      pendingCount,
      approvedCount,
      rejectedCount,
      latestSubmissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/applications", requireAdmin, async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    const applications = await Application.find(query).sort({ submittedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve an application
app.put("/api/admin/applications/:id/approve", requireAdmin, async (req, res) => {
  try {
    const { notes } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: "Application not found" });
    
    // Update application status
    application.status = "approved";
    application.approvedAt = new Date();
    application.approvedBy = req.user.email;
    await application.save();
    
    // Update the specific entity based on application type
    if (application.type === "volunteer") {
      await Volunteer.findByIdAndUpdate(application.sourceId, {
        status: "approved",
        approvalDate: new Date(),
        approvedBy: req.user.email
      });
    } else if (application.type === "shelter") {
      await ShelterRegistration.findByIdAndUpdate(application.sourceId, {
        status: "approved",
        approvedDate: new Date(),
        approvedBy: req.user.email
      });
    } else if (application.type === "beneficiary") {
      await Beneficiary.findByIdAndUpdate(application.sourceId, {
        approvedAt: new Date(),
        approvedBy: req.user.email
      });
    } else if (application.type === "alert") {
      await Alert.findByIdAndUpdate(application.sourceId, {
        status: "published",
        verifiedBy: req.user.email,
        verifiedAt: new Date(),
        isPublished: true
      });
    }
    
    // Create approval history
    await ApprovalHistory.create({
      entityType: application.type,
      entityId: application.sourceId,
      action: "approve",
      performedBy: req.user.email,
      performedAt: new Date(),
      notes: notes || "Approved by admin"
    });
    
    res.json({ ok: true, application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject an application
app.put("/api/admin/applications/:id/reject", requireAdmin, async (req, res) => {
  try {
    const { notes } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: "Application not found" });
    
    // Update application status
    application.status = "rejected";
    application.rejectedAt = new Date();
    application.rejectedBy = req.user.email;
    await application.save();
    
    // Update the specific entity based on application type
    if (application.type === "volunteer") {
      await Volunteer.findByIdAndUpdate(application.sourceId, {
        status: "rejected",
        rejectedDate: new Date(),
        rejectedBy: req.user.email
      });
    } else if (application.type === "shelter") {
      await ShelterRegistration.findByIdAndUpdate(application.sourceId, {
        status: "rejected",
        rejectedDate: new Date(),
        rejectedBy: req.user.email
      });
    } else if (application.type === "beneficiary") {
      await Beneficiary.findByIdAndUpdate(application.sourceId, {
        approvedAt: null,
        rejectedBy: req.user.email
      });
    } else if (application.type === "alert") {
      await Alert.findByIdAndUpdate(application.sourceId, {
        status: "rejected",
        verifiedBy: req.user.email,
        verifiedAt: new Date(),
        isPublished: false
      });
    }
    
    // Create approval history
    await ApprovalHistory.create({
      entityType: application.type,
      entityId: application.sourceId,
      action: "reject",
      performedBy: req.user.email,
      performedAt: new Date(),
      notes: notes || "Rejected by admin"
    });
    
    res.json({ ok: true, application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/beneficiaries", requireAdmin, async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({}).sort({ approvedAt: -1 });
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/approvals/history", requireAdmin, async (req, res) => {
  try {
    const history = await ApprovalHistory.find({}).sort({ performedAt: -1 }).limit(200);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users for admin management
app.get("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, role, status, district } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (status) query.status = status;
    if (district) query.district = district;
    
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ registrationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role
app.put("/api/admin/users/:id/role", requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['user', 'volunteer', 'admin', 'shelter_operator'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // If role is being changed to admin, create admin record
    if (role === 'admin') {
      await Admin.findOneAndUpdate(
        { userId: user._id },
        { userId: user._id, email: user.email, isActive: true },
        { upsert: true }
      );
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user status (activate/suspend)
app.put("/api/admin/users/:id/status", requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const status = isActive ? 'active' : 'suspended';
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Update admin status if user is admin
    if (user.role === 'admin') {
      await Admin.findOneAndUpdate(
        { userId: user._id },
        { isActive }
      );
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new admin user
app.post("/api/admin/users/create-admin", requireAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, district, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ error: "firstName, lastName, email, phone, password are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ error: "User already exists with this email" });
    const passwordHash = await bcrypt.hash(password, 10);
    const adminUser = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      district: district || "Kerala",
      passwordHash,
      role: "admin",
      status: "active",
      registrationDate: new Date(),
    });
    await Admin.create({
      userId: adminUser._id,
      email: normalizedEmail,
      isActive: true,
    });
    res.status(201).json({ ok: true, user: adminUser.toSafeObject() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user (any role)
app.post("/api/admin/users/create-user", requireAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, district, role, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "firstName, lastName, email, password are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ error: "User already exists with this email" });
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone: phone || "",
      district: district || "Kerala",
      passwordHash,
      role: role || "user",
      status: "active",
      registrationDate: new Date(),
    });
    
    // Create role-specific records
    if (role === "admin") {
      await Admin.create({
        userId: newUser._id,
        email: normalizedEmail,
        isActive: true,
      });
    } else if (role === "volunteer") {
      await Volunteer.create({
        userId: newUser._id,
        firstName,
        lastName,
        email: normalizedEmail,
        phone: phone || "",
        district: district || "Kerala",
        status: "pending",
        registrationDate: new Date(),
      });
    } else if (role === "shelter_operator") {
      await ShelterRegistration.create({
        userId: newUser._id,
        ownerName: `${firstName} ${lastName}`,
        ownerEmail: normalizedEmail,
        ownerPhone: phone || "",
        district: district || "Kerala",
        status: "pending",
        submittedDate: new Date(),
      });
    }
    
    res.status(201).json({ ok: true, user: newUser.toSafeObject() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new volunteer directly (admin creates volunteer record)
app.post("/api/admin/volunteers/create", requireAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, district, skills, availability, experience } = req.body;
    if (!firstName || !lastName || !email || !skills || skills.length === 0) {
      return res.status(400).json({ error: "firstName, lastName, email, and at least one skill are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ error: "User already exists with this email" });
    
    // Create user account first
    const passwordHash = await bcrypt.hash("Volunteer@123", 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone: phone || "",
      district: district || "Kerala",
      passwordHash,
      role: "volunteer",
      status: "active",
      registrationDate: new Date(),
    });
    
    // Create volunteer record
    const volunteer = await Volunteer.create({
      userId: newUser._id,
      firstName,
      lastName,
      email: normalizedEmail,
      phone: phone || "",
      district: district || "Kerala",
      skills: skills || [],
      availability: availability || "part-time",
      experience: experience || "",
      status: "approved",
      registrationDate: new Date(),
      approvalDate: new Date(),
      approvedBy: req.user.email,
    });
    
    // Create application record
    await Application.create({
      type: "volunteer",
      sourceId: newUser._id,
      applicantName: `${firstName} ${lastName}`,
      applicantEmail: normalizedEmail,
      district: district || "Kerala",
      submittedAt: newUser.registrationDate,
      status: "approved",
      metadata: {
        phone: phone || "",
        skills: skills || [],
        availability: availability || "part-time",
        experience: experience || ""
      }
    });
    
    res.status(201).json({ ok: true, volunteer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new shelter directly (admin creates shelter record)
app.post("/api/admin/shelters/create", requireAdmin, async (req, res) => {
  try {
    const { name, district, address, capacity, facilities, contactPerson, phone, latitude, longitude } = req.body;
    if (!name || !district || !capacity || !facilities || facilities.length === 0) {
      return res.status(400).json({ error: "name, district, capacity, and at least one facility are required" });
    }
    
    // Find or create a place for the district
    let place = await Place.findOne({ district: district });
    if (!place) {
      place = await Place.create({
        name: district,
        district: district,
        state: "Kerala",
        coordinates: { 
          latitude: parseFloat(latitude) || 10.0, 
          longitude: parseFloat(longitude) || 76.0 
        },
        riskLevel: "MEDIUM",
        riskScore: 50,
        riskColor: "#ff9f3b",
        activeLayers: {
          flood: true,
          landslide: false,
          coastal: false,
          dam: false,
        },
        description: `${district} district`,
      });
    }
    
    // Create shelter record
    const shelter = await Shelter.create({
      placeId: place._id,
      placeName: district,
      district: district,
      name: name,
      location: {
        latitude: parseFloat(latitude) || place.coordinates.latitude,
        longitude: parseFloat(longitude) || place.coordinates.longitude
      },
      address: address || `${district} District, Kerala`,
      capacity: parseInt(capacity),
      currentOccupancy: 0,
      facilities: facilities || [],
      contactPerson: contactPerson || "Admin",
      phone: phone || "",
      status: "approved",
      approvedBy: req.user.email,
      approvedDate: new Date(),
    });
    
    // Create application record
    await Application.create({
      type: "shelter",
      sourceId: shelter._id,
      applicantName: name,
      applicantEmail: "admin@disaster.gov",
      district: district,
      submittedAt: new Date(),
      status: "approved",
      metadata: {
        phone: phone || "",
        address: address || `${district} District, Kerala`,
        capacity: parseInt(capacity),
        facilities: facilities || [],
        contactPerson: contactPerson || "Admin"
      }
    });
    
    res.status(201).json({ ok: true, shelter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new beneficiary directly (admin creates beneficiary record)
app.post("/api/admin/beneficiaries/create", requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, district, familySize, assisted } = req.body;
    if (!name || !district || !familySize) {
      return res.status(400).json({ error: "name, district, and familySize are required" });
    }
    
    // Create user account if email is provided
    let userId = null;
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        userId = existing._id;
      } else {
        const passwordHash = await bcrypt.hash("Beneficiary@123", 10);
        const newUser = await User.create({
          firstName: name.split(' ')[0] || name,
          lastName: name.split(' ')[1] || "",
          email: normalizedEmail,
          phone: phone || "",
          district: district || "Kerala",
          passwordHash,
          role: "user",
          status: "active",
          registrationDate: new Date(),
        });
        userId = newUser._id;
      }
    }
    
    // Create beneficiary record
    const beneficiary = await Beneficiary.create({
      userId: userId,
      name: name,
      email: email || "",
      phone: phone || "",
      district: district || "Kerala",
      familySize: parseInt(familySize),
      assisted: assisted || false,
      approvedAt: assisted ? new Date() : null,
      approvedBy: assisted ? req.user.email : null,
    });
    
    // Create application record
    await Application.create({
      type: "beneficiary",
      sourceId: beneficiary._id,
      applicantName: name,
      applicantEmail: email || "admin@disaster.gov",
      district: district || "Kerala",
      submittedAt: new Date(),
      status: "approved",
      metadata: {
        phone: phone || "",
        familySize: parseInt(familySize),
        assisted: assisted || false
      }
    });
    
    res.status(201).json({ ok: true, beneficiary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/places", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      district,
      state,
      latitude,
      longitude,
      riskLevel,
      riskScore,
      description,
    } = req.body;
    if (!name || !district) return res.status(400).json({ error: "name and district are required" });

    const place = await Place.create({
      name,
      district,
      state: state || "Kerala",
      coordinates: {
        latitude: Number(latitude) || 0,
        longitude: Number(longitude) || 0,
      },
      riskLevel: riskLevel || "MEDIUM",
      riskScore: Number(riskScore) || 50,
      riskColor: (riskLevel || "MEDIUM") === "HIGH" ? "#ff3b3b" : (riskLevel || "MEDIUM") === "LOW" ? "#3bff3b" : "#ff9f3b",
      activeLayers: {
        flood: true,
        landslide: false,
        coastal: false,
        dam: false,
      },
      description: description || "",
      createdAt: new Date(),
    });
    res.status(201).json({ ok: true, place });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/places/:id", requireAdmin, async (req, res) => {
  try {
    const updates = req.body || {};
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: "Place not found" });
    if (updates.name !== undefined) place.name = updates.name;
    if (updates.district !== undefined) place.district = updates.district;
    if (updates.state !== undefined) place.state = updates.state;
    if (updates.riskLevel !== undefined) place.riskLevel = updates.riskLevel;
    if (updates.riskScore !== undefined) place.riskScore = Number(updates.riskScore);
    if (updates.description !== undefined) place.description = updates.description;
    if (updates.latitude !== undefined || updates.longitude !== undefined) {
      place.coordinates = {
        latitude: updates.latitude !== undefined ? Number(updates.latitude) : place.coordinates?.latitude || 0,
        longitude: updates.longitude !== undefined ? Number(updates.longitude) : place.coordinates?.longitude || 0,
      };
    }
    await place.save();
    res.json({ ok: true, place });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/places/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await Place.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Place not found" });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/alerts", requireAdmin, async (req, res) => {
  try {
    const { title, placeName, description, severity, type, district } = req.body;
    if (!title || !placeName || !description) {
      return res.status(400).json({ error: "title, placeName, and description are required" });
    }
    const alert = await Alert.create({
      title,
      placeName,
      description,
      severity: (severity || "MEDIUM").toUpperCase(),
      type: (type || "admin-update").toLowerCase(),
      district: district || "",
      status: "published",
      submittedBy: req.user.email,
      submittedAt: new Date(),
      verifiedBy: req.user.email,
      verifiedAt: new Date(),
      isPublished: true,
      timestamp: new Date(),
    });
    await upsertApplication({
      type: "alert",
      sourceId: alert._id,
      applicantName: alert.title,
      applicantEmail: req.user.email,
      district: alert.district,
      submittedAt: alert.submittedAt,
      metadata: { placeName: alert.placeName, severity: alert.severity, disasterType: alert.type },
    });
    await markApplicationReview({
      type: "alert",
      sourceId: alert._id,
      action: "publish",
      performedBy: req.user.email,
      notes: "Created directly by admin",
    });
    res.status(201).json({ ok: true, alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Seed Demo Alerts (for testing)
app.post("/api/admin/alerts/seed-demo", requireAdmin, async (req, res) => {
  try {
    const { district } = req.body;
    const targetDistrict = district || 'Thiruvananthapuram';
    
    const demoAlerts = [
      // CRITICAL Alerts
      {
        placeName: targetDistrict,
        district: targetDistrict,
        title: '🚨 CRITICAL: Severe Flooding Expected',
        description: 'Heavy rainfall of 200mm+ expected in next 24 hours. Multiple areas at risk of severe flooding. Immediate evacuation recommended for low-lying areas.',
        severity: 'CRITICAL',
        type: 'flood',
        status: 'published',
        isPublished: true,
        submittedBy: 'system@demo.com',
        submittedAt: new Date(),
        verifiedBy: req.user.email,
        verifiedAt: new Date()
      },
      {
        placeName: targetDistrict,
        district: targetDistrict,
        title: '🔴 CRITICAL: Landslide Warning',
        description: 'Soil saturation at critical levels. High risk of landslides in hilly regions. Avoid travel to mountainous areas.',
        severity: 'CRITICAL',
        type: 'landslide',
        status: 'published',
        isPublished: true,
        submittedBy: 'system@demo.com',
        submittedAt: new Date(Date.now() - 3600000),
        verifiedBy: req.user.email,
        verifiedAt: new Date(Date.now() - 3600000)
      },
      // HIGH Alerts
      {
        placeName: targetDistrict,
        district: targetDistrict,
        title: '🟠 HIGH: Dam Water Level Rising',
        description: 'Reservoir at 85% capacity. Controlled release planned. Stay alert for downstream warnings.',
        severity: 'HIGH',
        type: 'dam',
        status: 'published',
        isPublished: true,
        submittedBy: 'system@demo.com',
        submittedAt: new Date(Date.now() - 7200000),
        verifiedBy: req.user.email,
        verifiedAt: new Date(Date.now() - 7200000)
      },
      {
        placeName: targetDistrict,
        district: targetDistrict,
        title: '🟠 HIGH: Coastal Erosion Alert',
        description: 'High tide warning with strong waves. Coastal areas at risk. Avoid beaches and coastal roads.',
        severity: 'HIGH',
        type: 'coastal',
        status: 'published',
        isPublished: true,
        submittedBy: 'system@demo.com',
        submittedAt: new Date(Date.now() - 10800000),
        verifiedBy: req.user.email,
        verifiedAt: new Date(Date.now() - 10800000)
      },
      {
        placeName: targetDistrict,
        district: targetDistrict,
        title: '🟠 HIGH: Thunderstorm Warning',
        description: 'Severe thunderstorms expected with lightning and strong winds. Stay indoors.',
        severity: 'HIGH',
        type: 'flood',
        status: 'published',
        isPublished: true,
        submittedBy: 'system@demo.com',
        submittedAt: new Date(Date.now() - 14400000),
        verifiedBy: req.user.email,
        verifiedAt: new Date(Date.now() - 14400000)
      },
      // MODERATE Alerts
      {
        placeName: targetDistrict,
        district: targetDistrict,
        title: '🟡 MODERATE: Heavy Rain Alert',
        description: 'Moderate to heavy rainfall expected. Be cautious while traveling. Check road conditions.',
        severity: 'MODERATE',
        type: 'flood',
        status: 'published',
        isPublished: true,
        submittedBy: 'system@demo.com',
        submittedAt: new Date(Date.now() - 18000000),
        verifiedBy: req.user.email,
        verifiedAt: new Date(Date.now() - 18000000)
      },
      {
        placeName: targetDistrict,
        district: targetDistrict,
        title: '🟡 MODERATE: Wind Advisory',
        description: 'Strong winds expected. Secure loose objects outdoors. Drive carefully on exposed roads.',
        severity: 'MODERATE',
        type: 'coastal',
        status: 'published',
        isPublished: true,
        submittedBy: 'system@demo.com',
        submittedAt: new Date(Date.now() - 21600000),
        verifiedBy: req.user.email,
        verifiedAt: new Date(Date.now() - 21600000)
      },
      {
        placeName: targetDistrict,
        district: targetDistrict,
        title: '🟡 MODERATE: Waterlogging Risk',
        description: 'Urban areas may experience waterlogging. Avoid flood-prone routes.',
        severity: 'MODERATE',
        type: 'flood',
        status: 'published',
        isPublished: true,
        submittedBy: 'system@demo.com',
        submittedAt: new Date(Date.now() - 25200000),
        verifiedBy: req.user.email,
        verifiedAt: new Date(Date.now() - 25200000)
      },
      // LOW Alerts
      {
        placeName: targetDistrict,
        district: targetDistrict,
        title: '🟢 LOW: General Weather Update',
        description: 'Light showers expected. Normal activities can continue with basic precautions.',
        severity: 'LOW',
        type: 'flood',
        status: 'published',
        isPublished: true,
        submittedBy: 'system@demo.com',
        submittedAt: new Date(Date.now() - 28800000),
        verifiedBy: req.user.email,
        verifiedAt: new Date(Date.now() - 28800000)
      }
    ];

    // Clear existing demo alerts for this district
    await Alert.deleteMany({ 
      district: targetDistrict, 
      submittedBy: 'system@demo.com'
    });

    // Insert new demo alerts
    const inserted = await Alert.insertMany(demoAlerts);

    // Create application records for tracking
    for (const alert of inserted) {
      await upsertApplication({
        type: 'alert',
        sourceId: alert._id,
        applicantName: 'Demo System',
        applicantEmail: 'system@demo.com',
        district: targetDistrict,
        submittedAt: alert.submittedAt,
        metadata: { severity: alert.severity, type: alert.type, isDemo: true }
      });
    }

    res.status(201).json({ 
      ok: true, 
      message: `${inserted.length} demo alerts created for ${targetDistrict}`,
      count: inserted.length,
      alerts: inserted
    });
  } catch (error) {
    console.error('Error seeding demo alerts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Clear all demo alerts
app.delete("/api/admin/alerts/clear-demo", requireAdmin, async (req, res) => {
  try {
    const { district } = req.query;
    const filter = { submittedBy: 'system@demo.com' };
    if (district) filter.district = district;
    
    const result = await Alert.deleteMany(filter);
    
    // Also clean up applications
    await Application.deleteMany({ 
      type: 'alert', 
      'metadata.isDemo': true,
      ...(district && { district })
    });
    
    res.json({ 
      ok: true, 
      message: `Deleted ${result.deletedCount} demo alerts`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get alerts with filtering by severity
app.get("/api/alerts/by-severity", async (req, res) => {
  try {
    const { severity, district, limit = 10 } = req.query;
    const filter = { status: 'published', isPublished: true };
    
    if (severity) filter.severity = severity.toUpperCase();
    if (district) filter.district = district;
    
    const alerts = await Alert.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    // Group by severity for summary
    const summary = await Alert.aggregate([
      { $match: filter },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({ alerts, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/knowledge", requireAdmin, async (req, res) => {
  try {
    const knowledge = await AdminKnowledge.find({}).sort({ createdAt: -1 });
    res.json(knowledge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/knowledge", requireAdmin, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) return res.status(400).json({ error: "title and content are required" });
    const record = await AdminKnowledge.create({
      title,
      content,
      category: category || "general",
      createdBy: req.user.email,
      isPublished: true,
    });
    res.status(201).json({ ok: true, record });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/analyze", async (req, res) => {
  try {
    const placeName = req.query.place;
    if (!placeName) return res.status(400).json({ error: "Place is required" });
    const place = await Place.findOne({ name: placeName });
    if (!place) return res.status(404).json({ error: "Place not found" });

    const [alerts, shelters, resources, riskZones, history] = await Promise.all([
      Alert.find({ placeName }),
      Shelter.find({ placeName }),
      Resource.find({ placeName }),
      RiskZone.find({ placeName }),
      History.find({ placeName }).sort({ eventDate: -1 }),
    ]);

    res.json({
      place: place.name,
      district: place.district,
      coordinates: [place.coordinates.latitude, place.coordinates.longitude],
      risk: { score: place.riskScore, level: place.riskLevel, color: place.riskColor },
      activeLayers: place.activeLayers,
      alerts: alerts.map((a) => ({
        title: a.title,
        type: a.type,
        message: a.description,
        description: a.description,
        severity: a.severity,
        timestamp: a.timestamp,
        status: a.status,
      })),
      shelters: shelters.map((s) => ({ name: s.name, capacity: s.capacity, location: s.location })),
      resources: resources.map((r) => ({ name: r.name, type: r.type, contact: r.contact })),
      riskZones,
      history: history.map((h) => ({
        type: h.eventType,
        date: h.eventDate,
        severity: h.severity,
        description: h.description,
        deaths: h.casualties || 0,
        displaced: h.displaced || 0,
        damageAssessment: h.damageAssessment,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/analyze", (req, res) => {
  const { district, state, disaster } = req.body;
  const riskLevels = ["LOW", "MEDIUM", "HIGH"];
  const riskLevel = riskLevels[Math.floor(Math.random() * 3)];
  const riskScore = riskLevel === "HIGH" ? 8 : riskLevel === "MEDIUM" ? 5 : 2;
  res.json({ district, state, disaster, riskLevel, riskScore });
});

app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const latitude = parseFloat(lat) || 9.9312;
    const longitude = parseFloat(lng) || 76.2673;
    const weatherData = await getWeather(latitude, longitude);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/places", async (req, res) => {
  try {
    const places = await Place.find({});
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/shelters", async (req, res) => {
  try {
    const { place, district } = req.query;
    const query = {};
    if (place) query.placeName = place;
    if (district) query.district = district;
    const shelters = await Shelter.find(query);
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/shelters/pending", requireAdmin, async (req, res) => {
  try {
    const pendingShelters = await ShelterRegistration.find({ status: "pending" }).sort({ submittedDate: -1 });
    res.json(pendingShelters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/shelters/applications", requireAdmin, async (req, res) => {
  try {
    const shelters = await ShelterRegistration.find({}).sort({ submittedDate: -1 });
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/shelters/register", async (req, res) => {
  try {
    const {
      shelterName,
      ownerName,
      ownerEmail,
      ownerPhone,
      address,
      district,
      capacity,
      amenities,
      contactPerson,
      coordinates,
      documentProof,
      userId,
    } = req.body;

    const nameRegex = /^[A-Za-z\s.'-]+$/;

    if (!shelterName || !ownerName || !ownerEmail || !district || !capacity) {
      return res.status(400).json({ error: "Missing required fields: shelterName, ownerName, ownerEmail, district, capacity" });
    }

    if (!nameRegex.test(ownerName.trim())) {
      return res.status(400).json({ error: 'Owner name must contain only letters and spaces' });
    }

    if (!contactPerson || !nameRegex.test(contactPerson.trim())) {
      return res.status(400).json({ error: 'Contact person name must contain only letters and spaces' });
    }

    const amenitiesList = Array.isArray(amenities) ? amenities : [];
    const newShelterRegistration = new ShelterRegistration({
      shelterName,
      ownerName,
      ownerEmail,
      ownerPhone: ownerPhone || "N/A",
      address: address || `${district} District`,
      district,
      capacity: parseInt(capacity, 10),
      amenities: amenitiesList,
      facilities: amenitiesList.length > 0 ? amenitiesList : ["water", "bathrooms"],
      coordinates: coordinates || { latitude: 0, longitude: 0 },
      contactPerson: contactPerson || ownerName,
      status: "pending",
      submittedDate: new Date(),
      documentProof: documentProof || null,
      userId: userId || null,
    });

    await newShelterRegistration.save();
    await upsertApplication({
      type: "shelter",
      sourceId: newShelterRegistration._id,
      applicantName: shelterName,
      applicantEmail: ownerEmail,
      district,
      submittedAt: newShelterRegistration.submittedDate,
      metadata: {
        ownerName,
        ownerPhone: ownerPhone || "N/A",
        capacity: parseInt(capacity, 10),
      },
    });
    res.status(201).json({
      ok: true,
      message: "Shelter registration submitted successfully. Our team will review and approve it within 24-48 hours.",
      registrationId: newShelterRegistration._id,
      status: "pending",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/resources", async (req, res) => {
  try {
    const { place, type, district } = req.query;
    const query = {};
    if (place) query.placeName = place;
    if (type) query.type = type;
    if (district) query.district = district;
    const resources = await Resource.find(query);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/shelters/:id/verify", requireAdmin, async (req, res) => {
  try {
    const { action, notes } = req.body;
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "action must be 'approve' or 'reject'" });
    }

    const shelterRegistration = await ShelterRegistration.findById(req.params.id);
    if (!shelterRegistration) return res.status(404).json({ error: "Shelter registration not found" });

    shelterRegistration.status = action === "approve" ? "approved" : "rejected";
    shelterRegistration.approvedBy = req.user.email;
    shelterRegistration.approvalDate = new Date();
    shelterRegistration.notes = notes || "";

    if (action === "approve") {
      const existingShelter = await Shelter.findOne({
        name: shelterRegistration.shelterName,
        district: shelterRegistration.district,
        address: shelterRegistration.address,
      });
      if (!existingShelter) {
        await Shelter.create({
          name: shelterRegistration.shelterName,
          district: shelterRegistration.district,
          placeName: shelterRegistration.district,
          address: shelterRegistration.address,
          capacity: shelterRegistration.capacity,
          currentOccupancy: 0,
          facilities: shelterRegistration.facilities || ["water", "bathrooms"],
          contactPerson: shelterRegistration.contactPerson || shelterRegistration.ownerName,
          phone: shelterRegistration.ownerPhone,
          location: {
            latitude: shelterRegistration.coordinates?.latitude || 0,
            longitude: shelterRegistration.coordinates?.longitude || 0,
          },
        });
      }

      await Beneficiary.findOneAndUpdate(
        { sourceType: "shelter", sourceId: shelterRegistration._id },
        {
          $set: {
            name: shelterRegistration.shelterName,
            email: shelterRegistration.ownerEmail,
            district: shelterRegistration.district,
            approvedBy: req.user.email,
            approvedAt: new Date(),
            status: "active",
            details: {
              contactPerson: shelterRegistration.contactPerson || shelterRegistration.ownerName,
              capacity: shelterRegistration.capacity,
              address: shelterRegistration.address,
            },
          },
        },
        { upsert: true, new: true }
      );
    }

    await shelterRegistration.save();
    await markApplicationReview({
      type: "shelter",
      sourceId: shelterRegistration._id,
      action,
      performedBy: req.user.email,
      notes,
    });
    res.json({ ok: true, message: `Shelter registration ${action}d successfully`, shelterRegistration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/volunteers/register", async (req, res) => {
  try {
    console.log(" VOLUNTEER REGISTRATION REQUEST:", req.body);
    const {
      firstName,
      lastName,
      email,
      phone,
      district,
      skillsAndExperience,
      availability,
      address,
      userId,
    } = req.body;
    if (!firstName || !lastName || !email || !phone || !district) {
      console.log(" MISSING FIELDS:", { firstName, lastName, email, phone, district });
      return res.status(400).json({ error: "Missing required fields: firstName, lastName, email, phone, district" });
    }

    console.log(" CREATING VOLUNTEER...");
    const newVolunteer = new Volunteer({
      firstName,
      lastName,
      email,
      phone,
      district,
      address: address || "",
      skillsAndExperience,
      availability,
      documentProof: documentProof || null,
      userId: userId || null,
      status: "pending",
      registrationDate: new Date(),
    });
    
    console.log(" SAVING VOLUNTEER TO DATABASE...");
    await newVolunteer.save();
    console.log(" VOLUNTEER SAVED:", newVolunteer._id, newVolunteer.email);
    
    console.log(" CREATING APPLICATION RECORD...");
    await upsertApplication({
      type: "volunteer",
      sourceId: newVolunteer._id,
      applicantName: `${firstName} ${lastName}`.trim(),
      applicantEmail: email,
      district,
      submittedAt: newVolunteer.registrationDate,
      metadata: {
        phone,
        availability,
      },
    });
    console.log(" APPLICATION RECORD CREATED");
    
    console.log(" SENDING SUCCESS RESPONSE");
    res.status(201).json({
      ok: true,
      message: "Volunteer registered successfully. Awaiting admin approval.",
      volunteerId: newVolunteer._id,
      status: "pending",
    });
  } catch (error) {
    console.log(" VOLUNTEER REGISTRATION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/volunteers/pending", requireAdmin, async (req, res) => {
  try {
    const pendingVolunteers = await Volunteer.find({ status: "pending" }).sort({ registrationDate: -1 });
    res.json(pendingVolunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public volunteer endpoint for users
app.get("/api/public/volunteers", async (req, res) => {
  try {
    const { district } = req.query;
    const query = { status: "approved" }; // Only show approved volunteers
    if (district) query.district = district;

    const volunteers = await Volunteer.find(query)
      .populate('userId', 'firstName lastName email phone')
      .sort({ registrationDate: -1 });

    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/volunteers", requireAdmin, async (req, res) => {
  try {
    const { status, district } = req.query;
    const query = {};
    if (status) query.status = status;
    if (district) query.district = district;
    const volunteers = await Volunteer.find(query).sort({ registrationDate: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/volunteers/:id/verify", requireAdmin, async (req, res) => {
  try {
    const { action, notes } = req.body;
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "action must be 'approve' or 'reject'" });
    }
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ error: "Volunteer not found" });

    volunteer.status = action === "approve" ? "approved" : "rejected";
    volunteer.approvedBy = req.user.email;
    volunteer.approvalDate = new Date();
    volunteer.notes = notes || "";
    await volunteer.save();

    if (action === "approve") {
      await User.findOneAndUpdate(
        { email: volunteer.email.toLowerCase() },
        {
          $set: {
            role: "volunteer",
            district: volunteer.district,
            phone: volunteer.phone,
            status: "active",
          },
        }
      );

      await Beneficiary.findOneAndUpdate(
        { sourceType: "volunteer", sourceId: volunteer._id },
        {
          $set: {
            name: `${volunteer.firstName || ""} ${volunteer.lastName || ""}`.trim(),
            email: volunteer.email,
            district: volunteer.district,
            approvedBy: req.user.email,
            approvedAt: new Date(),
            status: "active",
            details: {
              phone: volunteer.phone,
              availability: volunteer.availability,
              skillsAndExperience: volunteer.skillsAndExperience,
            },
          },
        },
        { upsert: true, new: true }
      );
    }

    await markApplicationReview({
      type: "volunteer",
      sourceId: volunteer._id,
      action,
      performedBy: req.user.email,
      notes,
    });
    res.json({ ok: true, message: `Volunteer ${action}d successfully`, volunteer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/sos", async (req, res) => {
  try {
    const { place, phone, placeData } = req.body;
    if (!place) return res.status(400).json({ error: "place is required" });

    const targetPhone = phone || "8078518247";
    let alerts = [];
    try {
      alerts = await Alert.find({ placeName: place });
    } catch (err) {
      alerts = [];
    }
    if ((!alerts || alerts.length === 0) && placeData && placeData.alerts) {
      alerts = placeData.alerts.map((a) => ({
        title: a.title || a.message || "Alert",
        description: a.description || a.message || "",
        severity: a.severity || "MEDIUM",
        type: a.type || "unknown",
      }));
    }

    let body = `SOS from ${place}: `;
    if (alerts && alerts.length > 0) {
      const severities = { LOW: 1, MEDIUM: 2, HIGH: 3 };
      alerts.sort((a, b) => (severities[b.severity || "MEDIUM"] || 2) - (severities[a.severity || "MEDIUM"] || 2));
      const top = alerts[0];
      const types = Array.from(new Set(alerts.map((a) => (a.type || (a.title || "").toLowerCase()).toString())));
      body += `${top.severity || "MEDIUM"} alert. Hazards: ${types.slice(0, 3).join(", ")}. ${top.title || top.description || ""}`;
    } else {
      body += "No detailed alert data available. Please check the app for details.";
    }

    if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_FROM) {
      const twilio = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      try {
        await twilio.messages.create({
          body,
          from: process.env.TWILIO_FROM,
          to: targetPhone.startsWith("+") ? targetPhone : `+91${targetPhone}`,
        });
        return res.json({ ok: true, sent: true, via: "twilio", body });
      } catch (err) {
        console.error("Twilio send error:", err.message || err);
      }
    }

    console.log("Simulated SMS to", targetPhone, ":", body);
    return res.json({ ok: true, sent: false, simulated: true, body });
  } catch (error) {
    console.error("SOS error", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find({ status: "published" }).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/alerts/pending", requireAdmin, async (req, res) => {
  try {
    const pendingAlerts = await Alert.find({ status: "pending" }).sort({ submittedAt: -1 });
    res.json(pendingAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/alerts/applications", requireAdmin, async (req, res) => {
  try {
    const alerts = await Alert.find({}).sort({ submittedAt: -1, timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/alerts/submit", async (req, res) => {
  try {
    const { placeName, title, description, severity, email, district, disasterType, date } = req.body;
    if (!placeName || !description || !severity || !email) {
      return res.status(400).json({ error: "placeName, description, severity, and email are required" });
    }
    const newAlert = new Alert({
      placeName,
      title: title || `User Report: ${placeName}`,
      description,
      severity: severity.toUpperCase(),
      type: disasterType ? disasterType.toLowerCase() : "user-report",
      district: district || "",
      eventDate: date ? new Date(date) : new Date(),
      status: "pending",
      submittedBy: email,
      submittedAt: new Date(),
      isPublished: false,
      timestamp: new Date(),
    });
    await newAlert.save();
    await upsertApplication({
      type: "alert",
      sourceId: newAlert._id,
      applicantName: newAlert.title,
      applicantEmail: email,
      district: district || "",
      submittedAt: newAlert.submittedAt,
      metadata: {
        placeName,
        severity: newAlert.severity,
        disasterType: newAlert.type,
      },
    });
    res.status(201).json({
      ok: true,
      message: "Alert submitted successfully. Our team will review and publish it soon.",
      alertId: newAlert._id,
      status: "pending",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/alerts/:id/verify", requireAdmin, async (req, res) => {
  try {
    const { action } = req.body;
    if (!action || !["publish", "reject"].includes(action)) {
      return res.status(400).json({ error: "action must be 'publish' or 'reject'" });
    }

    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });

    if (action === "publish") {
      alert.status = "published";
      alert.isPublished = true;
    } else {
      alert.status = "rejected";
      alert.isPublished = false;
    }
    alert.verifiedBy = req.user.email;
    alert.verifiedAt = new Date();
    await alert.save();

    if (action === "publish") {
      await Beneficiary.findOneAndUpdate(
        { sourceType: "alert", sourceId: alert._id },
        {
          $set: {
            name: alert.title,
            email: alert.submittedBy,
            district: alert.district,
            approvedBy: req.user.email,
            approvedAt: new Date(),
            status: "active",
            details: {
              placeName: alert.placeName,
              severity: alert.severity,
              type: alert.type,
            },
          },
        },
        { upsert: true, new: true }
      );
    }

    await markApplicationReview({
      type: "alert",
      sourceId: alert._id,
      action,
      performedBy: req.user.email,
      notes: "",
    });

    res.json({ ok: true, message: `Alert ${action}ed successfully`, alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SOS API Endpoints

// Create SOS Request (Auth required)
app.post("/api/sos", requireAuth, async (req, res) => {
  try {
    const { location, emergencyType, description, latitude, longitude, priority } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sosRequest = await SOSRequest.create({
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      district: user.district,
      location: location || 'Unknown location',
      latitude: latitude || null,
      longitude: longitude || null,
      emergencyType: emergencyType || 'other',
      description: description || '',
      priority: priority || 'high',
      status: 'active'
    });

    res.status(201).json({ 
      message: "SOS request created successfully", 
      sos: sosRequest 
    });
  } catch (error) {
    console.error("SOS creation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get SOS Requests (Public - filtered by district)
app.get("/api/sos", async (req, res) => {
  try {
    const { district, status } = req.query;
    const filter = {};
    
    if (district) filter.district = district;
    if (status) filter.status = status;
    
    const sosRequests = await SOSRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(sosRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Active SOS Requests Count by District
app.get("/api/sos/active", async (req, res) => {
  try {
    const { district } = req.query;
    const filter = { status: { $in: ['active', 'responding'] } };
    
    if (district) filter.district = district;
    
    const count = await SOSRequest.countDocuments(filter);
    const requests = await SOSRequest.find(filter).sort({ createdAt: -1 });
    
    res.json({ count, requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get All SOS Requests with filters
app.get("/api/admin/sos", requireAdmin, async (req, res) => {
  try {
    const { district, status, priority } = req.query;
    const filter = {};
    
    if (district) filter.district = district;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const sosRequests = await SOSRequest.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    
    // Get summary stats
    const stats = {
      total: await SOSRequest.countDocuments(filter),
      active: await SOSRequest.countDocuments({ ...filter, status: 'active' }),
      responding: await SOSRequest.countDocuments({ ...filter, status: 'responding' }),
      resolved: await SOSRequest.countDocuments({ ...filter, status: 'resolved' }),
      critical: await SOSRequest.countDocuments({ ...filter, priority: 'critical', status: { $in: ['active', 'responding'] } })
    };
    
    res.json({ requests: sosRequests, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Respond to SOS
app.put("/api/admin/sos/:id/respond", requireAdmin, async (req, res) => {
  try {
    const { note } = req.body;
    const adminEmail = req.user.email;
    
    const sos = await SOSRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'responding',
        $push: { 
          responseNotes: { 
            note: note || 'Response initiated', 
            addedBy: adminEmail,
            addedAt: new Date()
          } 
        }
      },
      { new: true }
    );
    
    if (!sos) {
      return res.status(404).json({ error: "SOS request not found" });
    }
    
    res.json({ message: "Response recorded", sos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Resolve SOS
app.put("/api/admin/sos/:id/resolve", requireAdmin, async (req, res) => {
  try {
    const { note, resolution } = req.body;
    const adminEmail = req.user.email;
    
    const sos = await SOSRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy: adminEmail,
        $push: { 
          responseNotes: { 
            note: note || `Resolved: ${resolution || 'Issue resolved'}`, 
            addedBy: adminEmail,
            addedAt: new Date()
          } 
        }
      },
      { new: true }
    );
    
    if (!sos) {
      return res.status(404).json({ error: "SOS request not found" });
    }
    
    res.json({ message: "SOS request resolved", sos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Cancel/Delete SOS
app.delete("/api/admin/sos/:id", requireAdmin, async (req, res) => {
  try {
    const sos = await SOSRequest.findByIdAndDelete(req.params.id);
    
    if (!sos) {
      return res.status(404).json({ error: "SOS request not found" });
    }
    
    res.json({ message: "SOS request deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get SOS Dashboard Stats (for admin dashboard)
app.get("/api/admin/sos/dashboard", requireAdmin, async (req, res) => {
  try {
    const { district } = req.query;
    
    const baseFilter = district ? { district } : {};
    
    const stats = {
      total: await SOSRequest.countDocuments(baseFilter),
      active: await SOSRequest.countDocuments({ ...baseFilter, status: 'active' }),
      responding: await SOSRequest.countDocuments({ ...baseFilter, status: 'responding' }),
      resolved: await SOSRequest.countDocuments({ ...baseFilter, status: 'resolved' }),
      byDistrict: await SOSRequest.aggregate([
        { $match: { status: { $in: ['active', 'responding'] } } },
        { $group: { _id: '$district', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      recent: await SOSRequest.find(baseFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .select('userName district emergencyType status priority createdAt')
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
