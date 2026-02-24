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
      helplineNumbers: ["112", "1077", "8078518247"],
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
      helplineNumbers: ["112", "1077", "8078518247"],
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
      helplineNumbers: ["112", "1077", "8078518247"],
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
      helplineNumbers: ["112", "1077", "8078518247"],
      sosAvailable: true,
      shelterCount: 1,
      shelters: [{ name: "Kozhikode Community Center", capacity: 60 }],
    },

    // LANDSLIDE PRONE AREAS
    Peringamala: {
      coordinates: { lat: 8.7292, lng: 77.0464 },
      riskScore: 80,
      riskLevel: "HIGH",
      alerts: [
        {
          title: "🏔️ High Probability of Landslides in Elevated Areas",
          message: "Landslide risk alert for hilly terrain",
          description: "Critical landslide warning issued for elevated areas",
          severity: "HIGH",
          timestamp: "2 hours ago",
          impact: "Severe",
          details: [
            "Heavy rainfall expected in next 24 hours",
            "Soil saturation levels at 82%",
            "Vulnerable slopes identified in 8 locations",
            "Evacuation routes have been prepared",
            "Rescue teams on standby at 3 locations",
            "Geological survey shows unstable soil layers",
          ],
        },
      ],
      historicalDisasters: {
        "2018 Landslides": "Multiple incidents reported",
        "2016 Landslides": "2 fatalities",
      },
      rescueTeams: 12,
      medicalUnits: 6,
      helplineNumbers: ["112", "1077", "8078518247"],
      sosAvailable: true,
      shelterCount: 2,
      shelters: [
        { name: "Peringamala Primary School Shelter", capacity: 50, coordinates: { lat: 8.7322, lng: 77.0484 } },
        { name: "Community Hall Relief Center", capacity: 40, coordinates: { lat: 8.7262, lng: 77.0444 } },
      ],
    },

    Amboori: {
      coordinates: { lat: 8.5078, lng: 77.1890 },
      riskScore: 78,
      riskLevel: "HIGH",
      alerts: [
        {
          title: "🏔️ High Probability of Landslides in Elevated Areas",
          message: "Landslide risk alert for hilly terrain",
          description: "Critical landslide warning issued for elevated areas",
          severity: "HIGH",
          timestamp: "1.5 hours ago",
          impact: "Severe",
          details: [
            "Heavy rainfall expected in next 24 hours",
            "Soil saturation levels at 80%",
            "Vulnerable slopes identified in 6 locations",
            "Rock fall potential in upper regions",
            "Debris flow channels activated",
            "Early warning system triggered",
          ],
        },
      ],
      historicalDisasters: {
        "2019 Landslides": "Multiple affected areas",
        "2015 Geo-hazard": "Survey completed",
      },
      rescueTeams: 10,
      medicalUnits: 5,
      helplineNumbers: ["112", "1077", "8078518247"],
      sosAvailable: true,
      shelterCount: 1,
      shelters: [{ name: "Amboori Government School Shelter", capacity: 60, coordinates: { lat: 8.5108, lng: 77.1910 } }],
    },

    Vellarada: {
      coordinates: { lat: 8.445238, lng: 77.194617 },
      riskScore: 75,
      riskLevel: "HIGH",
      alerts: [
        {
          title: "🏔️ High Probability of Landslides in Elevated Areas",
          message: "Landslide risk alert for hilly terrain",
          description: "Critical landslide warning issued for elevated areas",
          severity: "HIGH",
          timestamp: "3 hours ago",
          impact: "Severe",
          details: [
            "Heavy rainfall expected in next 48 hours",
            "Soil saturation levels at 78%",
            "Vulnerable slopes identified in 5 locations",
            "Steep gradient zones pose high risk",
            "Vegetation loss increases susceptibility",
            "Geological mapping completed",
          ],
        },
      ],
      historicalDisasters: {
        "2018 Landslides": "1 fatality reported",
        "2014 Landslides": "Multiple incidents",
      },
      rescueTeams: 9,
      medicalUnits: 5,
      helplineNumbers: ["112", "1077", "8078518247"],
      sosAvailable: true,
      shelterCount: 1,
      shelters: [{ name: "Vellarada Community School Shelter", capacity: 55, coordinates: { lat: 8.5486, lng: 76.8809 } }],
    },

    // FLOOD PRONE AREAS
    Thampanoor: {
      coordinates: { lat: 8.4880, lng: 76.9510 },
      riskScore: 70,
      riskLevel: "HIGH",
      alerts: [
        {
          title: "💧 Water Levels Approaching Critical Capacity",
          message: "Flood risk alert for low-lying areas",
          description: "Water levels rising rapidly in river valleys",
          severity: "HIGH",
          timestamp: "1 hour ago",
          impact: "Severe",
          details: [
            "River water level rising at 3cm per hour",
            "Flood-prone zones: Valley areas, agricultural lands",
            "Early warning system activated",
            "Mobile alert sent to 8,000+ residents",
            "Sandbags distributed to vulnerable areas",
            "Evacuation preparedness announced",
          ],
        },
      ],
      historicalDisasters: {
        "2018 Floods": "450+ affected",
        "2013 Flash Floods": "75 missing",
      },
      rescueTeams: 15,
      medicalUnits: 8,
      helplineNumbers: ["112", "1077", "8078518247"],
      sosAvailable: true,
      shelterCount: 2,
      shelters: [
        { name: "Thampanoor High School Shelter", capacity: 80, coordinates: { lat: 8.4880, lng: 76.9510 } },
        { name: "Government Relief Center", capacity: 70, coordinates: { lat: 8.4850, lng: 76.9500 } },
      ],
    },

    Pattom: {
      coordinates: { lat: 8.5207, lng: 76.9423 },
      riskScore: 72,
      riskLevel: "HIGH",
      alerts: [
        {
          title: "💧 Water Levels Approaching Critical Capacity",
          message: "Flood risk alert for low-lying areas",
          description: "Water levels approaching spillway capacity",
          severity: "HIGH",
          timestamp: "45 minutes ago",
          impact: "Severe",
          details: [
            "Current water level: 85% of maximum capacity",
            "Release gates may need to open soon",
            "Downstream areas should remain alert",
            "Continuous monitoring in progress",
            "Alert level increased from MEDIUM to HIGH",
            "Flood defenses strengthened",
          ],
        },
      ],
      historicalDisasters: {
        "2019 Floods": "Significant impact",
        "2015 Flash Floods": "150 evacuated",
      },
      rescueTeams: 14,
      medicalUnits: 7,
      helplineNumbers: ["112", "1077", "8078518247"],
      sosAvailable: true,
      shelterCount: 2,
      shelters: [
        { name: "Pattom Community School", capacity: 75, coordinates: { lat: 8.5227, lng: 76.9443 } },
        { name: "Emergency Relief Camp", capacity: 65, coordinates: { lat: 8.5187, lng: 76.9403 } },
      ],
    },

    Murinjapalam: {
      coordinates: { lat: 8.5166, lng: 76.9317 },
      riskScore: 68,
      riskLevel: "MODERATE",
      alerts: [
        {
          title: "💧 Water Levels Approaching Critical Capacity",
          message: "Flood risk alert for low-lying areas",
          description: "Flash flood warning for river valleys and low-lying zones",
          severity: "MEDIUM",
          timestamp: "2 hours ago",
          impact: "Moderate",
          details: [
            "River water level rising at 2cm per hour",
            "Flood-prone zones: Valley areas, agricultural lands",
            "Early warning system activated",
            "Mobile alert sent to 5,000+ residents",
            "Evacuation routes prepared",
            "Normal precautions recommended",
          ],
        },
      ],
      historicalDisasters: {
        "2018 Floods": "200+ affected",
        "2014 Flash Floods": "50 evacuated",
      },
      rescueTeams: 11,
      medicalUnits: 6,
      helplineNumbers: ["112", "1077", "8078518247"],
      sosAvailable: true,
      shelterCount: 1,
      shelters: [{ name: "Murinjapalam School Shelter", capacity: 70, coordinates: { lat: 8.5186, lng: 76.9347 } }],
    },

    // CYCLONE PRONE AREAS
    Shangumugham: {
      coordinates: { lat: 8.4827, lng: 76.9113 },
      riskScore: 65,
      riskLevel: "MODERATE",
      alerts: [
        {
          title: "🌪️ Cyclone Alert - Coastal Areas at Risk",
          message: "High probability of cyclonic disturbance",
          description: "Cyclone warning issued for coastal and elevated areas",
          severity: "MEDIUM",
          timestamp: "30 minutes ago",
          impact: "Moderate",
          details: [
            "Wind speed: 40-50 km/h expected",
            "Storm surge prediction: 1.5-2 meters",
            "Coastal vulnerability high",
            "Fishing operations suspended",
            "Ports and harbors under alert",
            "Emergency services mobilized",
          ],
        },
      ],
      historicalDisasters: {
        "2018 Cyclones": "Multiple impacts",
        "2016 Cyclone": "Widespread damage",
      },
      rescueTeams: 13,
      medicalUnits: 7,
      helplineNumbers: ["112", "1077", "8078518247"],
      sosAvailable: true,
      shelterCount: 2,
      shelters: [
        { name: "Shangumugham Community Hall", capacity: 85, coordinates: { lat: 8.4857, lng: 76.9133 } },
        { name: "Coastal Refugee Center", capacity: 75, coordinates: { lat: 8.4797, lng: 76.9093 } },
      ],
    },

    Varkala: {
      coordinates: { lat: 8.7379, lng: 76.7163 },
      riskScore: 50,
      riskLevel: "MODERATE",
      alerts: [
        {
          title: "🌊 Coastal Surge Advisory",
          message: "High tide and strong waves expected along the coast",
          description: "Coastal surge advisory for Varkala beach areas",
          severity: "MEDIUM",
          timestamp: "2 hours ago",
          impact: "Moderate",
          details: [
            "High tide expected during evening hours",
            "Beach erosion risk in exposed sections",
            "Small craft advised to remain in harbor",
          ],
        },
      ],
      historicalDisasters: {},
      rescueTeams: 8,
      medicalUnits: 4,
      helplineNumbers: ["112", "1077"],
      sosAvailable: true,
      shelterCount: 1,
      shelters: [{ name: "Varkala Community Center Shelter", capacity: 60 }],
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