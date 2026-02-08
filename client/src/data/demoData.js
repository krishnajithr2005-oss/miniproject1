export const demoData = {
  Meenachil: {
    lat: 9.705,
    lng: 76.704,
    terrainType: "riverine",

    hazards: {
      flood: {
        riskScore: 78,
        severity: "HIGH",
        reason: "Heavy rainfall + river overflow"
      }
    },

    shelters: [
      { name: "Govt School", capacity: "70% Full" },
      { name: "Community Hall", capacity: "40% Full" }
    ],

    rescue: ["Water Rescue", "Medical Team"]
  },

  Wayanad: {
    lat: 11.685,
    lng: 76.132,
    terrainType: "hilly",

    hazards: {
      landslide: {
        riskScore: 85,
        severity: "VERY HIGH",
        reason: "Steep slopes + continuous rainfall"
      },
      flood: {
        riskScore: 30,
        severity: "LOW",
        reason: "Limited river spread"
      }
    },

    shelters: [
      { name: "Model School", capacity: "90% Full" }
    ],

    rescue: ["NDRF", "KSDMA"]
  }
};
