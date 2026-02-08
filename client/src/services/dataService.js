/**
 * DATA SERVICE
 * Provides mock/demo data for disaster risk analysis
 * Structure allows easy replacement with real API calls
 * 
 * FUTURE: Replace getPlaceData() with actual API:
 * const response = await fetch(`/api/places/${place}`);
 * return response.json();
 */

/**
 * Generate mock demo data for a given place
 * @param {string} place - District or location name
 * @returns {Object|null} - Place data object or null if not found
 * 
 * Data structure:
 * {
 *   coordinates: { lat, lng },
 *   riskScore: 0-100,
 *   riskLevel: "LOW|MODERATE|HIGH",
 *   alerts: [],
 *   historicalDisasters: {},
 *   rescueTeams: number,
 *   medicalUnits: number,
 *   helplineNumbers: [],
 *   sosAvailable: boolean,
 *   shelterCount: number,
 *   shelters: []
 * }
 */
export const getPlaceData = (placeName) => {
  const placeDatabase = {
    Idukki: {
      coordinates: { lat: 10.3089, lng: 76.7168 },
      riskScore: 85,
      riskLevel: "HIGH",
      alerts: [
        {
          title: "🏔️ Landslide Risk Alert",
          message: "High probability of landslides in elevated areas",
          description: "Critical landslide warning issued for hilly terrain",
          severity: "HIGH",
          timestamp: "2 hours ago",
          impact: "Severe",
          details: [
            "Heavy rainfall expected in next 24 hours",
            "Soil saturation levels at 85%",
            "Vulnerable slopes identified in 12 locations",
            "Evacuation routes have been prepared",
            "Rescue teams on standby at 5 locations",
          ],
        },
        {
          title: "💧 Dam Water Level Warning",
          message: "Water levels approaching spillway capacity",
          description: "Idukki Dam water level rising - spillway release may occur",
          severity: "HIGH",
          timestamp: "45 minutes ago",
          impact: "Severe",
          details: [
            "Current level: 87% of maximum capacity",
            "Release gates may need to open soon",
            "Downstream areas should remain alert",
            "Continuous monitoring in progress",
            "Alert level increased from MEDIUM to HIGH",
          ],
        },
        {
          title: "🌊 Flash Flood Potential",
          message: "Low-lying areas at risk during heavy rain",
          description: "Flash flood warning for river valleys and low-lying zones",
          severity: "MEDIUM",
          timestamp: "1 hour ago",
          impact: "Moderate",
          details: [
            "River water level rising at 2cm per hour",
            "Flood-prone zones: Periyar Valley, Munnar foothills",
            "Early warning system activated",
            "Mobile alert sent to 15,000+ residents",
            "Sandbags distributed to vulnerable areas",
          ],
        },
        {
          title: "⛈️ Heavy Rainfall Alert",
          message: "Monsoon rain expected with intensity up to 150mm",
          description: "Southwest monsoon with heavy to very heavy rainfall predicted",
          severity: "MEDIUM",
          timestamp: "30 minutes ago",
          impact: "Moderate",
          details: [
            "Rainfall prediction: 120-150mm in 24 hours",
            "Wind speed: 35-45 km/h expected",
            "Visibility low in hilly areas",
            "Travel advisories issued on NH44 and mountain roads",
            "Schools in high-risk zones closed for 2 days",
          ],
        },
      ],
      historicalDisasters: {
        "2018 Floods": "450+ casualties",
        "2013 Flash Floods": "200+ missing",
      },
      rescueTeams: 22,
      medicalUnits: 15,
      helplineNumbers: ["112", "1077", "9446700700"],
      sosAvailable: true,
      shelterCount: 2,
      shelters: [
        { name: "Idukki Government School Shelter", capacity: 75 },
        { name: "Community Center Relief Camp", capacity: 60 },
      ],
    },

    // Add more places...
    Kottayam: {
      coordinates: { lat: 9.6426, lng: 76.5249 },
      riskScore: 45,
      riskLevel: "MODERATE",
      alerts: [
        {
          title: "🌧️ Moderate Rainfall Expected",
          message: "Scattered showers throughout the day",
          description: "Light to moderate rainfall with occasional heavy bursts",
          severity: "MEDIUM",
          timestamp: "1 hour ago",
          impact: "Moderate",
          details: [
            "Rainfall prediction: 40-60mm in 24 hours",
            "No major flooding risk expected",
            "River levels within safe limits",
            "Schools and offices operating normally",
          ],
        },
      ],
      historicalDisasters: {},
      rescueTeams: 12,
      medicalUnits: 8,
      helplineNumbers: ["112", "1077"],
      sosAvailable: true,
      shelterCount: 1,
      shelters: [{ name: "Kottayam Community Hall", capacity: 100 }],
    },

    Alappuzha: {
      coordinates: { lat: 9.4981, lng: 76.3388 },
      riskScore: 55,
      riskLevel: "MODERATE",
      alerts: [
        {
          title: "🌊 Tidal Surge Alert",
          message: "Spring tide warning - coastal areas alert",
          description: "High tidal waves expected due to monsoon",
          severity: "MEDIUM",
          timestamp: "2 hours ago",
          impact: "Moderate",
          details: [
            "Tidal height: 1.8-2.2 meters expected",
            "Peak tide: 2 PM today",
            "Backwater areas may see temporary flooding",
            "Fishing operations suspended temporarily",
            "Coastal residents advised to stay vigilant",
          ],
        },
      ],
      historicalDisasters: {},
      rescueTeams: 14,
      medicalUnits: 10,
      helplineNumbers: ["112", "1077"],
      sosAvailable: true,
      shelterCount: 2,
      shelters: [
        { name: "Alappuzha High School", capacity: 80 },
        { name: "Coastal Shelter Center", capacity: 50 },
      ],
    },

    Kozhikode: {
      coordinates: { lat: 11.2588, lng: 75.7804 },
      riskScore: 35,
      riskLevel: "LOW",
      alerts: [],
      historicalDisasters: {},
      rescueTeams: 10,
      medicalUnits: 7,
      helplineNumbers: ["112", "1077"],
      sosAvailable: true,
      shelterCount: 1,
      shelters: [{ name: "Kozhikode Community Center", capacity: 60 }],
    },
  };

  // Return data if place exists
  if (placeDatabase[placeName]) {
    const data = placeDatabase[placeName];

    return {
      coordinates: data.coordinates,
      riskScore: data.riskScore,
      riskLevel: data.riskLevel,
      alerts: (data.alerts || []).map((alert) => ({
        title: alert.title || "Alert",
        message: alert.message || "",
        description: alert.description || alert.message,
        severity: alert.severity || "MEDIUM",
        timestamp: alert.timestamp || "Just now",
        impact: alert.impact || "Moderate",
        details: alert.details || [],
      })),
      historicalDisasters: data.historicalDisasters,
      resources: {
        rescueTeams: data.rescueTeams,
        medicalUnits: data.medicalUnits,
        helplines: data.helplineNumbers,
      },
      shelters: data.shelters.map((shelter) => ({
        name: shelter.name,
        capacity: parseInt(shelter.capacity) || 0,
      })),
    };
  }

  // Try case-insensitive match
  const key = Object.keys(placeDatabase).find(
    (k) => k.toLowerCase() === placeName.toLowerCase()
  );

  if (key) {
    const data = placeDatabase[key];
    return {
      coordinates: data.coordinates,
      riskScore: data.riskScore,
      riskLevel: data.riskLevel,
      alerts: (data.alerts || []).map((alert) => ({
        title: alert.title || "Alert",
        message: alert.message || "",
        description: alert.description || alert.message,
        severity: alert.severity || "MEDIUM",
        timestamp: alert.timestamp || "Just now",
        impact: alert.impact || "Moderate",
        details: alert.details || [],
      })),
      historicalDisasters: data.historicalDisasters,
      resources: {
        rescueTeams: data.rescueTeams,
        medicalUnits: data.medicalUnits,
        helplines: data.helplineNumbers,
      },
      shelters: data.shelters.map((shelter) => ({
        name: shelter.name,
        capacity: parseInt(shelter.capacity) || 0,
      })),
    };
  }

  return null;
};

/**
 * FUTURE API INTEGRATION TEMPLATE:
 * 
 * export const getPlaceData = async (place) => {
 *   try {
 *     const response = await fetch(`/api/places/${encodeURIComponent(place)}`);
 *     if (!response.ok) throw new Error('Place not found');
 *     return await response.json();
 *   } catch (error) {
 *     console.error('Failed to fetch place data:', error);
 *     return null;
 *   }
 * };
 */