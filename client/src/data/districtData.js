// District data with disaster history
export const KERALA_DISTRICTS = [
  {
    name: 'Thiruvananthapuram',
    riskLevel: 'Low',
    color: '#4CAF50',
    coordinates: { lat: 8.7139, lng: 77.0580 },
    description: 'The capital district with backwater networks and coastal areas.',
    disasterHistory: [
      {
        date: '2019-06-20',
        type: 'Flood',
        severity: 'High',
        deaths: 12,
        displaced: 2500,
        description: 'Heavy monsoon flooding affected low-lying areas. Roads submerged, water supply disrupted.'
      },
      {
        date: '2018-08-16',
        type: 'Landslide',
        severity: 'Medium',
        deaths: 3,
        displaced: 150,
        description: 'Landslide in hilly regions near Ponmudi. One family killed.'
      },
      {
        date: '2017-07-10',
        type: 'Flash Flood',
        severity: 'High',
        deaths: 8,
        displaced: 3000,
        description: 'Heavy rainfall caused flash flooding in Neyyatinkkara region.'
      }
    ],
    currentAlerts: [
      { type: 'Rain Warning', severity: 'Medium', message: 'Heavy rainfall expected in next 24 hours' },
      { type: 'District Advisory', severity: 'Low', message: 'Regular monsoon conditions. Stay prepared.' }
    ]
  },
  {
    name: 'Kollam',
    riskLevel: 'Low',
    color: '#4CAF50',
    coordinates: { lat: 8.8932, lng: 76.5997 },
    description: 'Coastal district known for cashew and spice exports.',
    disasterHistory: [
      {
        date: '2020-09-12',
        type: 'Cyclone',
        severity: 'High',
        deaths: 15,
        displaced: 5000,
        description: 'Cyclone Nivar brought strong winds and heavy rain. Power outages widespread.'
      },
      {
        date: '2019-08-05',
        type: 'Flood',
        severity: 'Medium',
        deaths: 6,
        displaced: 1200,
        description: 'Backwater flooding affected Ashtamudi and surrounding areas.'
      }
    ],
    currentAlerts: [
      { type: 'Sea Alert', severity: 'Low', message: 'Rough sea conditions. Fishing operations advised to halt.' }
    ]
  },
  {
    name: 'Pathanamthitta',
    riskLevel: 'Low',
    color: '#4CAF50',
    coordinates: { lat: 9.2489, lng: 76.7294 },
    description: 'Hilly district in central Kerala, gateway to Western Ghats.',
    disasterHistory: [
      {
        date: '2018-08-20',
        type: 'Landslide',
        severity: 'High',
        deaths: 22,
        displaced: 800,
        description: 'Major landslides in Moolamattom region. Multiple casualties.'
      },
      {
        date: '2019-07-25',
        type: 'Flash Flood',
        severity: 'Medium',
        deaths: 5,
        displaced: 600,
        description: 'Flash flooding in hilly terrain near Ranni.'
      }
    ],
    currentAlerts: [
      { type: 'Landslide Warning', severity: 'Medium', message: 'Heavy rains may trigger landslides in hilly areas.' },
      { type: 'River Alert', severity: 'Medium', message: 'Pamba and Achankovil rivers at moderate levels.' }
    ]
  },
  {
    name: 'Alappuzha',
    riskLevel: 'Low',
    color: '#4CAF50',
    coordinates: { lat: 9.4981, lng: 76.3388 },
    description: 'Famous backwater district, agriculture-based economy.',
    disasterHistory: [
      {
        date: '2019-08-15',
        type: 'Flood',
        severity: 'High',
        deaths: 18,
        displaced: 8000,
        description: 'Severe backwater flooding. Multiple breaches in water management systems.'
      },
      {
        date: '2020-09-08',
        type: 'Flood',
        severity: 'Medium',
        deaths: 4,
        displaced: 2000,
        description: 'Heavy monsoon rains caused moderate flooding in backwater areas.'
      }
    ],
    currentAlerts: [
      { type: 'Water Level Alert', severity: 'Medium', message: 'Backwater levels rising. Monitor water systems.' }
    ]
  },
  {
    name: 'Kottayam',
    riskLevel: 'Low',
    color: '#4CAF50',
    coordinates: { lat: 9.5603, lng: 76.7171 },
    description: 'Spice-growing district with coconut and rubber plantations.',
    disasterHistory: [
      {
        date: '2018-08-14',
        type: 'Landslide',
        severity: 'Medium',
        deaths: 8,
        displaced: 400,
        description: 'Landslides in Poonjar and Ettumanoor areas.'
      },
      {
        date: '2019-07-20',
        type: 'Flood',
        severity: 'Medium',
        deaths: 3,
        displaced: 500,
        description: 'Moderate flooding in low-lying areas near Meenachil River.'
      }
    ],
    currentAlerts: [
      { type: 'General Advisory', severity: 'Low', message: 'Normal monsoon conditions. Standard precautions advised.' }
    ]
  },
  {
    name: 'Ernakulam',
    riskLevel: 'Moderate',
    color: '#FFC107',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    description: 'Commercial hub with major port and urban centers.',
    disasterHistory: [
      {
        date: '2019-08-18',
        type: 'Urban Flood',
        severity: 'High',
        deaths: 10,
        displaced: 4000,
        description: 'Heavy rainfall caused urban flooding. Drainage systems overwhelmed.'
      },
      {
        date: '2020-05-25',
        type: 'Storm',
        severity: 'Medium',
        deaths: 5,
        displaced: 1000,
        description: 'Severe thunderstorm with gusty winds. Power disruptions.'
      }
    ],
    currentAlerts: [
      { type: 'Urban Flood Warning', severity: 'High', message: 'Heavy rains expected. Urban areas at risk.' },
      { type: 'Traffic Alert', severity: 'Medium', message: 'Poor visibility in certain areas. Use caution.' }
    ]
  },
  {
    name: 'Idukki',
    riskLevel: 'High',
    color: '#F44336',
    coordinates: { lat: 10.1086, lng: 76.7083 },
    description: 'High-altitude hilly district, center of Kerala tourism.',
    disasterHistory: [
      {
        date: '2018-08-12',
        type: 'Landslide',
        severity: 'Critical',
        deaths: 45,
        displaced: 2000,
        description: 'Multiple major landslides across Idukki. Roads blocked, villages isolated.'
      },
      {
        date: '2019-07-28',
        type: 'Flash Flood',
        severity: 'High',
        deaths: 20,
        displaced: 1500,
        description: 'Flash flooding in narrow valleys. Dam spillways opened.'
      },
      {
        date: '2020-08-16',
        type: 'Landslide',
        severity: 'High',
        deaths: 30,
        displaced: 1800,
        description: 'Multiple landslides near Munnar region. Tourism severely affected.'
      }
    ],
    currentAlerts: [
      { type: 'Landslide Warning', severity: 'Critical', message: 'HIGH RISK: Heavy rains trigger frequent landslides.' },
      { type: 'Dam Alert', severity: 'High', message: 'Dams approaching capacity. Spillway operations ongoing.' },
      { type: 'Road Advisory', severity: 'High', message: 'Key mountain roads at high risk. Check advisories before travel.' }
    ]
  },
  {
    name: 'Thrissur',
    riskLevel: 'Moderate',
    color: '#FFC107',
    coordinates: { lat: 10.5269, lng: 76.2144 },
    description: 'Cultural center with temples and agricultural areas.',
    disasterHistory: [
      {
        date: '2019-08-10',
        type: 'Flood',
        severity: 'Medium',
        deaths: 6,
        displaced: 2000,
        description: 'Moderate flooding in agricultural regions near Nila River.'
      },
      {
        date: '2020-06-15',
        type: 'Storm',
        severity: 'Medium',
        deaths: 4,
        displaced: 600,
        description: 'Heavy storms caused crop damage and infrastructure loss.'
      }
    ],
    currentAlerts: [
      { type: 'River Alert', severity: 'Medium', message: 'Nila River water levels rising. Monitor situation.' }
    ]
  },
  {
    name: 'Palakkad',
    riskLevel: 'Low',
    color: '#4CAF50',
    coordinates: { lat: 10.7867, lng: 76.6550 },
    description: 'Gateway to Tamil Nadu with coconut, spice, and cardamom.',
    disasterHistory: [
      {
        date: '2019-07-15',
        type: 'Flood',
        severity: 'Medium',
        deaths: 5,
        displaced: 1500,
        description: 'Moderate flooding along Bharatapuzha River.'
      },
      {
        date: '2018-09-20',
        type: 'Landslide',
        severity: 'Low',
        deaths: 1,
        displaced: 50,
        description: 'Small landslide in hilly region near Nelliampathy.'
      }
    ],
    currentAlerts: [
      { type: 'General Advisory', severity: 'Low', message: 'Normal conditions. Routine monitoring in place.' }
    ]
  },
  {
    name: 'Malappuram',
    riskLevel: 'Moderate',
    color: '#FFC107',
    coordinates: { lat: 11.0515, lng: 76.0678 },
    description: 'Banana-growing region with dense population.',
    disasterHistory: [
      {
        date: '2019-07-30',
        type: 'Flash Flood',
        severity: 'High',
        deaths: 14,
        displaced: 3500,
        description: 'Flash flooding in stream valleys. Banana plantations affected.'
      },
      {
        date: '2020-08-20',
        type: 'Landslide',
        severity: 'Medium',
        deaths: 8,
        displaced: 600,
        description: 'Landslides in hilly areas near Nilambur.'
      }
    ],
    currentAlerts: [
      { type: 'Flood Warning', severity: 'High', message: 'Multiple streams at high levels. Potential flash floods.' }
    ]
  },
  {
    name: 'Kozhikode',
    riskLevel: 'Moderate',
    color: '#FFC107',
    coordinates: { lat: 11.2588, lng: 75.7804 },
    description: 'Commercial port city and beach tourism destination.',
    disasterHistory: [
      {
        date: '2019-08-08',
        type: 'Cyclone',
        severity: 'High',
        deaths: 12,
        displaced: 2500,
        description: 'Strong cyclonic wind and coastal flooding. Ships damaged.'
      },
      {
        date: '2020-09-10',
        type: 'Flood',
        severity: 'Medium',
        deaths: 5,
        displaced: 1000,
        description: 'Heavy monsoon rains caused urban and coastal flooding.'
      }
    ],
    currentAlerts: [
      { type: 'Sea Alert', severity: 'Medium', message: 'Rough sea conditions. Fishing operations halted.' }
    ]
  },
  {
    name: 'Wayanad',
    riskLevel: 'High',
    color: '#F44336',
    coordinates: { lat: 11.6000, lng: 76.1300 },
    description: 'High-altitude district in Northern Kerala, tourism hub.',
    disasterHistory: [
      {
        date: '2018-07-20',
        type: 'Landslide',
        severity: 'Critical',
        deaths: 50,
        displaced: 3000,
        description: 'Massive landslides near Meppadi. Entire villages buried. Worst disaster in Wayanad.'
      },
      {
        date: '2019-08-05',
        type: 'Landslide',
        severity: 'High',
        deaths: 25,
        displaced: 1500,
        description: 'Multiple landslides across district. Roads blocked for weeks.'
      },
      {
        date: '2020-08-08',
        type: 'Landslide',
        severity: 'High',
        deaths: 18,
        displaced: 1200,
        description: 'Recurring landslides in monsoon season. Relocation of settlements ongoing.'
      }
    ],
    currentAlerts: [
      { type: 'Landslide Alert', severity: 'Critical', message: 'CRITICAL RISK: Frequent landslides in hilly terrain.' },
      { type: 'Road Closure', severity: 'High', message: 'Multiple roads closed due to landslide risk.' },
      { type: 'Evacuation Advisory', severity: 'High', message: 'High-risk zones under evacuation advisory.' }
    ]
  },
  {
    name: 'Kannur',
    riskLevel: 'Low',
    color: '#4CAF50',
    coordinates: { lat: 11.8745, lng: 75.3704 },
    description: 'Northern coastal district with spice production.',
    disasterHistory: [
      {
        date: '2019-08-02',
        type: 'Cyclone',
        severity: 'Medium',
        deaths: 8,
        displaced: 1500,
        description: 'Cyclonic wind and coastal flooding. Fishing fleet damaged.'
      },
      {
        date: '2020-06-10',
        type: 'Storm',
        severity: 'Low',
        deaths: 2,
        displaced: 200,
        description: 'Heavy storm with minor flooding in low-lying areas.'
      }
    ],
    currentAlerts: [
      { type: 'General Advisory', severity: 'Low', message: 'Normal sea conditions. Standard warnings in place.' }
    ]
  },
  {
    name: 'Kasaragod',
    riskLevel: 'Low',
    color: '#4CAF50',
    coordinates: { lat: 12.4950, lng: 75.5318 },
    description: 'Northernmost district of Kerala on Arabian Sea coast.',
    disasterHistory: [
      {
        date: '2019-08-01',
        type: 'Cyclone',
        severity: 'Medium',
        deaths: 7,
        displaced: 1200,
        description: 'Coastal cyclone impact. Storm surge and flooding in coastal areas.'
      },
      {
        date: '2018-08-10',
        type: 'Flood',
        severity: 'Low',
        deaths: 1,
        displaced: 100,
        description: 'Minor flooding in agricultural low-lying areas.'
      }
    ],
    currentAlerts: [
      { type: 'Maritime Alert', severity: 'Low', message: 'Normal maritime conditions. Routine precautions advised.' }
    ]
  }
];

export const getDistrictByName = (name) => {
  return KERALA_DISTRICTS.find(d => d.name.toLowerCase() === name.toLowerCase());
};

export const getAllDistrictNames = () => {
  return KERALA_DISTRICTS.map(d => d.name);
};
