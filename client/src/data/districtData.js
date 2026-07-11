// District data with disaster history
export const KERALA_DISTRICTS = [
  {
    name: 'Thiruvananthapuram',
    riskLevel: 'Low',
    color: '#4CAF50',
    coordinates: { lat: 8.7139, lng: 77.0580 },
    description: 'The capital district with backwater networks and coastal areas.',
    population: '3.3 million',
    area: '2,192 km²',
    headquarters: 'Thiruvananthapuram',
    emergencyContacts: {
      controlRoom: '0471-2525533',
      collector: '0471-2515600',
      police: '0471-2335000',
      fire: '0471-2333333'
    },
    shelters: [
      { name: 'Government Boys HSS', location: 'Kowdiar', capacity: 500, phone: '0471-2345678' },
      { name: 'Women\'s College', location: 'Vazhuthacaud', capacity: 300, phone: '0471-3456789' },
      { name: 'SMVNSS Ground', location: 'Pattom', capacity: 800, phone: '0471-4567890' }
    ],
    hospitals: [
      { name: 'Medical College Hospital', location: 'Thiruvananthapuram', phone: '0471-2525678' },
      { name: 'SAT Hospital', location: 'Thiruvananthapuram', phone: '0471-2528900' }
    ],
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
    population: '2.6 million',
    area: '2,491 km²',
    headquarters: 'Kollam',
    emergencyContacts: {
      controlRoom: '0474-2746400',
      collector: '0474-2742400',
      police: '0474-2740000',
      fire: '0474-2741111'
    },
    shelters: [
      { name: 'SN College', location: 'Kollam', capacity: 400, phone: '0474-2741234' },
      { name: 'Fathima Matha School', location: 'Sasthamcotta', capacity: 250, phone: '0474-2845678' },
      { name: 'Town Hall', location: 'Kollam', capacity: 600, phone: '0474-2748901' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Kollam', phone: '0474-2743456' },
      { name: 'TDM Hospital', location: 'Kollam', phone: '0474-2745678' }
    ],
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
    population: '1.2 million',
    area: '2,642 km²',
    headquarters: 'Pathanamthitta',
    emergencyContacts: {
      controlRoom: '0468-2222245',
      collector: '0468-2222400',
      police: '0468-2220000',
      fire: '0468-2221111'
    },
    shelters: [
      { name: 'Catholicate College', location: 'Pathanamthitta', capacity: 350, phone: '0468-2223456' },
      { name: 'Government HSS', location: 'Adoor', capacity: 280, phone: '0468-2345678' },
      { name: 'MGM School', location: 'Thiruvalla', capacity: 450, phone: '0469-2678901' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Pathanamthitta', phone: '0468-2223456' },
      { name: 'Believers Church Hospital', location: 'Thiruvalla', phone: '0469-2600000' }
    ],
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
    population: '2.1 million',
    area: '1,414 km²',
    headquarters: 'Alappuzha',
    emergencyContacts: {
      controlRoom: '0477-2252100',
      collector: '0477-2242400',
      police: '0477-2250000',
      fire: '0477-2251111'
    },
    shelters: [
      { name: 'SD College', location: 'Alappuzha', capacity: 500, phone: '0477-2251234' },
      { name: 'Government HSS', location: 'Cherthala', capacity: 400, phone: '0478-2345678' },
      { name: 'Municipal Office', location: 'Alappuzha', capacity: 600, phone: '0477-2256789' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Alappuzha', phone: '0477-2253456' },
      { name: 'Vandanam Hospital', location: 'Alappuzha', phone: '0477-2254567' }
    ],
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
    population: '1.9 million',
    area: '2,208 km²',
    headquarters: 'Kottayam',
    emergencyContacts: {
      controlRoom: '0481-2562100',
      collector: '0481-2562400',
      police: '0481-2560000',
      fire: '0481-2561111'
    },
    shelters: [
      { name: 'Bishop Moore College', location: 'Mavelikara', capacity: 350, phone: '0481-2561234' },
      { name: 'CMS College', location: 'Kottayam', capacity: 450, phone: '0481-2562345' },
      { name: 'Government HSS', location: 'Ettumanoor', capacity: 300, phone: '0481-2563456' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Kottayam', phone: '0481-2563456' },
      { name: 'Kottayam Medical College', location: 'Kottayam', phone: '0481-2564567' }
    ],
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
    population: '3.4 million',
    area: '3,068 km²',
    headquarters: 'Kakkanad',
    emergencyContacts: {
      controlRoom: '0484-2362100',
      collector: '0484-2362400',
      police: '0484-2360000',
      fire: '0484-2361111'
    },
    shelters: [
      { name: 'Government HSS', location: 'Ernakulam', capacity: 600, phone: '0484-2361234' },
      { name: 'Sacred Heart College', location: 'Thevara', capacity: 500, phone: '0484-2362345' },
      { name: 'Rajagiri School', location: 'Kalamassery', capacity: 450, phone: '0484-2363456' }
    ],
    hospitals: [
      { name: 'Medical College Hospital', location: 'Kalamassery', phone: '0484-2365678' },
      { name: 'General Hospital', location: 'Ernakulam', phone: '0484-2366789' }
    ],
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
    population: '1.1 million',
    area: '4,479 km²',
    headquarters: 'Kattappana',
    emergencyContacts: {
      controlRoom: '04862-232423',
      collector: '04862-2322400',
      police: '04862-2320000',
      fire: '04862-2321111'
    },
    shelters: [
      { name: 'Government HSS', location: 'Thodupuzha', capacity: 300, phone: '04862-221234' },
      { name: 'Newman College', location: 'Thodupuzha', capacity: 250, phone: '04862-221345' },
      { name: 'Community Hall', location: 'Kattappana', capacity: 400, phone: '04862-232456' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Kattappana', phone: '04862-2323456' },
      { name: 'Taluk Hospital', location: 'Thodupuzha', phone: '04862-2214567' }
    ],
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
    population: '3.1 million',
    area: '3,032 km²',
    headquarters: 'Thrissur',
    emergencyContacts: {
      controlRoom: '0487-2362100',
      collector: '0487-2362400',
      police: '0487-2360000',
      fire: '0487-2361111'
    },
    shelters: [
      { name: 'Sree Kerala Varma College', location: 'Thrissur', capacity: 500, phone: '0487-2361234' },
      { name: 'Government HSS', location: 'Guruvayur', capacity: 400, phone: '0487-2461234' },
      { name: 'St. Mary School', location: 'Thrissur', capacity: 350, phone: '0487-2362345' }
    ],
    hospitals: [
      { name: 'Medical College Hospital', location: 'Thrissur', phone: '0487-2365678' },
      { name: 'District Hospital', location: 'Thrissur', phone: '0487-2366789' }
    ],
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
    population: '2.9 million',
    area: '4,480 km²',
    headquarters: 'Palakkad',
    emergencyContacts: {
      controlRoom: '0491-2522100',
      collector: '0491-2522400',
      police: '0491-2520000',
      fire: '0491-2521111'
    },
    shelters: [
      { name: 'Government Victoria College', location: 'Palakkad', capacity: 450, phone: '0491-2521234' },
      { name: 'NSS College', location: 'Ottappalam', capacity: 350, phone: '0492-261234' },
      { name: 'Chembai Memorial', location: 'Palakkad', capacity: 500, phone: '0491-2522345' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Palakkad', phone: '0491-2523456' },
      { name: 'Medical College Hospital', location: 'Palakkad', phone: '0491-2524567' }
    ],
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
    population: '4.1 million',
    area: '3,554 km²',
    headquarters: 'Malappuram',
    emergencyContacts: {
      controlRoom: '0483-2742100',
      collector: '0483-2742400',
      police: '0483-2740000',
      fire: '0483-2741111'
    },
    shelters: [
      { name: 'Government College', location: 'Malappuram', capacity: 500, phone: '0483-2741234' },
      { name: 'Farook College', location: 'Kozhikode Road', capacity: 600, phone: '0483-2742345' },
      { name: 'Government HSS', location: 'Manjeri', capacity: 400, phone: '0483-2781234' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Malappuram', phone: '0483-2743456' },
      { name: 'Medical College Hospital', location: 'Manjeri', phone: '0483-2744567' }
    ],
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
    population: '3.2 million',
    area: '2,344 km²',
    headquarters: 'Kozhikode',
    emergencyContacts: {
      controlRoom: '0495-2372100',
      collector: '0495-2372400',
      police: '0495-2370000',
      fire: '0495-2371111'
    },
    shelters: [
      { name: 'Government Arts College', location: 'Kozhikode', capacity: 550, phone: '0495-2371234' },
      { name: 'Zamorins Guruvayurappan College', location: 'Kozhikode', capacity: 450, phone: '0495-2372345' },
      { name: 'Devagiri College', location: 'Kozhikode', capacity: 400, phone: '0495-2373456' }
    ],
    hospitals: [
      { name: 'Medical College Hospital', location: 'Kozhikode', phone: '0495-2375678' },
      { name: 'Beach Hospital', location: 'Kozhikode', phone: '0495-2376789' }
    ],
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
    population: '0.8 million',
    area: '2,131 km²',
    headquarters: 'Kalpetta',
    emergencyContacts: {
      controlRoom: '04936-202020',
      collector: '04936-2022400',
      police: '04936-2020000',
      fire: '04936-2021111'
    },
    shelters: [
      { name: 'Government College', location: 'Sultan Bathery', capacity: 300, phone: '04936-201234' },
      { name: 'WMO Arts College', location: 'Muttil', capacity: 250, phone: '04936-202345' },
      { name: 'Community Hall', location: 'Kalpetta', capacity: 350, phone: '04936-202456' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Kalpetta', phone: '04936-2023456' },
      { name: 'Taluk Hospital', location: 'Sultan Bathery', phone: '04936-2014567' }
    ],
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
    population: '2.6 million',
    area: '2,966 km²',
    headquarters: 'Kannur',
    emergencyContacts: {
      controlRoom: '0497-2702100',
      collector: '0497-2702400',
      police: '0497-2700000',
      fire: '0497-2701111'
    },
    shelters: [
      { name: 'Government College', location: 'Kannur', capacity: 450, phone: '0497-2701234' },
      { name: 'NITK Campus', location: 'Mangalore Road', capacity: 500, phone: '0497-2702345' },
      { name: 'Government HSS', location: 'Thalassery', capacity: 350, phone: '0490-2341234' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Kannur', phone: '0497-2703456' },
      { name: 'Medical College Hospital', location: 'Pariyaram', phone: '0497-2704567' }
    ],
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
    population: '1.3 million',
    area: '1,992 km²',
    headquarters: 'Kasaragod',
    emergencyContacts: {
      controlRoom: '0467-2322100',
      collector: '0467-2322400',
      police: '0467-2320000',
      fire: '0467-2321111'
    },
    shelters: [
      { name: 'Government College', location: 'Kasaragod', capacity: 400, phone: '04672-231234' },
      { name: 'Nehru Arts College', location: 'Kanhangad', capacity: 350, phone: '04678-221234' },
      { name: 'Community Hall', location: 'Kasaragod', capacity: 450, phone: '04672-231345' }
    ],
    hospitals: [
      { name: 'District Hospital', location: 'Kasaragod', phone: '04672-2313456' },
      { name: 'Taluk Hospital', location: 'Kanhangad', phone: '04678-2214567' }
    ],
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
