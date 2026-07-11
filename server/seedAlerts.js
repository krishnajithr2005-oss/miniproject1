const mongoose = require('mongoose');
require('dotenv').config();

const Alert = require('./models/Alert');
const Application = require('./models/Application');

async function seedDemoAlerts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const district = 'Thiruvananthapuram';
    
    // Clear existing demo alerts
    await Alert.deleteMany({ district, submittedBy: 'system@demo.com' });
    console.log('Cleared existing demo alerts');

    const demoAlerts = [
      // CRITICAL Alerts
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
      // HIGH Alerts
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
      // MODERATE Alerts
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
      // LOW Alerts
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

    const inserted = await Alert.insertMany(demoAlerts);
    console.log(`✅ Created ${inserted.length} demo alerts`);

    // Create application records
    for (const alert of inserted) {
      await Application.findOneAndUpdate(
        { type: 'alert', sourceId: alert._id },
        {
          $set: {
            applicantName: 'Demo System',
            applicantEmail: 'system@demo.com',
            district: district,
            submittedAt: alert.submittedAt,
            status: 'approved',
            metadata: { severity: alert.severity, type: alert.type, isDemo: true }
          }
        },
        { upsert: true }
      );
    }

    console.log('\nDemo alerts summary:');
    console.log('- CRITICAL: 2 alerts');
    console.log('- HIGH: 3 alerts');
    console.log('- MODERATE: 3 alerts');
    console.log('- LOW: 1 alert');
    console.log('\nRefresh your browser to see the alerts!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedDemoAlerts();
