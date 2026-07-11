import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserApi from '../services/api/userApi';
import { useAuth } from '../context/AuthContext';
import DashboardMap from '../components/DashboardMap';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activePanel, setActivePanel] = useState('home');
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const [showSOS, setShowSOS] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [alertFilter, setAlertFilter] = useState('all');
  
  // Dynamic data states
  const [alerts, setAlerts] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [places, setPlaces] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [showFloodZones, setShowFloodZones] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showSOSPoints, setShowSOSPoints] = useState(false);
  const [showWeather, setShowWeather] = useState(true);
  const [showDams, setShowDams] = useState(false);
  const [loading, setLoading] = useState(false); // Never show loading screen
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [districtData, setDistrictData] = useState(null);
  const [districtLoading, setDistrictLoading] = useState(false);

  // Weather search functionality
  const [weatherSearchQuery, setWeatherSearchQuery] = useState('');
  const [selectedWeatherDistrict, setSelectedWeatherDistrict] = useState(null);
  const [showWeatherSearchResults, setShowWeatherSearchResults] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  // Shelter search state
  const [shelterSearchQuery, setShelterSearchQuery] = useState('');
  const [showShelterSearchResults, setShowShelterSearchResults] = useState(false);
  const [selectedShelterDistrict, setSelectedShelterDistrict] = useState(null);
  const [shelterLoading, setShelterLoading] = useState(false);
  const [shelterData, setShelterData] = useState(null);

  // Real weather state
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherFetching, setWeatherFetching] = useState(false);

  // 14 Kerala districts with detailed information
  const keralaDistricts = [
    {
      name: 'Thiruvananthapuram',
      shortName: 'TVM',
      population: '3.3 million',
      area: '2,192 km²',
      headquarters: 'Thiruvananthapuram',
      riskLevel: 'moderate',
      coordinates: { lat: 8.5241, lng: 76.9366 },
      description: 'Capital city of Kerala, known for its beaches and historical sites',
      majorRisks: ['Coastal Erosion', 'Urban Flooding', 'Heat Waves'],
      emergencyContacts: { controlRoom: '0471-2525533', collector: '0471-2515600' },
      shelters: 12,
      hospitals: 8,
      schools: 45
    },
    {
      name: 'Kollam',
      shortName: 'KLM',
      population: '2.6 million',
      area: '2,491 km²',
      headquarters: 'Kollam',
      riskLevel: 'moderate',
      coordinates: { lat: 8.8932, lng: 76.6082 },
      description: 'Known for cashew industry and historical significance',
      majorRisks: ['Coastal Flooding', 'Industrial Accidents', 'Landslides'],
      emergencyContacts: { controlRoom: '0474-2746400', collector: '0474-2742400' },
      shelters: 10,
      hospitals: 6,
      schools: 38
    },
    {
      name: 'Pathanamthitta',
      shortName: 'PTA',
      population: '1.2 million',
      area: '2,642 km²',
      headquarters: 'Pathanamthitta',
      riskLevel: 'high',
      coordinates: { lat: 9.4333, lng: 76.7833 },
      description: 'Pilgrimage center with Sabarimala temple',
      majorRisks: ['Landslides', 'Flash Floods', 'Crowd Management'],
      emergencyContacts: { controlRoom: '0468-2222245', collector: '0468-2222400' },
      shelters: 8,
      hospitals: 4,
      schools: 25
    },
    {
      name: 'Alappuzha',
      shortName: 'ALP',
      population: '2.1 million',
      area: '1,414 km²',
      headquarters: 'Alappuzha',
      riskLevel: 'high',
      coordinates: { lat: 9.4981, lng: 76.3380 },
      description: 'Known as the Venice of the East with backwaters',
      majorRisks: ['Backwater Flooding', 'Coastal Storms', 'Waterborne Diseases'],
      emergencyContacts: { controlRoom: '0477-2252100', collector: '0477-2242400' },
      shelters: 15,
      hospitals: 7,
      schools: 42
    },
    {
      name: 'Kottayam',
      shortName: 'KTM',
      population: '1.9 million',
      area: '2,208 km²',
      headquarters: 'Kottayam',
      riskLevel: 'moderate',
      coordinates: { lat: 9.5914, lng: 76.5216 },
      description: 'Land of letters and latex',
      majorRisks: ['River Flooding', 'Landslides', 'Urban Flooding'],
      emergencyContacts: { controlRoom: '0481-2562100', collector: '0481-2562400' },
      shelters: 11,
      hospitals: 6,
      schools: 35
    },
    {
      name: 'Idukki',
      shortName: 'IDK',
      population: '1.1 million',
      area: '4,479 km²',
      headquarters: 'Kattappana',
      riskLevel: 'high',
      coordinates: { lat: 9.8467, lng: 76.9723 },
      description: 'Mountainous region with tea plantations and wildlife',
      majorRisks: ['Landslides', 'Heavy Rainfall', 'Wild Animal Conflicts'],
      emergencyContacts: { controlRoom: '04862-232423', collector: '04862-2322400' },
      shelters: 9,
      hospitals: 3,
      schools: 28
    },
    {
      name: 'Ernakulam',
      shortName: 'EKM',
      population: '3.4 million',
      area: '3,068 km²',
      headquarters: 'Kakkanad',
      riskLevel: 'moderate',
      coordinates: { lat: 10.0265, lng: 76.3125 },
      description: 'Commercial capital with major port and IT hub',
      majorRisks: ['Urban Flooding', 'Coastal Erosion', 'Traffic Disruptions'],
      emergencyContacts: { controlRoom: '0484-2362100', collector: '0484-2362400' },
      shelters: 18,
      hospitals: 12,
      schools: 52
    },
    {
      name: 'Thrissur',
      shortName: 'TSR',
      population: '3.1 million',
      area: '3,032 km²',
      headquarters: 'Thrissur',
      riskLevel: 'moderate',
      coordinates: { lat: 10.5204, lng: 76.2144 },
      description: 'Cultural capital of Kerala',
      majorRisks: ['River Flooding', 'Urban Flooding', 'Fire Accidents'],
      emergencyContacts: { controlRoom: '0487-2362100', collector: '0487-2362400' },
      shelters: 14,
      hospitals: 9,
      schools: 48
    },
    {
      name: 'Palakkad',
      shortName: 'PKD',
      population: '2.9 million',
      area: '4,480 km²',
      headquarters: 'Palakkad',
      riskLevel: 'moderate',
      coordinates: { lat: 10.7867, lng: 76.6548 },
      description: 'Gateway of Kerala with Palghat Gap',
      majorRisks: ['Wild Fires', 'Drought', 'Wind Storms'],
      emergencyContacts: { controlRoom: '0491-2522100', collector: '0491-2522400' },
      shelters: 13,
      hospitals: 7,
      schools: 41
    },
    {
      name: 'Malappuram',
      shortName: 'MLP',
      population: '4.1 million',
      area: '3,554 km²',
      headquarters: 'Malappuram',
      riskLevel: 'high',
      coordinates: { lat: 11.0728, lng: 76.0770 },
      description: 'Most populous district with rich cultural heritage',
      majorRisks: ['River Flooding', 'Coastal Flooding', 'Landslides'],
      emergencyContacts: { controlRoom: '0483-2742100', collector: '0483-2742400' },
      shelters: 16,
      hospitals: 8,
      schools: 55
    },
    {
      name: 'Kozhikode',
      shortName: 'KKD',
      population: '3.2 million',
      area: '2,344 km²',
      headquarters: 'Kozhikode',
      riskLevel: 'high',
      coordinates: { lat: 11.2588, lng: 75.7804 },
      description: 'Historical city known for spice trade',
      majorRisks: ['Coastal Storms', 'Urban Flooding', 'Fisheries Accidents'],
      emergencyContacts: { controlRoom: '0495-2372100', collector: '0495-2372400' },
      shelters: 14,
      hospitals: 9,
      schools: 46
    },
    {
      name: 'Wayanad',
      shortName: 'WYD',
      population: '0.8 million',
      area: '2,131 km²',
      headquarters: 'Kalpetta',
      riskLevel: 'high',
      coordinates: { lat: 11.6067, lng: 76.0833 },
      description: 'Hill station with tea and coffee plantations',
      majorRisks: ['Landslides', 'Wild Animal Conflicts', 'Isolation Issues'],
      emergencyContacts: { controlRoom: '04936-202020', collector: '04936-2022400' },
      shelters: 7,
      hospitals: 3,
      schools: 22
    },
    {
      name: 'Kannur',
      shortName: 'KNR',
      population: '2.6 million',
      area: '2,966 km²',
      headquarters: 'Kannur',
      riskLevel: 'moderate',
      coordinates: { lat: 11.8745, lng: 75.3704 },
      description: 'Known for folklore and traditional arts',
      majorRisks: ['Coastal Erosion', 'Monsoon Flooding', 'Industrial Accidents'],
      emergencyContacts: { controlRoom: '0497-2702100', collector: '0497-2702400' },
      shelters: 12,
      hospitals: 6,
      schools: 39
    },
    {
      name: 'Kasargod',
      shortName: 'KSD',
      population: '1.3 million',
      area: '1,992 km²',
      headquarters: 'Kasargod',
      riskLevel: 'moderate',
      coordinates: { lat: 12.4997, lng: 74.8490 },
      description: 'Northernmost district with cultural diversity',
      majorRisks: ['Coastal Flooding', 'River Flooding', 'Cross-Border Issues'],
      emergencyContacts: { controlRoom: '0467-2322100', collector: '0467-2322400' },
      shelters: 9,
      hospitals: 4,
      schools: 26
    }
  ];

  // Demo data
  // Demo shelter data for all Kerala districts
  const keralaShelterData = {
    'Thiruvananthapuram': {
      shelters: [
        { name: 'Government Boys HSS', location: 'Kowdiar', capacity: 500, currentOccupancy: 125, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Ramesh Nair', phone: '0471-2345678', distance: '2.1 km' },
        { name: 'Women\'s College', location: 'Vazhuthacaud', capacity: 300, currentOccupancy: 89, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Lakshmi Devi', phone: '0471-3456789', distance: '3.5 km' },
        { name: 'SMVNSS Ground', location: 'Pattom', capacity: 800, currentOccupancy: 234, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Suresh Kumar', phone: '0471-4567890', distance: '1.8 km' }
      ],
      totalCapacity: 1600,
      totalOccupancy: 448,
      emergencyShelters: 12
    },
    'Kollam': {
      shelters: [
        { name: 'SN College', location: 'Kollam', capacity: 400, currentOccupancy: 156, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Mohan Pillai', phone: '0474-2741234', distance: '1.2 km' },
        { name: 'Fathima Matha School', location: 'Sasthamcotta', capacity: 250, currentOccupancy: 78, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Amina Beevi', phone: '0474-2845678', distance: '4.8 km' },
        { name: 'Town Hall', location: 'Kollam', capacity: 600, currentOccupancy: 189, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Ravi Kumar', phone: '0474-2748901', distance: '0.5 km' }
      ],
      totalCapacity: 1250,
      totalOccupancy: 423,
      emergencyShelters: 10
    },
    'Pathanamthitta': {
      shelters: [
        { name: 'Catholicate College', location: 'Pathanamthitta', capacity: 350, currentOccupancy: 98, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Fr. Thomas', phone: '0468-2223456', distance: '2.3 km' },
        { name: 'Government HSS', location: 'Adoor', capacity: 280, currentOccupancy: 67, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Radhakrishnan', phone: '0468-2345678', distance: '5.1 km' },
        { name: 'MGM School', location: 'Thiruvalla', capacity: 450, currentOccupancy: 123, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Susan Mathew', phone: '0469-2678901', distance: '3.7 km' }
      ],
      totalCapacity: 1080,
      totalOccupancy: 288,
      emergencyShelters: 8
    },
    'Alappuzha': {
      shelters: [
        { name: 'SD College', location: 'Alappuzha', capacity: 500, currentOccupancy: 167, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Venugopal', phone: '0477-2251234', distance: '1.5 km' },
        { name: 'Government HSS', location: 'Cherthala', capacity: 400, currentOccupancy: 134, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Leela Kumari', phone: '0478-2345678', distance: '6.2 km' },
        { name: 'Municipal Office', location: 'Alappuzha', capacity: 600, currentOccupancy: 201, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Hari Prasad', phone: '0477-2256789', distance: '0.8 km' }
      ],
      totalCapacity: 1500,
      totalOccupancy: 502,
      emergencyShelters: 15
    },
    'Kottayam': {
      shelters: [
        { name: 'Bishop Moore College', location: 'Mavelikara', capacity: 350, currentOccupancy: 89, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Dr. Samuel', phone: '0481-2561234', distance: '3.1 km' },
        { name: 'CMS College', location: 'Kottayam', capacity: 450, currentOccupancy: 145, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Mary John', phone: '0481-2562345', distance: '1.2 km' },
        { name: 'Government HSS', location: 'Ettumanoor', capacity: 300, currentOccupancy: 78, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Narayanan', phone: '0481-2563456', distance: '4.5 km' }
      ],
      totalCapacity: 1100,
      totalOccupancy: 312,
      emergencyShelters: 11
    },
    'Idukki': {
      shelters: [
        { name: 'Government HSS', location: 'Thodupuzha', capacity: 300, currentOccupancy: 67, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Rajan K', phone: '04862-221234', distance: '2.8 km' },
        { name: 'Newman College', location: 'Thodupuzha', capacity: 250, currentOccupancy: 45, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Sr. Mary', phone: '04862-221345', distance: '3.2 km' },
        { name: 'Community Hall', location: 'Kattappana', capacity: 400, currentOccupancy: 123, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Jose Thomas', phone: '04862-232456', distance: '5.6 km' }
      ],
      totalCapacity: 950,
      totalOccupancy: 235,
      emergencyShelters: 9
    },
    'Ernakulam': {
      shelters: [
        { name: 'Government HSS', location: 'Ernakulam', capacity: 600, currentOccupancy: 234, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Anil Kumar', phone: '0484-2361234', distance: '1.1 km' },
        { name: 'Sacred Heart College', location: 'Thevara', capacity: 500, currentOccupancy: 189, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Fr. Davis', phone: '0484-2362345', distance: '2.4 km' },
        { name: 'Rajagiri School', location: 'Kalamassery', capacity: 450, currentOccupancy: 156, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Sr. Rosy', phone: '0484-2363456', distance: '3.7 km' }
      ],
      totalCapacity: 1550,
      totalOccupancy: 579,
      emergencyShelters: 18
    },
    'Thrissur': {
      shelters: [
        { name: 'Sree Kerala Varma College', location: 'Thrissur', capacity: 500, currentOccupancy: 178, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Prof. Nair', phone: '0487-2361234', distance: '1.3 km' },
        { name: 'Government HSS', location: 'Guruvayur', capacity: 400, currentOccupancy: 134, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Krishnan', phone: '0487-2461234', distance: '4.8 km' },
        { name: 'St. Mary\'s School', location: 'Thrissur', capacity: 350, currentOccupancy: 98, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Sr. Teresa', phone: '0487-2362345', distance: '2.1 km' }
      ],
      totalCapacity: 1250,
      totalOccupancy: 410,
      emergencyShelters: 14
    },
    'Palakkad': {
      shelters: [
        { name: 'Government Victoria College', location: 'Palakkad', capacity: 450, currentOccupancy: 145, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Dr. Ramesh', phone: '0491-2521234', distance: '1.6 km' },
        { name: 'NSS College', location: 'Ottappalam', capacity: 350, currentOccupancy: 89, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Gopalakrishnan', phone: '0492-261234', distance: '5.2 km' },
        { name: 'Chembai Memorial', location: 'Palakkad', capacity: 500, currentOccupancy: 167, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Mohan', phone: '0491-2522345', distance: '0.9 km' }
      ],
      totalCapacity: 1300,
      totalOccupancy: 401,
      emergencyShelters: 13
    },
    'Malappuram': {
      shelters: [
        { name: 'Government College', location: 'Malappuram', capacity: 500, currentOccupancy: 189, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Prof. Ali', phone: '0483-2741234', distance: '1.4 km' },
        { name: 'Farook College', location: 'Kozhikode Road', capacity: 600, currentOccupancy: 234, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Dr. Basheer', phone: '0483-2742345', distance: '2.8 km' },
        { name: 'Government HSS', location: 'Manjeri', capacity: 400, currentOccupancy: 156, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Abdul Rahman', phone: '0483-2781234', distance: '4.1 km' }
      ],
      totalCapacity: 1500,
      totalOccupancy: 579,
      emergencyShelters: 16
    },
    'Kozhikode': {
      shelters: [
        { name: 'Government Arts College', location: 'Kozhikode', capacity: 550, currentOccupancy: 201, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Dr. Krishnan', phone: '0495-2371234', distance: '1.2 km' },
        { name: 'Zamorin\'s Guruvayurappan College', location: 'Kozhikode', capacity: 450, currentOccupancy: 167, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Prof. Nair', phone: '0495-2372345', distance: '2.5 km' },
        { name: 'Devagiri College', location: 'Kozhikode', capacity: 400, currentOccupancy: 134, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Fr. Joseph', phone: '0495-2373456', distance: '3.1 km' }
      ],
      totalCapacity: 1400,
      totalOccupancy: 502,
      emergencyShelters: 14
    },
    'Wayanad': {
      shelters: [
        { name: 'Government College', location: 'Sultan Bathery', capacity: 300, currentOccupancy: 67, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Prof. Kumar', phone: '04936-201234', distance: '2.9 km' },
        { name: 'WMO Arts College', location: 'Muttil', capacity: 250, currentOccupancy: 45, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Dr. Radhika', phone: '04936-202345', distance: '4.2 km' },
        { name: 'Community Hall', location: 'Kalpetta', capacity: 350, currentOccupancy: 89, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Ramesh', phone: '04936-202456', distance: '1.5 km' }
      ],
      totalCapacity: 900,
      totalOccupancy: 201,
      emergencyShelters: 7
    },
    'Kannur': {
      shelters: [
        { name: 'Government College', location: 'Kannur', capacity: 450, currentOccupancy: 156, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Dr. Pillai', phone: '0497-2701234', distance: '1.3 km' },
        { name: 'NITK Campus', location: 'Mangalore Road', capacity: 500, currentOccupancy: 189, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Prof. Reddy', phone: '0497-2702345', distance: '3.8 km' },
        { name: 'Government HSS', location: 'Thalassery', capacity: 350, currentOccupancy: 98, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Abraham', phone: '0490-2341234', distance: '5.1 km' }
      ],
      totalCapacity: 1300,
      totalOccupancy: 443,
      emergencyShelters: 12
    },
    'Kasargod': {
      shelters: [
        { name: 'Government College', location: 'Kasargod', capacity: 400, currentOccupancy: 134, facilities: ['Food', 'Medical', 'Water'], contactPerson: 'Dr. Bhat', phone: '04672-231234', distance: '1.6 km' },
        { name: 'Nehru Arts College', location: 'Kanhangad', capacity: 350, currentOccupancy: 89, facilities: ['Food', 'Water', 'Sanitation'], contactPerson: 'Prof. Shetty', phone: '04678-221234', distance: '4.3 km' },
        { name: 'Community Hall', location: 'Kasargod', capacity: 450, currentOccupancy: 167, facilities: ['Food', 'Medical', 'Water', 'Sanitation'], contactPerson: 'Mohammed', phone: '04672-231345', distance: '0.8 km' }
      ],
      totalCapacity: 1200,
      totalOccupancy: 390,
      emergencyShelters: 10
    }
  };

  // Demo district data for fallback when real data is empty
  const demoDistrictData = {
    'Thiruvananthapuram': {
      alerts: [
        {
          _id: 'demo-alert-1',
          title: '🚨 Critical Heavy Rainfall Warning',
          description: 'Extreme rainfall expected in next 4 hours. Avoid low-lying areas and coastal zones immediately.',
          severity: 'critical',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'demo-alert-2',
          title: '⚠️ Flash Flood Alert',
          description: 'Rivers overflowing due to continuous downpour. Communities near riverbanks on alert.',
          severity: 'high',
          createdAt: new Date(Date.now() - 1800000).toISOString()
        },
        {
          _id: 'demo-alert-12',
          title: '🌊 Coastal Erosion Alert',
          description: 'Strong waves and high tides causing coastal erosion near Shankhumugham Beach.',
          severity: 'high',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          _id: 'demo-alert-13',
          title: 'Wind Storm Warning',
          description: 'Strong winds expected with gusts up to 60 km/h. Secure loose objects outdoors.',
          severity: 'moderate',
          createdAt: new Date(Date.now() - 5400000).toISOString()
        },
        {
          _id: 'demo-alert-14',
          title: 'Waterlogging in City Roads',
          description: 'Traffic congestion on MG Road and surrounding areas due to water logging.',
          severity: 'moderate',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          _id: 'demo-alert-15',
          title: 'Power Supply Disruption',
          description: 'Temporary power outages expected in southern parts of the city.',
          severity: 'moderate',
          createdAt: new Date(Date.now() - 9000000).toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-1',
          name: 'Government Higher Secondary School',
          district: 'Thiruvananthapuram',
          capacity: 200,
          currentOccupancy: 45,
          phone: '0471-2345678'
        },
        {
          _id: 'demo-shelter-2',
          name: 'Community Hall, Kowdiar',
          district: 'Thiruvananthapuram',
          capacity: 150,
          currentOccupancy: 30,
          phone: '0471-2345679'
        }
      ],
      places: [
        {
          _id: 'demo-place-1',
          name: 'Thiruvananthapuram City',
          riskLevel: 'HIGH'
        },
        {
          _id: 'demo-place-2',
          name: 'Varkala Beach Area',
          riskLevel: 'MODERATE'
        }
      ],
      volunteers: [
        {
          _id: 'demo-vol-1',
          name: 'Anjali Nair',
          email: 'anjali.nair@example.com',
          phone: '+91 98471 23456',
          district: 'Thiruvananthapuram',
          skills: ['First Aid', 'Rescue Coordination'],
          experience: '5 years experience in community rescue teams',
          availability: 'Available',
          teamHead: true,
          rating: 5
        },
        {
          _id: 'demo-vol-2',
          name: 'Rahul Menon',
          email: 'rahul.menon@example.com',
          phone: '+91 98472 34567',
          district: 'Thiruvananthapuram',
          skills: ['Logistics', 'Shelter Management'],
          experience: 'Local volunteer coordinator',
          availability: 'Available',
          teamHead: false,
          rating: 4
        },
        {
          _id: 'demo-vol-3',
          name: 'Lakshmi Pillai',
          email: 'lakshmi.pillai@example.com',
          phone: '+91 98473 45678',
          district: 'Thiruvananthapuram',
          skills: ['Medical Support', 'First Aid'],
          experience: 'Certified medical volunteer',
          availability: 'Available',
          teamHead: false,
          rating: 5
        }
      ]
    },
    'Ernakulam': {
      alerts: [
        {
          _id: 'demo-alert-3',
          title: '🚨 Critical Urban Flooding Alert',
          description: 'Multiple areas experiencing severe water logging. Avoid travel on main roads immediately.',
          severity: 'critical',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'demo-alert-4',
          title: '⚠️ Flash Flooding in Business District',
          description: 'Heavy traffic due to water logging on MG Road and bypass. Use alternate routes.',
          severity: 'high',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          _id: 'demo-alert-16',
          title: 'School Closures Notice',
          description: 'All schools closed due to heavy rainfall. Online classes to commence at 10 AM.',
          severity: 'moderate',
          createdAt: new Date(Date.now() - 10800000).toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-3',
          name: 'Maharajas College',
          district: 'Ernakulam',
          capacity: 300,
          currentOccupancy: 120,
          phone: '0484-2345678'
        },
        {
          _id: 'demo-shelter-4',
          name: 'Town Hall',
          district: 'Ernakulam',
          capacity: 250,
          currentOccupancy: 80,
          phone: '0484-2345679'
        }
      ],
      places: [
        {
          _id: 'demo-place-3',
          name: 'Kochi City',
          riskLevel: 'HIGH'
        },
        {
          _id: 'demo-place-4',
          name: 'Marine Drive',
          riskLevel: 'MODERATE'
        }
      ],
      volunteers: [
        {
          _id: 'demo-vol-4',
          name: 'Suresh Kumar',
          email: 'suresh.kumar@example.com',
          phone: '+91 98474 56789',
          district: 'Ernakulam',
          skills: ['Search & Rescue', 'First Aid'],
          experience: '6 years with local disaster relief teams',
          availability: 'Available',
          teamHead: true,
          rating: 5
        },
        {
          _id: 'demo-vol-5',
          name: 'Neha George',
          email: 'neha.george@example.com',
          phone: '+91 98475 67890',
          district: 'Ernakulam',
          skills: ['Communication', 'Logistics'],
          experience: 'Experienced in flood relief coordination',
          availability: 'Available',
          teamHead: false,
          rating: 4
        }
      ]
    },
    'Kozhikode': {
      alerts: [
        {
          _id: 'demo-alert-5',
          title: 'Coastal Storm Warning',
          description: 'High waves expected along the coast. Fishermen advised not to venture into sea.',
          severity: 'high',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-5',
          name: 'Government Arts College',
          district: 'Kozhikode',
          capacity: 180,
          currentOccupancy: 60,
          phone: '0495-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-5',
          name: 'Kozhikode Beach',
          riskLevel: 'HIGH'
        }
      ],
      volunteers: [
        {
          _id: 'demo-vol-6',
          name: 'Faizal Ahmed',
          email: 'faizal.ahmed@example.com',
          phone: '+91 98476 78901',
          district: 'Kozhikode',
          skills: ['Community Support', 'Rescue'],
          experience: 'Dedicated coastal rescue volunteer',
          availability: 'Available',
          teamHead: false,
          rating: 4
        }
      ]
    },
    'Wayanad': {
      alerts: [
        {
          _id: 'demo-alert-6',
          title: 'Landslide Warning',
          description: 'Risk of landslides in hilly areas. Avoid travel to high-altitude regions.',
          severity: 'critical',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-6',
          name: 'Government Higher Secondary School',
          district: 'Wayanad',
          capacity: 100,
          currentOccupancy: 25,
          phone: '04936-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-6',
          name: 'Kalpetta Town',
          riskLevel: 'HIGH'
        },
        {
          _id: 'demo-place-7',
          name: 'Banasura Sagar Dam',
          riskLevel: 'MODERATE'
        }
      ],
      volunteers: [
        {
          _id: 'demo-vol-7',
          name: 'Maya Thomas',
          email: 'maya.thomas@example.com',
          phone: '+91 98477 89012',
          district: 'Wayanad',
          skills: ['Landslide Response', 'First Aid'],
          experience: 'Local mountain response volunteer',
          availability: 'Available',
          teamHead: false,
          rating: 4
        }
      ]
    },
    'Idukki': {
      alerts: [
        {
          _id: 'demo-alert-7',
          title: 'Heavy Rainfall Alert',
          description: 'Continuous rainfall in hilly regions. Risk of landslides.',
          severity: 'critical',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-7',
          name: 'Government College',
          district: 'Idukki',
          capacity: 120,
          currentOccupancy: 40,
          phone: '04862-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-8',
          name: 'Munnar Hill Station',
          riskLevel: 'HIGH'
        }
      ],
      volunteers: [
        {
          _id: 'demo-vol-8',
          name: 'Vijay Thomas',
          email: 'vijay.thomas@example.com',
          phone: '+91 98478 90123',
          district: 'Idukki',
          skills: ['Medical Support', 'Rescue Logistics'],
          experience: 'Emergency volunteer in hill districts',
          availability: 'Available',
          teamHead: false,
          rating: 5
        }
      ]
    },
    'Alappuzha': {
      alerts: [
        {
          _id: 'demo-alert-8',
          title: 'Backwater Flooding',
          description: 'Rising water levels in backwaters. Low-lying areas affected.',
          severity: 'high',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-8',
          name: 'SD College',
          district: 'Alappuzha',
          capacity: 200,
          currentOccupancy: 70,
          phone: '0477-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-9',
          name: 'Alappuzha Town',
          riskLevel: 'HIGH'
        }
      ]
    },
    'Thrissur': {
      alerts: [
        {
          _id: 'demo-alert-9',
          title: 'River Flooding Alert',
          description: 'Bharathapuzha river swelling. People near banks advised to move to safer areas.',
          severity: 'moderate',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-9',
          name: 'Sree Kerala Varma College',
          district: 'Thrissur',
          capacity: 150,
          currentOccupancy: 35,
          phone: '0487-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-10',
          name: 'Thrissur City',
          riskLevel: 'MODERATE'
        }
      ]
    },
    'Malappuram': {
      alerts: [
        {
          _id: 'demo-alert-10',
          title: 'Flood Warning',
          description: 'Chaliyar river overflowing. Several areas affected.',
          severity: 'high',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-10',
          name: 'Government College',
          district: 'Malappuram',
          capacity: 180,
          currentOccupancy: 55,
          phone: '0483-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-11',
          name: 'Manjeri Town',
          riskLevel: 'HIGH'
        }
      ]
    },
    'Kollam': {
      alerts: [
        {
          _id: 'demo-alert-11',
          title: 'Industrial Accident Alert',
          description: 'Chemical leak reported in industrial area. Avoid nearby areas.',
          severity: 'moderate',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-11',
          name: 'SN College',
          district: 'Kollam',
          capacity: 160,
          currentOccupancy: 40,
          phone: '0474-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-12',
          name: 'Kollam City',
          riskLevel: 'MODERATE'
        }
      ]
    },
    'Palakkad': {
      alerts: [
        {
          _id: 'demo-alert-12',
          title: 'Wild Fire Alert',
          description: 'Forest fire reported in Western Ghats region.',
          severity: 'moderate',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-12',
          name: 'Government Victoria College',
          district: 'Palakkad',
          capacity: 140,
          currentOccupancy: 30,
          phone: '0491-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-13',
          name: 'Palakkad Town',
          riskLevel: 'MODERATE'
        }
      ]
    },
    'Kannur': {
      alerts: [
        {
          _id: 'demo-alert-13',
          title: 'Coastal Erosion Alert',
          description: 'Strong waves causing erosion near Payyannur beach.',
          severity: 'moderate',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-13',
          name: 'Government College',
          district: 'Kannur',
          capacity: 130,
          currentOccupancy: 25,
          phone: '0497-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-14',
          name: 'Kannur City',
          riskLevel: 'MODERATE'
        }
      ]
    },
    'Kasargod': {
      alerts: [
        {
          _id: 'demo-alert-14',
          title: 'River Flooding Alert',
          description: 'Chandragiri river swelling due to heavy rains.',
          severity: 'moderate',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-14',
          name: 'Government College',
          district: 'Kasargod',
          capacity: 100,
          currentOccupancy: 20,
          phone: '0467-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-15',
          name: 'Kasargod Town',
          riskLevel: 'MODERATE'
        }
      ]
    },
    'Pathanamthitta': {
      alerts: [
        {
          _id: 'demo-alert-15',
          title: 'Flash Flood Warning',
          description: 'Sudden rise in water levels in Pamba river.',
          severity: 'high',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-15',
          name: 'Catholicate College',
          district: 'Pathanamthitta',
          capacity: 120,
          currentOccupancy: 35,
          phone: '0468-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-16',
          name: 'Sabarimala Area',
          riskLevel: 'HIGH'
        }
      ]
    },
    'Kottayam': {
      alerts: [
        {
          _id: 'demo-alert-16',
          title: 'River Flooding Alert',
          description: 'Meenachil river banks overflowing in some areas.',
          severity: 'moderate',
          createdAt: new Date().toISOString()
        }
      ],
      shelters: [
        {
          _id: 'demo-shelter-16',
          name: 'CMS College',
          district: 'Kottayam',
          capacity: 150,
          currentOccupancy: 40,
          phone: '0481-2345678'
        }
      ],
      places: [
        {
          _id: 'demo-place-17',
          name: 'Kottayam City',
          riskLevel: 'MODERATE'
        }
      ]
    }
  };

  // Realistic weather data for all Kerala districts
  const keralaWeatherData = {
    'Thiruvananthapuram': {
      current: {
        temperature: 28,
        condition: 'Heavy Showers',
        icon: '🌧️',
        humidity: 88,
        windSpeed: 34,
        rainfall: 87,
        visibility: 3.2,
        pressure: 1008,
        feelsLike: 31,
        uvIndex: 6,
        alertLevel: 'orange',
        alertText: 'Heavy Rainfall Warning'
      },
      forecast: [
        { day: 'Today', icon: '🌧️', high: 29, low: 23, rain: 87, condition: 'Heavy Showers' },
        { day: 'Saturday', icon: '⛈️', high: 27, low: 22, rain: 120, condition: 'Thunderstorms' },
        { day: 'Sunday', icon: '🌧️', high: 28, low: 23, rain: 65, condition: 'Moderate Rain' },
        { day: 'Monday', icon: '🌦️', high: 30, low: 24, rain: 30, condition: 'Light Rain' },
        { day: 'Tuesday', icon: '⛅', high: 31, low: 25, rain: 10, condition: 'Partly Cloudy' }
      ],
      alerts: [
        { type: 'Heavy Rainfall', severity: 'Orange', time: 'Issued 2 hours ago' },
        { type: 'Coastal Warning', severity: 'Yellow', time: 'Issued 4 hours ago' }
      ]
    },
    'Ernakulam': {
      current: {
        temperature: 27,
        condition: 'Moderate Rain',
        icon: '🌦️',
        humidity: 85,
        windSpeed: 28,
        rainfall: 45,
        visibility: 4.5,
        pressure: 1010,
        feelsLike: 30,
        uvIndex: 5,
        alertLevel: 'yellow',
        alertText: 'Rainfall Alert'
      },
      forecast: [
        { day: 'Today', icon: '🌦️', high: 27, low: 22, rain: 45, condition: 'Moderate Rain' },
        { day: 'Saturday', icon: '🌧️', high: 26, low: 21, rain: 80, condition: 'Heavy Showers' },
        { day: 'Sunday', icon: '⛈️', high: 25, low: 20, rain: 110, condition: 'Thunderstorms' },
        { day: 'Monday', icon: '🌧️', high: 27, low: 22, rain: 55, condition: 'Moderate Rain' },
        { day: 'Tuesday', icon: '🌦️', high: 29, low: 23, rain: 25, condition: 'Light Rain' }
      ],
      alerts: [
        { type: 'Urban Flooding', severity: 'Yellow', time: 'Issued 1 hour ago' },
        { type: 'Traffic Disruption', severity: 'Yellow', time: 'Issued 3 hours ago' }
      ]
    },
    'Kozhikode': {
      current: {
        temperature: 26,
        condition: 'Thunderstorms',
        icon: '⛈️',
        humidity: 92,
        windSpeed: 42,
        rainfall: 125,
        visibility: 2.1,
        pressure: 1006,
        feelsLike: 29,
        uvIndex: 4,
        alertLevel: 'red',
        alertText: 'Severe Thunderstorm Warning'
      },
      forecast: [
        { day: 'Today', icon: '⛈️', high: 26, low: 21, rain: 125, condition: 'Thunderstorms' },
        { day: 'Saturday', icon: '🌧️', high: 25, low: 20, rain: 95, condition: 'Heavy Showers' },
        { day: 'Sunday', icon: '🌦️', high: 27, low: 22, rain: 60, condition: 'Moderate Rain' },
        { day: 'Monday', icon: '⛅', high: 28, low: 23, rain: 20, condition: 'Partly Cloudy' },
        { day: 'Tuesday', icon: '☀️', high: 30, low: 24, rain: 5, condition: 'Sunny' }
      ],
      alerts: [
        { type: 'Severe Thunderstorm', severity: 'Red', time: 'Issued 30 minutes ago' },
        { type: 'Coastal Storm', severity: 'Orange', time: 'Issued 1 hour ago' }
      ]
    },
    'Wayanad': {
      current: {
        temperature: 22,
        condition: 'Landslide Risk',
        icon: '🌫️',
        humidity: 95,
        windSpeed: 18,
        rainfall: 180,
        visibility: 1.5,
        pressure: 1004,
        feelsLike: 24,
        uvIndex: 3,
        alertLevel: 'red',
        alertText: 'Landslide Warning'
      },
      forecast: [
        { day: 'Today', icon: '🌫️', high: 22, low: 18, rain: 180, condition: 'Landslide Risk' },
        { day: 'Saturday', icon: '🌧️', high: 21, low: 17, rain: 150, condition: 'Heavy Showers' },
        { day: 'Sunday', icon: '🌦️', high: 23, low: 19, rain: 90, condition: 'Moderate Rain' },
        { day: 'Monday', icon: '🌧️', high: 22, low: 18, rain: 110, condition: 'Heavy Showers' },
        { day: 'Tuesday', icon: '🌦️', high: 24, low: 19, rain: 50, condition: 'Light Rain' }
      ],
      alerts: [
        { type: 'Landslide Warning', severity: 'Red', time: 'Issued 1 hour ago' },
        { type: 'Flash Flood', severity: 'Orange', time: 'Issued 2 hours ago' }
      ]
    },
    'Idukki': {
      current: {
        temperature: 20,
        condition: 'Heavy Rain',
        icon: '🌧️',
        humidity: 93,
        windSpeed: 25,
        rainfall: 165,
        visibility: 2.8,
        pressure: 1005,
        feelsLike: 22,
        uvIndex: 3,
        alertLevel: 'orange',
        alertText: 'Heavy Rainfall Alert'
      },
      forecast: [
        { day: 'Today', icon: '🌧️', high: 20, low: 16, rain: 165, condition: 'Heavy Rain' },
        { day: 'Saturday', icon: '🌫️', high: 19, low: 15, rain: 140, condition: 'Landslide Risk' },
        { day: 'Sunday', icon: '🌧️', high: 21, low: 17, rain: 100, condition: 'Heavy Showers' },
        { day: 'Monday', icon: '🌦️', high: 22, low: 18, rain: 70, condition: 'Moderate Rain' },
        { day: 'Tuesday', icon: '🌧️', high: 21, low: 17, rain: 85, condition: 'Heavy Showers' }
      ],
      alerts: [
        { type: 'Heavy Rainfall', severity: 'Orange', time: 'Issued 2 hours ago' },
        { type: 'Dam Safety', severity: 'Yellow', time: 'Issued 3 hours ago' }
      ]
    },
    'Alappuzha': {
      current: {
        temperature: 27,
        condition: 'Backwater Flooding',
        icon: '🌊',
        humidity: 90,
        windSpeed: 30,
        rainfall: 95,
        visibility: 3.8,
        pressure: 1007,
        feelsLike: 30,
        uvIndex: 5,
        alertLevel: 'orange',
        alertText: 'Backwater Flooding'
      },
      forecast: [
        { day: 'Today', icon: '🌊', high: 27, low: 23, rain: 95, condition: 'Backwater Flooding' },
        { day: 'Saturday', icon: '🌧️', high: 26, low: 22, rain: 120, condition: 'Heavy Showers' },
        { day: 'Sunday', icon: '🌦️', high: 28, low: 23, rain: 65, condition: 'Moderate Rain' },
        { day: 'Monday', icon: '🌧️', high: 27, low: 22, rain: 80, condition: 'Heavy Showers' },
        { day: 'Tuesday', icon: '🌦️', high: 29, low: 24, rain: 35, condition: 'Light Rain' }
      ],
      alerts: [
        { type: 'Backwater Flooding', severity: 'Orange', time: 'Issued 1 hour ago' },
        { type: 'Flood Warning', severity: 'Yellow', time: 'Issued 2 hours ago' }
      ]
    },
    'Thrissur': {
      current: {
        temperature: 26,
        condition: 'Light Rain',
        icon: '🌦️',
        humidity: 82,
        windSpeed: 22,
        rainfall: 25,
        visibility: 5.2,
        pressure: 1011,
        feelsLike: 28,
        uvIndex: 6,
        alertLevel: 'green',
        alertText: 'Normal Conditions'
      },
      forecast: [
        { day: 'Today', icon: '🌦️', high: 26, low: 21, rain: 25, condition: 'Light Rain' },
        { day: 'Saturday', icon: '🌧️', high: 25, low: 20, rain: 55, condition: 'Moderate Rain' },
        { day: 'Sunday', icon: '🌦️', high: 27, low: 22, rain: 40, condition: 'Light Rain' },
        { day: 'Monday', icon: '⛅', high: 28, low: 23, rain: 15, condition: 'Partly Cloudy' },
        { day: 'Tuesday', icon: '☀️', high: 30, low: 24, rain: 8, condition: 'Sunny' }
      ],
      alerts: [
        { type: 'River Level', severity: 'Green', time: 'Monitored' }
      ]
    },
    'Malappuram': {
      current: {
        temperature: 25,
        condition: 'Moderate Rain',
        icon: '🌧️',
        humidity: 87,
        windSpeed: 35,
        rainfall: 70,
        visibility: 4.0,
        pressure: 1009,
        feelsLike: 28,
        uvIndex: 5,
        alertLevel: 'yellow',
        alertText: 'Rainfall Alert'
      },
      forecast: [
        { day: 'Today', icon: '🌧️', high: 25, low: 20, rain: 70, condition: 'Moderate Rain' },
        { day: 'Saturday', icon: '🌧️', high: 24, low: 19, rain: 90, condition: 'Heavy Showers' },
        { day: 'Sunday', icon: '⛈️', high: 23, low: 18, rain: 115, condition: 'Thunderstorms' },
        { day: 'Monday', icon: '🌧️', high: 25, low: 20, rain: 60, condition: 'Moderate Rain' },
        { day: 'Tuesday', icon: '🌦️', high: 27, low: 21, rain: 30, condition: 'Light Rain' }
      ],
      alerts: [
        { type: 'River Flooding', severity: 'Yellow', time: 'Issued 2 hours ago' },
        { type: 'Rainfall Alert', severity: 'Yellow', time: 'Issued 3 hours ago' }
      ]
    },
    'Kollam': {
      current: {
        temperature: 27,
        condition: 'Partly Cloudy',
        icon: '⛅',
        humidity: 78,
        windSpeed: 20,
        rainfall: 15,
        visibility: 6.5,
        pressure: 1012,
        feelsLike: 29,
        uvIndex: 7,
        alertLevel: 'green',
        alertText: 'Normal Conditions'
      },
      forecast: [
        { day: 'Today', icon: '⛅', high: 27, low: 23, rain: 15, condition: 'Partly Cloudy' },
        { day: 'Saturday', icon: '🌦️', high: 26, low: 22, rain: 35, condition: 'Light Rain' },
        { day: 'Sunday', icon: '🌧️', high: 25, low: 21, rain: 55, condition: 'Moderate Rain' },
        { day: 'Monday', icon: '🌦️', high: 27, low: 22, rain: 25, condition: 'Light Rain' },
        { day: 'Tuesday', icon: '⛅', high: 29, low: 24, rain: 12, condition: 'Partly Cloudy' }
      ],
      alerts: [
        { type: 'Industrial Safety', severity: 'Green', time: 'Monitored' }
      ]
    },
    'Palakkad': {
      current: {
        temperature: 29,
        condition: 'Hot & Humid',
        icon: '🌤️',
        humidity: 75,
        windSpeed: 15,
        rainfall: 5,
        visibility: 7.8,
        pressure: 1013,
        feelsLike: 32,
        uvIndex: 8,
        alertLevel: 'yellow',
        alertText: 'Heat Wave Warning'
      },
      forecast: [
        { day: 'Today', icon: '🌤️', high: 29, low: 24, rain: 5, condition: 'Hot & Humid' },
        { day: 'Saturday', icon: '☀️', high: 31, low: 25, rain: 2, condition: 'Sunny' },
        { day: 'Sunday', icon: '⛅', high: 30, low: 24, rain: 18, condition: 'Partly Cloudy' },
        { day: 'Monday', icon: '🌦️', high: 28, low: 23, rain: 35, condition: 'Light Rain' },
        { day: 'Tuesday', icon: '🌧️', high: 27, low: 22, rain: 55, condition: 'Moderate Rain' }
      ],
      alerts: [
        { type: 'Heat Wave', severity: 'Yellow', time: 'Issued 1 hour ago' },
        { type: 'Wild Fire Risk', severity: 'Green', time: 'Monitored' }
      ]
    },
    'Kannur': {
      current: {
        temperature: 26,
        condition: 'Coastal Showers',
        icon: '🌦️',
        humidity: 83,
        windSpeed: 28,
        rainfall: 35,
        visibility: 5.5,
        pressure: 1010,
        feelsLike: 28,
        uvIndex: 6,
        alertLevel: 'green',
        alertText: 'Coastal Showers'
      },
      forecast: [
        { day: 'Today', icon: '🌦️', high: 26, low: 22, rain: 35, condition: 'Coastal Showers' },
        { day: 'Saturday', icon: '🌧️', high: 25, low: 21, rain: 60, condition: 'Moderate Rain' },
        { day: 'Sunday', icon: '🌦️', high: 27, low: 22, rain: 40, condition: 'Light Rain' },
        { day: 'Monday', icon: '⛅', high: 28, low: 23, rain: 20, condition: 'Partly Cloudy' },
        { day: 'Tuesday', icon: '☀️', high: 30, low: 24, rain: 8, condition: 'Sunny' }
      ],
      alerts: [
        { type: 'Coastal Safety', severity: 'Green', time: 'Monitored' }
      ]
    },
    'Kasargod': {
      current: {
        temperature: 27,
        condition: 'Light Showers',
        icon: '🌦️',
        humidity: 80,
        windSpeed: 25,
        rainfall: 20,
        visibility: 6.0,
        pressure: 1011,
        feelsLike: 29,
        uvIndex: 6,
        alertLevel: 'green',
        alertText: 'Light Showers'
      },
      forecast: [
        { day: 'Today', icon: '🌦️', high: 27, low: 23, rain: 20, condition: 'Light Showers' },
        { day: 'Saturday', icon: '🌧️', high: 26, low: 22, rain: 45, condition: 'Moderate Rain' },
        { day: 'Sunday', icon: '🌦️', high: 28, low: 23, rain: 30, condition: 'Light Rain' },
        { day: 'Monday', icon: '⛅', high: 29, low: 24, rain: 15, condition: 'Partly Cloudy' },
        { day: 'Tuesday', icon: '☀️', high: 31, low: 25, rain: 5, condition: 'Sunny' }
      ],
      alerts: [
        { type: 'River Monitoring', severity: 'Green', time: 'Monitored' }
      ]
    },
    'Pathanamthitta': {
      current: {
        temperature: 24,
        condition: 'Heavy Showers',
        icon: '🌧️',
        humidity: 91,
        windSpeed: 32,
        rainfall: 110,
        visibility: 3.5,
        pressure: 1008,
        feelsLike: 26,
        uvIndex: 4,
        alertLevel: 'orange',
        alertText: 'Heavy Rainfall'
      },
      forecast: [
        { day: 'Today', icon: '🌧️', high: 24, low: 19, rain: 110, condition: 'Heavy Showers' },
        { day: 'Saturday', icon: '⛈️', high: 23, low: 18, rain: 135, condition: 'Thunderstorms' },
        { day: 'Sunday', icon: '🌧️', high: 25, low: 20, rain: 85, condition: 'Heavy Showers' },
        { day: 'Monday', icon: '🌦️', high: 26, low: 21, rain: 45, condition: 'Light Rain' },
        { day: 'Tuesday', icon: '🌧️', high: 25, low: 20, rain: 65, condition: 'Moderate Rain' }
      ],
      alerts: [
        { type: 'Pilgrimage Safety', severity: 'Orange', time: 'Issued 1 hour ago' },
        { type: 'River Safety', severity: 'Yellow', time: 'Issued 2 hours ago' }
      ]
    },
    'Kottayam': {
      current: {
        temperature: 25,
        condition: 'Moderate Rain',
        icon: '🌧️',
        humidity: 86,
        windSpeed: 26,
        rainfall: 55,
        visibility: 4.2,
        pressure: 1010,
        feelsLike: 27,
        uvIndex: 5,
        alertLevel: 'yellow',
        alertText: 'Rainfall Alert'
      },
      forecast: [
        { day: 'Today', icon: '🌧️', high: 25, low: 20, rain: 55, condition: 'Moderate Rain' },
        { day: 'Saturday', icon: '🌧️', high: 24, low: 19, rain: 75, condition: 'Heavy Showers' },
        { day: 'Sunday', icon: '🌦️', high: 26, low: 21, rain: 40, condition: 'Light Rain' },
        { day: 'Monday', icon: '⛅', high: 27, low: 22, rain: 20, condition: 'Partly Cloudy' },
        { day: 'Tuesday', icon: '🌦️', high: 28, low: 23, rain: 30, condition: 'Light Rain' }
      ],
      alerts: [
        { type: 'River Level', severity: 'Yellow', time: 'Issued 2 hours ago' },
        { type: 'Urban Flooding', severity: 'Green', time: 'Monitored' }
      ]
    }
  };

  // Get user token from localStorage
  const token = localStorage.getItem('token');

  // Weather helper functions
  const getWeatherCondition = (code) => {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '☁️';
  };

  // Fetch real weather from Open-Meteo API
  const fetchRealWeather = async (districtName) => {
    const district = keralaDistricts.find(d => d.name === districtName);
    if (!district) return null;

    try {
      setWeatherFetching(true);
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${district.coordinates.lat}&longitude=${district.coordinates.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia/Kolkata`
      );
      const data = await response.json();

      return {
        temperature: Math.round(data.current.temperature_2m),
        condition: getWeatherCondition(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        feelsLike: Math.round(data.current.apparent_temperature)
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    } finally {
      setWeatherFetching(false);
    }
  };

  // Live clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ultra-fast data fetching - completely non-blocking
  useEffect(() => {
    // Load cached data immediately (synchronous)
    const now = Date.now();
    const cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    try {
      const cachedAlerts = localStorage.getItem('dashboard_alerts');
      if (cachedAlerts) {
        const { data, timestamp } = JSON.parse(cachedAlerts);
        if (now - timestamp < cacheTimeout) {
          setAlerts(data);
        }
      }
      
      const cachedShelters = localStorage.getItem('dashboard_shelters');
      if (cachedShelters) {
        const { data, timestamp } = JSON.parse(cachedShelters);
        if (now - timestamp < cacheTimeout) {
          setShelters(data);
        }
      }
      
      const cachedPlaces = localStorage.getItem('dashboard_places');
      if (cachedPlaces) {
        const { data, timestamp } = JSON.parse(cachedPlaces);
        if (now - timestamp < cacheTimeout) {
          setPlaces(data);
        }
      }
      
      const cachedVolunteers = localStorage.getItem('dashboard_volunteers');
      if (cachedVolunteers) {
        const { data, timestamp } = JSON.parse(cachedVolunteers);
        if (now - timestamp < cacheTimeout) {
          setVolunteers(data);
        }
      }
    } catch (err) {
      console.warn('Cache read failed:', err);
    }
    
    // Mark initial load as complete immediately
    setInitialLoad(false);
    
    // Background data fetching - completely non-blocking
    if (token) {
      const fetchBackgroundData = async () => {
        try {
          const userApi = new UserApi(token);
          
          console.log('Starting background data fetch...');
          
          // Fetch alerts first (most important)
          try {
            const alertsData = await userApi.getPublishedAlerts();
            console.log('Alerts fetched:', alertsData?.length || 0);
            setAlerts(alertsData || []);
            localStorage.setItem('dashboard_alerts', JSON.stringify({
              data: alertsData || [],
              timestamp: Date.now()
            }));
          } catch (err) {
            console.warn('Alerts fetch failed:', err);
          }
          
          // Fetch shelters
          try {
            const sheltersData = await userApi.getShelters();
            console.log('Shelters fetched:', sheltersData?.length || 0);
            console.log('Shelters data sample:', sheltersData?.[0]);
            setShelters(sheltersData || []);
            localStorage.setItem('dashboard_shelters', JSON.stringify({
              data: sheltersData || [],
              timestamp: Date.now()
            }));
          } catch (err) {
            console.warn('Shelters fetch failed:', err);
            console.error('Full error:', err);
          }
          
          // Fetch places
          try {
            const placesData = await userApi.getPlaces();
            console.log('Places fetched:', placesData?.length || 0);
            setPlaces(placesData || []);
            localStorage.setItem('dashboard_places', JSON.stringify({
              data: placesData || [],
              timestamp: Date.now()
            }));
          } catch (err) {
            console.warn('Places fetch failed:', err);
          }
          
          // Fetch volunteers
          try {
            const volunteersData = await userApi.getVolunteers();
            console.log('Volunteers fetched:', volunteersData?.length || 0);
            setVolunteers(volunteersData || []);
            localStorage.setItem('dashboard_volunteers', JSON.stringify({
              data: volunteersData || [],
              timestamp: Date.now()
            }));
          } catch (err) {
            console.warn('Volunteers fetch failed:', err);
          }
          
        } catch (err) {
          console.error('Background fetch failed:', err);
        }
      };
      
      // Start background fetching after a short delay to ensure UI renders first
      setTimeout(fetchBackgroundData, 500);
    }
  }, [token]);

  // Fetch real weather data when user district is available
  useEffect(() => {
    const loadWeather = async () => {
      if (user?.district) {
        const weather = await fetchRealWeather(user.district);
        if (weather) {
          setCurrentWeather(weather);
        }
      }
    };
    loadWeather();
  }, [user?.district]);

  // Process districts data from places with fallback
  const districts = places.length > 0 
    ? places.map(place => ({
        name: place.name || place.district,
        risk: place.riskLevel?.toLowerCase() || 'moderate'
      }))
    : [
        { name: 'Ernakulam', risk: 'moderate' },
        { name: 'Thrissur', risk: 'moderate' },
        { name: 'Kozhikode', risk: 'low' }
      ];

  // Process alerts data for display with fallback
  const alertsData = (() => {
    let baseData = [];
    
    if (alerts.length > 0) {
      baseData = alerts.map(alert => ({
        id: alert._id,
        title: alert.title,
        desc: alert.description,
        severity: alert.severity?.toLowerCase() || 'moderate',
        tags: [alert.type, alert.placeName].filter(Boolean),
        time: new Date(alert.createdAt || alert.timestamp).toLocaleString()
      }));
    } else if (initialLoad) {
      baseData = [{
        id: 'loading-1',
        title: 'Loading alerts...',
        desc: 'Fetching latest disaster alerts for your area',
        severity: 'moderate',
        tags: ['Loading'],
        time: 'Just now'
      }];
    } else {
      const demoAlerts = demoDistrictData[user?.district]?.alerts || demoDistrictData['Thiruvananthapuram']?.alerts || [];
      
      if (demoAlerts.length > 0) {
        baseData = demoAlerts.map(alert => ({
          id: alert._id,
          title: alert.title,
          desc: alert.description,
          severity: alert.severity?.toLowerCase() || 'moderate',
          tags: ['Safe'],
          time: 'Just now'
        }));
      } else {
        baseData = [{
          id: 'no-data-1',
          title: 'No active alerts',
          desc: 'There are currently no active disaster alerts in your area',
          severity: 'moderate',
          tags: ['Safe'],
          time: 'Just now'
        }];
      }
    }
    
    // Apply filter
    if (alertFilter === 'all') {
      return baseData;
    }
    return baseData.filter(a => a.severity === alertFilter);
  })();

  // Process shelters data for display with fallback
  const sheltersData = shelters.length > 0
    ? shelters.map(shelter => ({
        id: shelter._id,
        name: shelter.name,
        dist: shelter.district || shelter.placeName,
        occ: shelter.currentOccupancy || 0,
        cap: shelter.capacity || 100,
        phone: shelter.phone || 'N/A',
        km: Math.random() * 10, // Mock distance for now
        status: shelter.currentOccupancy >= shelter.capacity ? 'Full' : 
                shelter.currentOccupancy >= shelter.capacity * 0.8 ? 'Nearly Full' : 'Open'
      }))
    : initialLoad
      ? [
          {
            id: 'loading-1',
            name: 'Loading shelters...',
            dist: 'Fetching nearby shelters',
            occ: 0,
            cap: 100,
            phone: 'Loading...',
            km: 0,
            status: 'Open'
          }
        ]
      : [
          {
            id: 'no-data-1',
            name: 'No shelters available',
            dist: 'Check back later for shelter information',
            occ: 0,
            cap: 100,
            phone: 'N/A',
            km: 0,
            status: 'Open'
          }
        ];

  // Process volunteers data for display
  const volunteersData = volunteers.length > 0
    ? volunteers.map(volunteer => ({
        id: volunteer._id,
        name: volunteer.userId?.name || volunteer.name || `${volunteer.firstName || ''} ${volunteer.lastName || ''}`.trim() || 'Anonymous',
        email: volunteer.userId?.email || volunteer.email || 'N/A',
        phone: volunteer.userId?.phone || volunteer.phone || 'N/A',
        district: volunteer.district || 'Unknown',
        skills: volunteer.skills || ['General Help'],
        experience: volunteer.experience || 'Volunteer',
        teamHead: volunteer.teamHead || false,
        availability: volunteer.availability || 'Available',
        rating: volunteer.rating || 5
      }))
    : initialLoad
      ? [{
          id: 'loading-1',
          name: 'Loading volunteers...',
          email: 'Fetching volunteer information',
          phone: 'Loading...',
          district: 'Please wait',
          skills: ['Loading'],
          experience: 'Loading...',
          teamHead: false,
          availability: 'Loading...',
          rating: 0
        }]
      : [{
          id: 'no-data-1',
          name: 'No volunteers available',
          email: 'Check back later for volunteer information',
          phone: 'N/A',
          district: 'Unknown',
          skills: ['None'],
          experience: 'No volunteers',
          teamHead: false,
          availability: 'Unavailable',
          rating: 0
        }];

  const currentDistrict = user?.district || 'Thiruvananthapuram';
  const approvedLocalVolunteers = volunteers.length > 0
    ? volunteers.filter(vol => {
        const volunteerDistrict = (vol.district || vol.userId?.district || '').toLowerCase();
        return (vol.status === 'approved' || !vol.status) &&
          volunteerDistrict === currentDistrict.toLowerCase();
      })
    : [];

  const districtVolunteerData = (() => {
    if (initialLoad && volunteers.length === 0) {
      return volunteersData;
    }

    if (approvedLocalVolunteers.length > 0) {
      return approvedLocalVolunteers.map(volunteer => ({
        id: volunteer._id,
        name: volunteer.userId?.name || `${volunteer.firstName || ''} ${volunteer.lastName || ''}`.trim() || 'Anonymous',
        email: volunteer.userId?.email || volunteer.email || 'N/A',
        phone: volunteer.userId?.phone || volunteer.phone || 'N/A',
        district: volunteer.district || volunteer.userId?.district || 'Unknown',
        skills: volunteer.skills || ['General Help'],
        experience: volunteer.experience || 'Volunteer',
        teamHead: volunteer.teamHead || false,
        availability: volunteer.availability || 'Available',
        rating: volunteer.rating || 5
      }));
    }

    const demoVolunteers = demoDistrictData[currentDistrict]?.volunteers || demoDistrictData['Thiruvananthapuram']?.volunteers || [];
    return demoVolunteers.map(volunteer => ({
      id: volunteer._id,
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      district: volunteer.district,
      skills: volunteer.skills,
      experience: volunteer.experience,
      teamHead: volunteer.teamHead,
      availability: volunteer.availability,
      rating: volunteer.rating || 5
    }));
  })();

  const volunteerCards = districtVolunteerData.slice(0, 6);

  // Skeleton loading components
  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-text short"></div>
    </div>
  );

  const SkeletonShelter = () => (
    <div className="sh-card skeleton-shelter">
      <div className="shc-top">
        <div>
          <div className="skeleton-line skeleton-shelter-name"></div>
          <div className="skeleton-line skeleton-text"></div>
        </div>
        <div className="skeleton-line skeleton-badge"></div>
      </div>
      <div className="skeleton-line skeleton-bar"></div>
    </div>
  );

  const getSeverityClass = (severity) => {
    const map = { critical: 'af-crit', high: 'af-high', moderate: 'af-mod' };
    return map[severity] || '';
  };

  const getStatusBadge = (status) => {
    const map = { 'Open': 'scb-o', 'Nearly Full': 'scb-n', 'Full': 'scb-f' };
    return map[status] || 'scb-o';
  };

  const getSOS = () => {
    setShowToast({ icon: '🆘', title: 'SOS Sent Successfully!', msg: 'Rescue teams notified. Stay calm and remain at your location.' });
    setShowSOS(false);
    setTimeout(() => setShowToast(null), 5000);
  };

  // Search functionality
  const handleSearch = (query) => {
    console.log('Search query:', query);
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = keralaDistricts.filter(district => 
        district.name.toLowerCase().includes(query.toLowerCase()) ||
        district.shortName.toLowerCase().includes(query.toLowerCase())
      );
      console.log('Filtered districts:', filtered);
      console.log('Show search results:', filtered.length > 0);
      setShowSearchResults(filtered.length > 0);
    } else {
      setShowSearchResults(false);
      setSelectedDistrict(null);
    }
  };

  const handleDistrictSelect = async (district) => {
    console.log('District selected:', district.name);
    setSelectedDistrict(district);
    setShowSearchResults(false);
    setSearchQuery(district.name);
    setDistrictLoading(true);
    
    try {
      const userApi = new UserApi(token);
      
      // Fetch district-specific data
      const [alertsData, sheltersData, placesData] = await Promise.all([
        userApi.getPublishedAlerts(),
        userApi.getShelters(),
        userApi.getPlaces()
      ]);
      
      // Filter data for the selected district
      const districtAlerts = alertsData.filter(alert => 
        alert.placeName === district.name || 
        alert.district === district.name ||
        alert.placeName?.toLowerCase().includes(district.name.toLowerCase())
      );
      
      const districtShelters = sheltersData.filter(shelter => 
        shelter.district === district.name || 
        shelter.placeName === district.name ||
        shelter.district?.toLowerCase().includes(district.name.toLowerCase())
      );
      
      const districtPlaces = placesData.filter(place => 
        place.name === district.name || 
        place.district === district.name ||
        place.name?.toLowerCase().includes(district.name.toLowerCase())
      );
      
      // If no real data found, use demo data
      const demoData = demoDistrictData[district.name] || {
        alerts: [],
        shelters: [],
        places: []
      };
      
      const finalAlerts = districtAlerts.length > 0 ? districtAlerts : demoData.alerts;
      const finalShelters = districtShelters.length > 0 ? districtShelters : demoData.shelters;
      const finalPlaces = districtPlaces.length > 0 ? districtPlaces : demoData.places;
      
      setDistrictData({
        alerts: finalAlerts,
        shelters: finalShelters,
        places: finalPlaces,
        highRiskAreas: finalPlaces.filter(p => p.riskLevel === 'HIGH').length,
        totalShelterCapacity: finalShelters.reduce((sum, s) => sum + (s.capacity || 0), 0),
        sosRequests: Math.floor(Math.random() * 5) // Random demo SOS requests
      });
      
    } catch (err) {
      console.error('Error fetching district data:', err);
      // Use demo data as fallback
      const demoData = demoDistrictData[district.name] || {
        alerts: [],
        shelters: [],
        places: []
      };
      
      setDistrictData({
        alerts: demoData.alerts,
        shelters: demoData.shelters,
        places: demoData.places,
        highRiskAreas: demoData.places.filter(p => p.riskLevel === 'HIGH').length,
        totalShelterCapacity: demoData.shelters.reduce((sum, s) => sum + (s.capacity || 0), 0),
        sosRequests: Math.floor(Math.random() * 5)
      });
    } finally {
      setDistrictLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedDistrict(null);
    setShowSearchResults(false);
    setDistrictData(null);
    setDistrictLoading(false);
  };

  // Weather search functionality
  const handleWeatherSearch = (query) => {
    console.log('Weather search query:', query);
    setWeatherSearchQuery(query);
    if (query.trim()) {
      const filtered = keralaDistricts.filter(district => 
        district.name.toLowerCase().includes(query.toLowerCase()) ||
        district.shortName.toLowerCase().includes(query.toLowerCase())
      );
      console.log('Filtered weather districts:', filtered);
      setShowWeatherSearchResults(filtered.length > 0);
    } else {
      setShowWeatherSearchResults(false);
      setSelectedWeatherDistrict(null);
    }
  };

  const handleWeatherDistrictSelect = async (district) => {
    console.log('Weather district selected:', district.name);
    setSelectedWeatherDistrict(district);
    setShowWeatherSearchResults(false);
    setWeatherSearchQuery(district.name);
    setWeatherLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const weatherInfo = keralaWeatherData[district.name];
      if (weatherInfo) {
        setWeatherData(weatherInfo);
      } else {
        // Fallback to default weather data
        setWeatherData(keralaWeatherData['Ernakulam']);
      }
      setWeatherLoading(false);
    }, 1500);
  };

  const clearWeatherSearch = () => {
    setWeatherSearchQuery('');
    setSelectedWeatherDistrict(null);
    setShowWeatherSearchResults(false);
    setWeatherData(null);
    setWeatherLoading(false);
  };

  // Shelter search functionality
  const handleShelterSearch = (query) => {
    console.log('Shelter search query:', query);
    setShelterSearchQuery(query);
    if (query.trim()) {
      const filtered = keralaDistricts.filter(district => 
        district.name.toLowerCase().includes(query.toLowerCase()) ||
        district.shortName.toLowerCase().includes(query.toLowerCase())
      );
      console.log('Filtered shelter districts:', filtered);
      setShowShelterSearchResults(filtered.length > 0);
    } else {
      setShowShelterSearchResults(false);
      setSelectedShelterDistrict(null);
    }
  };

  const handleShelterDistrictSelect = async (district) => {
    console.log('Shelter district selected:', district.name);
    setSelectedShelterDistrict(district);
    setShowShelterSearchResults(false);
    setShelterSearchQuery(district.name);
    setShelterLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const shelterInfo = keralaShelterData[district.name];
      if (shelterInfo) {
        setShelterData(shelterInfo);
      } else {
        // Fallback to default shelter data
        setShelterData(keralaShelterData['Ernakulam']);
      }
      setShelterLoading(false);
    }, 1500);
  };

  const clearShelterSearch = () => {
    setShelterSearchQuery('');
    setSelectedShelterDistrict(null);
    setShowShelterSearchResults(false);
    setShelterData(null);
    setShelterLoading(false);
  };

  const navItems = [
    { name: 'home', label: 'Home', icon: '🏠' },
    { name: 'alerts', label: 'Alerts', icon: '🚨' },
    { name: 'map', label: 'Map', icon: '🗺️' },
    { name: 'sos', label: 'SOS', icon: '🆘' },
    { name: 'weather', label: 'Weather', icon: '🌧️' },
    { name: 'shelters', label: 'Shelters', icon: '🏘️' },
    { name: 'guide', label: 'Guide', icon: '📘' },
    { name: 'profile', label: 'Profile', icon: '👤' },
  ];

  const currentDistrictInfo = keralaDistricts.find(district =>
    district.name === user?.district || district.shortName === user?.district
  );

  // No loading screen - dashboard appears instantly

  if (error) {
    return (
      <div className="db-wrapper">
        <div className="error-container">
          <div className="error-message">⚠️ {error}</div>
          <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="db-wrapper">
      {/* TOPBAR */}
      <div className="topbar">
        <div className="tb-left">
          <div className="tb-brand">🛡️ Kerala Disaster Management</div>
          <div className="tb-pills">
            <div className="pill pill-green">✓ Connected</div>
            <div className="pill pill-orange">⚠ {alerts.length} Alerts</div>
            <div className="pill pill-blue">ℹ Live</div>
          </div>
        </div>
        <div className="tb-center">
          <div className="tb-clock">🕐 {liveTime}</div>
        </div>
        <div className="tb-right">
          <button className="tb-back" onClick={() => navigate('/login')} title="Back to Login">← Back</button>
          <div className="tb-notification">
            <span className="tb-bell">🔔</span>
            <span className="tb-badge">{alerts.length}</span>
          </div>
          <button
            type="button"
            className="tb-sos"
            onClick={() => {
              setActivePanel('sos');
              setShowSOS(false);
            }}
          >🆘 SOS</button>
        </div>
      </div>

      <div className="db-body">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sb-nav">
            {navItems.map((item) => (
              <div
                key={item.name}
                className={`sb-item ${activePanel === item.name ? 'active' : ''}`}
                onClick={() => setActivePanel(item.name)}
              >
                <span className="sb-icon">{item.icon}</span>
                <span className="sb-label">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="sb-districts">
            <div className="sbd-title">District Risk Status</div>
            {districts.map((d) => (
              <div key={d.name} className={`sbd-item sbd-${d.risk}`}>
                <span className="sbd-dot"></span>
                <span className="sbd-name">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main">
          {/* HOME PANEL */}
          {activePanel === 'home' && (
            <div className="panel active">
              {/* Hero */}
              <div className="home-hero">
                <div>
                  <div className="hh-loc">📍 Your Location</div>
                  <div className="hh-city">{user?.district || 'Kerala'}</div>
                </div>
                <div className="hh-icon">{currentWeather?.icon || keralaWeatherData[user?.district || 'Ernakulam']?.current?.icon || '🌧️'}</div>
                <div className="hh-temp">{currentWeather?.temperature || keralaWeatherData[user?.district || 'Ernakulam']?.current?.temperature || 28}°C</div>
                <div className="hh-desc">{currentWeather?.condition || keralaWeatherData[user?.district || 'Ernakulam']?.current?.condition || 'Loading...'} · {weatherFetching ? 'Fetching real-time data...' : 'Southwest Monsoon Active'}</div>
              </div>

              {/* Stats Grid - Location Based */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-val">
                    {alerts.filter(a => 
                      a.status === 'published' && 
                      (a.district === user?.district || a.placeName?.includes(user?.district))
                    ).length || alerts.filter(a => a.status === 'published').length}
                  </div>
                  <div className="stat-lbl">Active Alerts in {user?.district || 'Kerala'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val">
                    {shelters.filter(s => 
                      s.district === user?.district || s.placeName?.includes(user?.district)
                    ).reduce((sum, s) => sum + (s.capacity || 0), 0) || 
                    keralaShelterData[user?.district]?.totalCapacity || 0}
                  </div>
                  <div className="stat-lbl">Shelter Capacity in {user?.district || 'Kerala'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val">
                    {places.filter(p => 
                      p.riskLevel === 'HIGH' && 
                      (p.district === user?.district || p.name?.includes(user?.district))
                    ).length || 
                    (keralaDistricts.find(d => d.name === user?.district)?.riskLevel === 'high' ? 3 : 
                     keralaDistricts.find(d => d.name === user?.district)?.riskLevel === 'moderate' ? 2 : 1)}
                  </div>
                  <div className="stat-lbl">Risk Score ({keralaDistricts.find(d => d.name === user?.district)?.riskLevel || 'moderate'})</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val">{shelters.filter(s => s.district === user?.district).length || keralaShelterData[user?.district]?.shelters?.length || 3}</div>
                  <div className="stat-lbl">Active Shelters in {user?.district || 'Kerala'}</div>
                </div>
              </div>

              {/* Live Alerts Section */}
              <div className="live-alerts-section" style={{marginTop: '20px', marginBottom: '20px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                  <span style={{fontSize: '20px'}}>🔴</span>
                  <span style={{fontSize: '16px', fontWeight: '700', color: 'var(--forest)'}}>
                    Live Alerts for {user?.district || 'Kerala'}
                  </span>
                  <span style={{fontSize: '12px', color: '#666', marginLeft: 'auto'}}>
                    {alerts.filter(a => 
                      a.status === 'published' && 
                      (a.district === user?.district || a.placeName?.includes(user?.district))
                    ).length} active alert(s)
                  </span>
                </div>
                <div className="alerts-list" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  {alerts.filter(a => 
                    a.status === 'published' && 
                    (a.district === user?.district || a.placeName?.includes(user?.district))
                  ).length > 0 ? (
                    alerts.filter(a => 
                      a.status === 'published' && 
                      (a.district === user?.district || a.placeName?.includes(user?.district))
                    ).slice(0, 5).map((alert) => (
                      <div 
                        key={alert._id} 
                        className="alert-item"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 15px',
                          background: alert.severity?.toLowerCase() === 'high' || alert.severity?.toLowerCase() === 'critical' 
                            ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' 
                            : alert.severity?.toLowerCase() === 'moderate'
                            ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                            : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                          borderRadius: '10px',
                          borderLeft: `4px solid ${
                            alert.severity?.toLowerCase() === 'high' || alert.severity?.toLowerCase() === 'critical' 
                              ? '#dc2626' 
                              : alert.severity?.toLowerCase() === 'moderate'
                              ? '#d97706'
                              : '#059669'
                          }`,
                        }}
                      >
                        <span style={{fontSize: '24px'}}>
                          {alert.type?.toLowerCase().includes('flood') ? '🌊' : 
                           alert.type?.toLowerCase().includes('landslide') ? '⛰️' :
                           alert.type?.toLowerCase().includes('cyclone') ? '🌀' :
                           alert.type?.toLowerCase().includes('fire') ? '🔥' :
                           alert.type?.toLowerCase().includes('earthquake') ? '🌋' : '⚠️'}
                        </span>
                        <div style={{flex: 1}}>
                          <div style={{fontWeight: '600', fontSize: '14px', color: '#1f2937'}}>
                            {alert.title}
                          </div>
                          <div style={{fontSize: '12px', color: '#6b7280', marginTop: '2px'}}>
                            {alert.placeName || alert.district || user?.district} • {alert.type} • {new Date(alert.createdAt || alert.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '11px', 
                          fontWeight: '700', 
                          padding: '4px 10px', 
                          borderRadius: '20px',
                          background: alert.severity?.toLowerCase() === 'high' || alert.severity?.toLowerCase() === 'critical' 
                            ? '#dc2626' 
                            : alert.severity?.toLowerCase() === 'moderate'
                            ? '#d97706'
                            : '#059669',
                          color: 'white',
                          textTransform: 'uppercase'
                        }}>
                          {alert.severity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      borderRadius: '10px',
                      color: '#059669'
                    }}>
                      <span style={{fontSize: '24px'}}>✅</span>
                      <div style={{fontWeight: '600', marginTop: '8px'}}>No active alerts in {user?.district || 'your district'}</div>
                      <div style={{fontSize: '12px', marginTop: '4px'}}>Stay safe and keep monitoring</div>
                    </div>
                  )}
                </div>
              </div>

              {/* District Search Section */}
              <div className="district-search-section">
                <div className="search-header">
                  <div className="search-title">🔍 Search Kerala Districts</div>
                  <div className="search-sub">Get detailed information about any district in Kerala</div>
                </div>
                <div className="search-container">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search district name or short code (e.g., TVM, EKM)..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => searchQuery && setShowSearchResults(true)}
                    />
                    {searchQuery && (
                      <button className="search-clear-btn" onClick={clearSearch}>✕</button>
                    )}
                  </div>
                  <button className="search-btn" onClick={() => handleSearch(searchQuery)}>
                    🔍 Search
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="search-results">
                    {keralaDistricts
                      .filter(district => 
                        district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        district.shortName.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                      .map((district) => (
                        <div
                          key={district.name}
                          className="search-result-item"
                          onClick={() => handleDistrictSelect(district)}
                        >
                          <div className="result-name">{district.name}</div>
                          <div className="result-details">
                            <span className="result-code">{district.shortName}</span>
                            <span className={`result-risk risk-${district.riskLevel}`}>
                              {district.riskLevel.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                
                {/* Debug: Always show some results for testing */}
                {searchQuery && searchQuery.length > 0 && (
                  <div className="search-results" style={{border: '2px solid red'}}>
                    <div className="search-result-item" onClick={() => handleDistrictSelect(keralaDistricts[0])}>
                      <div className="result-name">TEST: {keralaDistricts[0].name}</div>
                      <div className="result-details">
                        <span className="result-code">{keralaDistricts[0].shortName}</span>
                        <span className={`result-risk risk-${keralaDistricts[0].riskLevel}`}>
                          {keralaDistricts[0].riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="search-result-item" onClick={() => handleDistrictSelect(keralaDistricts[1])}>
                      <div className="result-name">TEST: {keralaDistricts[1].name}</div>
                      <div className="result-details">
                        <span className="result-code">{keralaDistricts[1].shortName}</span>
                        <span className={`result-risk risk-${keralaDistricts[1].riskLevel}`}>
                          {keralaDistricts[1].riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected District Current Situation */}
                {selectedDistrict && (
                  <div className="district-details">
                    <div className="district-header">
                      <div className="district-info">
                        <h3 className="district-name">{selectedDistrict.name} - Current Situation</h3>
                        <div className="district-meta">
                          <span className="district-code">{selectedDistrict.shortName}</span>
                          <span className={`district-risk risk-${selectedDistrict.riskLevel}`}>
                            {selectedDistrict.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                      </div>
                      <button className="district-close" onClick={clearSearch}>✕</button>
                    </div>

                    {districtLoading ? (
                      <div className="district-loading">
                        <div className="loading-spinner">
                          <div className="spinner-icon">�</div>
                          <div>Loading current situation for {selectedDistrict.name}...</div>
                        </div>
                      </div>
                    ) : districtData ? (
                      <>
                        {/* Current Status Stats */}
                        <div className="district-status-grid">
                          <div className="status-card">
                            <div className="status-val">{districtData.alerts.length}</div>
                            <div className="status-lbl">🚨 Active Alerts</div>
                          </div>
                          <div className="status-card">
                            <div className="status-val">{districtData.sosRequests}</div>
                            <div className="status-lbl">🆘 SOS Requests</div>
                          </div>
                          <div className="status-card">
                            <div className="status-val">{districtData.totalShelterCapacity}</div>
                            <div className="status-lbl">🏘️ Shelter Capacity</div>
                          </div>
                          <div className="status-card">
                            <div className="status-val">{districtData.highRiskAreas}</div>
                            <div className="status-lbl">⚠️ High Risk Areas</div>
                          </div>
                        </div>

                        {/* Recent Alerts */}
                        <div className="district-section">
                          <div className="section-title">🚨 Recent Alerts in {selectedDistrict.name}</div>
                          {districtData.alerts.length > 0 ? (
                            <div className="alerts-list">
                              {districtData.alerts.slice(0, 3).map((alert) => (
                                <div key={alert._id} className="alert-item">
                                  <div className="alert-severity severity-{alert.severity?.toLowerCase()}">
                                    {alert.severity?.toUpperCase() || 'MODERATE'}
                                  </div>
                                  <div className="alert-content">
                                    <div className="alert-title">{alert.title}</div>
                                    <div className="alert-desc">{alert.description}</div>
                                    <div className="alert-time">
                                      {new Date(alert.createdAt || alert.timestamp).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-data">
                              <div className="no-data-icon">✅</div>
                              <div className="no-data-text">No active alerts in {selectedDistrict.name}</div>
                            </div>
                          )}
                        </div>

                        {/* Available Shelters */}
                        <div className="district-section">
                          <div className="section-title">🏘️ Available Shelters</div>
                          {districtData.shelters.length > 0 ? (
                            <div className="shelters-grid">
                              {districtData.shelters.slice(0, 4).map((shelter) => (
                                <div key={shelter._id} className="shelter-item">
                                  <div className="shelter-name">{shelter.name}</div>
                                  <div className="shelter-location">📍 {shelter.district || shelter.placeName}</div>
                                  <div className="shelter-occupancy">
                                    <span>Occupancy: {shelter.currentOccupancy || 0}/{shelter.capacity || 100}</span>
                                    <div className="occupancy-bar">
                                      <div 
                                        className="occupancy-fill" 
                                        style={{
                                          width: `${((shelter.currentOccupancy || 0) / (shelter.capacity || 100)) * 100}%`,
                                          background: (shelter.currentOccupancy || 0) >= (shelter.capacity || 100) ? 'var(--red)' : 
                                                   (shelter.currentOccupancy || 0) / (shelter.capacity || 100) > 0.7 ? 'var(--amber)' : 'var(--green-text)'
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="shelter-contact">📞 {shelter.phone || 'N/A'}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-data">
                              <div className="no-data-icon">🏘️</div>
                              <div className="no-data-text">No shelters registered in {selectedDistrict.name}</div>
                            </div>
                          )}
                        </div>

                        {/* High Risk Areas */}
                        {districtData.highRiskAreas > 0 && (
                          <div className="district-section">
                            <div className="section-title">⚠️ High Risk Areas</div>
                            <div className="risk-areas-list">
                              {districtData.places.filter(p => p.riskLevel === 'HIGH').slice(0, 3).map((place, index) => (
                                <div key={index} className="risk-area-item">
                                  <div className="risk-area-name">{place.name}</div>
                                  <div className="risk-area-level">HIGH RISK</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Emergency Contacts */}
                        <div className="district-section">
                          <div className="section-title">📞 Emergency Contacts</div>
                          <div className="emergency-contacts">
                            <div className="contact-row">
                              <span className="contact-label">Control Room:</span>
                              <span className="contact-value">{selectedDistrict.emergencyContacts.controlRoom}</span>
                            </div>
                            <div className="contact-row">
                              <span className="contact-label">District Collector:</span>
                              <span className="contact-value">{selectedDistrict.emergencyContacts.collector}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="no-data">
                        <div className="no-data-icon">⚠️</div>
                        <div className="no-data-text">Unable to load current situation data for {selectedDistrict.name}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* District Chips */}
              <div className="dist-chips">
                {districts.map((d) => (
                  <div key={d.name} className={`chip chip-${d.risk}`}>{d.name}</div>
                ))}
              </div>

              {/* 2-Column Layout */}
              <div className="home-grid">
                <div className="home-left">
                  <div style={{fontSize:'12.5px',fontWeight:'700',color:'var(--forest)',marginBottom:'10px'}}>Active Alerts</div>
                  {alertsData.slice(0, 3).map((a) => (
                    <div key={a.id} className={`af-row ${getSeverityClass(a.severity)}`}>
                      <div className="af-icon">⚠️</div>
                      <div className="af-body">
                        <div className="af-title">{a.title}</div>
                        <div className="af-desc">{a.desc}</div>
                        <div className="af-tags">{a.tags.map(t => <span key={t} className="af-tag">{t}</span>)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="home-right">
                  {/* Weather Mini - Location Based */}
                  <div className="card">
                    <div className="card-hdr"><span className="card-title">🌤️ {user?.district || 'Kerala'} Weather</span></div>
                    <div style={{padding:'12px 14px',fontSize:'28px',fontWeight:'700',color:'var(--forest)'}}>
                      {currentWeather?.temperature || keralaWeatherData[user?.district || 'Ernakulam']?.current?.temperature || 28}°C
                    </div>
                    <div style={{padding:'0 14px 12px',fontSize:'12px',color:'var(--muted)'}}>
                      {currentWeather?.condition || keralaWeatherData[user?.district || 'Ernakulam']?.current?.condition || 'Loading...'}, Humidity {currentWeather?.humidity || keralaWeatherData[user?.district || 'Ernakulam']?.current?.humidity || 88}%
                    </div>
                  </div>

                  {/* SOS Card - Location Based */}
                  <div className="card">
                    <div className="card-hdr"><span className="card-title">🚨 SOS in {user?.district || 'Your Area'}</span></div>
                    <div style={{padding:'12px 14px'}}>
                      <div style={{fontSize:'24px',fontWeight:'700',color:'var(--red)',marginBottom:'4px'}}>
                        {alerts.filter(a => 
                          a.status === 'published' && 
                          a.type?.toLowerCase().includes('sos') &&
                          (a.district === user?.district || a.placeName?.includes(user?.district))
                        ).length || 0}
                      </div>
                      <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px'}}>
                        active SOS request(s) in {user?.district || 'your district'}
                      </div>
                      <button 
                        onClick={() => setActivePanel('sos')}
                        style={{width:'100%',padding:'8px',background:'var(--red)',color:'white',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'11px',fontWeight:'700'}}
                      >
                        View & Respond
                      </button>
                    </div>
                  </div>

                  {/* Helplines */}
                  <div className="card">
                    <div className="card-hdr"><span className="card-title">📞 Emergency Helplines</span></div>
                    <div style={{padding:'10px 14px 14px'}}>
                      <div className="hl-row"><span>Fire & Rescue</span><span style={{fontWeight:'700'}}>101</span></div>
                      <div className="hl-row"><span>Ambulance</span><span style={{fontWeight:'700'}}>100</span></div>
                      <div className="hl-row"><span>Police</span><span style={{fontWeight:'700'}}>108</span></div>
                      <div className="hl-row"><span>KSNDMC Shelter</span><span style={{fontWeight:'700'}}>1077</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Column Bottom - Location Based */}
              <div className="home-bottom">
                <div>
                  <div className="card">
                    <div className="card-hdr"><span className="card-title">🏘️ Shelters in {user?.district || 'Kerala'}</span></div>
                    <div style={{padding:'10px 14px'}}>
                      {(shelters.filter(s => s.district === user?.district).length > 0 
                        ? shelters.filter(s => s.district === user?.district).slice(0, 3)
                        : keralaShelterData[user?.district]?.shelters?.slice(0, 3) || []
                      ).map((s, idx) => (
                        <div key={s._id || s.id || idx} className="hl-row" style={{marginBottom: '8px', padding: '6px 0', borderBottom: idx < 2 ? '1px solid #eee' : 'none'}}>
                          <div>
                            <div style={{fontWeight: '600', fontSize: '13px'}}>{s.name}</div>
                            <div style={{fontSize: '11px', color: 'var(--muted)'}}>📍 {s.location || s.district} • {s.distance || `${(idx + 1) * 1.5} km`}</div>
                            <div style={{fontSize: '10px', color: s.currentOccupancy >= s.capacity ? 'var(--red)' : 'var(--green-text)'}}>
                              🏠 {s.currentOccupancy || Math.floor(Math.random() * 100)}/{s.capacity} occupied
                            </div>
                          </div>
                          <span style={{fontSize:'11px',color:'var(--green-text)',fontWeight:'600'}}>{s.facilities?.slice(0,2).join(', ') || 'Food, Water'}</span>
                        </div>
                      ))}
                      {(shelters.filter(s => s.district === user?.district).length === 0 && !keralaShelterData[user?.district]) && (
                        <div style={{fontSize: '12px', color: 'var(--muted)', textAlign: 'center', padding: '10px'}}>
                          No shelter data available for {user?.district}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="card">
                    <div className="card-hdr"><span className="card-title">✅ Safety Tips</span></div>
                    <div style={{padding:'10px 14px'}}>
                      <div className="do-row"><div className="do-dot dd-g">✓</div>Keep emergency kit ready</div>
                      <div className="do-row"><div className="do-dot dd-g">✓</div>Know your shelter location</div>
                      <div className="do-row"><div className="do-dot dd-g">✓</div>Monitor weather alerts</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="card">
                    <div className="card-hdr"><span className="card-title">🌊 Risk Zones in {user?.district || 'Kerala'}</span></div>
                    <div style={{padding:'10px 14px'}}>
                      {(places.filter(p => p.riskLevel === 'HIGH' && (p.district === user?.district || p.name?.includes(user?.district))).length > 0 
                        ? places.filter(p => p.riskLevel === 'HIGH' && (p.district === user?.district || p.name?.includes(user?.district))).slice(0, 3)
                        : keralaDistricts.find(d => d.name === user?.district)?.majorRisks?.slice(0, 3).map((risk, idx) => ({ name: risk, riskLevel: 'HIGH', _id: idx })) || [{ name: 'River Flooding', riskLevel: 'HIGH' }, { name: 'Urban Flooding', riskLevel: 'MODERATE' }]
                      ).map((place, idx) => (
                        <div key={place._id || idx} className="hl-row" style={{marginBottom: '6px'}}>
                          <span>{place.name}</span>
                          <span style={{color: place.riskLevel === 'HIGH' ? 'var(--red)' : 'var(--amber)', fontWeight:'700', fontSize: '11px'}}>
                            {place.riskLevel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ALERTS PANEL */}
          {activePanel === 'alerts' && (
            <div className="panel active">
              <div className="filter-bar">
                <button className={`fbtn ${alertFilter === 'all' ? 'active' : ''}`} onClick={() => setAlertFilter('all')}>All</button>
                <button className={`fbtn ${alertFilter === 'critical' ? 'active' : ''}`} onClick={() => setAlertFilter('critical')}>Critical</button>
                <button className={`fbtn ${alertFilter === 'high' ? 'active' : ''}`} onClick={() => setAlertFilter('high')}>High</button>
                <button className={`fbtn ${alertFilter === 'moderate' ? 'active' : ''}`} onClick={() => setAlertFilter('moderate')}>Moderate</button>
              </div>
              {alertsData.length > 0 ? (
                alertsData.map((a) => (
                  <div key={a.id} className={`af-row ${getSeverityClass(a.severity)}`}>
                    <div className="af-icon">⚠️</div>
                    <div className="af-body">
                      <div className="af-title">{a.title}</div>
                      <div className="af-desc">{a.desc}</div>
                      <div className="af-tags">{a.tags.map(t => <span key={t} className="af-tag">{t}</span>)}</div>
                      <div style={{fontSize:'11px',color:'var(--muted)',marginTop:'6px'}}>{a.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '40px 20px', color: 'var(--muted)'}}>
                  <div style={{fontSize: '36px', marginBottom: '10px'}}>✓</div>
                  <div style={{fontSize: '14px', fontWeight: '600'}}>No {alertFilter} alerts</div>
                  <div style={{fontSize: '12px', marginTop: '5px'}}>All clear in your area</div>
                </div>
              )}
            </div>
          )}

          {/* MAP PANEL */}
          {activePanel === 'map' && (
            <div className="panel active">
              <div className="map-controls">
                <label className="map-toggle">
                  <input
                    type="checkbox"
                    checked={showFloodZones}
                    onChange={(e) => setShowFloodZones(e.target.checked)}
                  /> Flood Zones
                </label>
                <label className="map-toggle">
                  <input
                    type="checkbox"
                    checked={showShelters}
                    onChange={(e) => setShowShelters(e.target.checked)}
                  /> Shelters
                </label>
                <label className="map-toggle">
                  <input
                    type="checkbox"
                    checked={showSOSPoints}
                    onChange={(e) => setShowSOSPoints(e.target.checked)}
                  /> SOS Points
                </label>
                <label className="map-toggle">
                  <input
                    type="checkbox"
                    checked={showWeather}
                    onChange={(e) => setShowWeather(e.target.checked)}
                  /> Weather
                </label>
                <label className="map-toggle">
                  <input
                    type="checkbox"
                    checked={showDams}
                    onChange={(e) => setShowDams(e.target.checked)}
                  /> Dams
                </label>
              </div>
              <div className="map-placeholder">
                <DashboardMap
                  alerts={alerts}
                  shelters={shelters}
                  userDistrict={user?.district}
                  currentWeather={currentWeather}
                  showFloodZones={showFloodZones}
                  showShelters={showShelters}
                  showSOSPoints={showSOSPoints}
                  showWeather={showWeather}
                  showDams={showDams}
                />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',fontSize:'12px',padding:'12px',background:'var(--cream)',borderRadius:'8px'}}>
                <div><div style={{fontWeight:'700'}}>{alerts.filter(a => a.status === 'published').length || 0}</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Active Alerts</div></div>
                <div><div style={{fontWeight:'700'}}>{Math.max(0, Math.floor(Math.random() * 6))}</div><div style={{fontSize:'11px',color:'var(--muted)'}}>SOS Requests</div></div>
                <div><div style={{fontWeight:'700'}}>{shelters.length || sheltersData.length || 0}</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Shelters</div></div>
                <div><div style={{fontWeight:'700'}}>{Math.max(0, Math.floor(Math.random() * 4))}</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Dams</div></div>
              </div>
            </div>
          )}

          {/* SOS PANEL */}
          {activePanel === 'sos' && (
            <div className="panel active">
              <div style={{textAlign:'center',marginBottom:'30px'}}>
                <button onClick={() => setShowSOS(true)} style={{width:'200px',height:'200px',borderRadius:'50%',background:'var(--red)',border:'none',color:'white',fontSize:'80px',cursor:'pointer',boxShadow:'0 8px 32px rgba(229, 57, 53, 0.3)',transition:'all 0.3s'}}>🆘</button>
                <div style={{fontSize:'24px',fontWeight:'700',marginTop:'20px',color:'var(--forest)'}}>Emergency SOS</div>
                <div style={{fontSize:'13px',color:'var(--muted)'}}>Tap the button above to send immediate SOS alert</div>
                <button
                  type="button"
                  onClick={() => setShowSOS(true)}
                  style={{
                    marginTop: '18px',
                    padding: '12px 22px',
                    borderRadius: '999px',
                    border: 'none',
                    background: 'var(--red)',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 8px 18px rgba(229, 57, 53, 0.25)'
                  }}
                >View SOS Details</button>
              </div>

              <div className="sos-steps">
                <div style={{fontSize:'12.5px',fontWeight:'700',color:'var(--forest)',marginBottom:'10px'}}>How It Works</div>
                {[
                  '📍 Your location is instantly pinpointed and sent to rescue teams',
                  '🚨 All nearby rescue teams and shelters are notified immediately',
                  '👥 Other app users nearby are alerted to assist if possible',
                  '📞 Your emergency contact and KSNDMC are automatically called',
                  '⏱️ All response times and teams are tracked in real-time'
                ].map((step, i) => (
                  <div key={i} className="sos-step">{step}</div>
                ))}
              </div>

              <div className="card" style={{marginBottom:'0'}}>
                <div className="card-hdr"><span className="card-title">📞 Live SOS Requests</span></div>
                <div style={{padding:'10px 14px'}}>
                  <div className="sos-req-row"><div><div>Flood Rescue - Wayanad</div><div style={{fontSize:'11px',color:'var(--muted)'}}>10 teams responding</div></div><span style={{color:'var(--green-text)',fontWeight:'700'}}>Active</span></div>
                  <div className="sos-req-row"><div><div>Landslide - Idukki</div><div style={{fontSize:'11px',color:'var(--muted)'}}>3 teams en route</div></div><span style={{color:'var(--green-text)',fontWeight:'700'}}>Responding</span></div>
                </div>
              </div>
            </div>
          )}

          {/* WEATHER PANEL */}
          {activePanel === 'weather' && (
            <div className="panel active">
              {/* Weather Search Section */}
              <div className="weather-search-section">
                <div className="search-header">
                  <div className="search-title">🌧️ Search Weather by District</div>
                  <div className="search-sub">Get detailed weather information for any Kerala district</div>
                </div>
                <div className="search-container">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search district for weather (e.g., TVM, EKM, Kozhikode)..."
                      value={weatherSearchQuery}
                      onChange={(e) => handleWeatherSearch(e.target.value)}
                      onFocus={() => weatherSearchQuery && setShowWeatherSearchResults(true)}
                    />
                    {weatherSearchQuery && (
                      <button className="search-clear-btn" onClick={clearWeatherSearch}>✕</button>
                    )}
                  </div>
                  <button className="search-btn" onClick={() => handleWeatherSearch(weatherSearchQuery)}>
                    🔍 Search
                  </button>
                </div>

                {/* Weather Search Results */}
                {showWeatherSearchResults && (
                  <div className="search-results">
                    {keralaDistricts
                      .filter(district => 
                        district.name.toLowerCase().includes(weatherSearchQuery.toLowerCase()) ||
                        district.shortName.toLowerCase().includes(weatherSearchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                      .map((district) => (
                        <div
                          key={district.name}
                          className="search-result-item"
                          onClick={() => handleWeatherDistrictSelect(district)}
                        >
                          <div className="result-name">{district.name}</div>
                          <div className="result-details">
                            <span className="result-code">{district.shortName}</span>
                            <span className={`result-risk risk-${district.riskLevel}`}>
                              {district.riskLevel.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                
                {/* Debug: Always show some weather results for testing */}
                {weatherSearchQuery && weatherSearchQuery.length > 0 && (
                  <div className="search-results" style={{border: '2px solid red'}}>
                    <div className="search-result-item" onClick={() => handleWeatherDistrictSelect(keralaDistricts[0])}>
                      <div className="result-name">TEST: {keralaDistricts[0].name}</div>
                      <div className="result-details">
                        <span className="result-code">{keralaDistricts[0].shortName}</span>
                        <span className={`result-risk risk-${keralaDistricts[0].riskLevel}`}>
                          {keralaDistricts[0].riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="search-result-item" onClick={() => handleWeatherDistrictSelect(keralaDistricts[1])}>
                      <div className="result-name">TEST: {keralaDistricts[1].name}</div>
                      <div className="result-details">
                        <span className="result-code">{keralaDistricts[1].shortName}</span>
                        <span className={`result-risk risk-${keralaDistricts[1].riskLevel}`}>
                          {keralaDistricts[1].riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected District Weather Display */}
                {selectedWeatherDistrict && (
                  <div className="weather-details">
                    <div className="weather-header">
                      <div className="weather-info">
                        <h3 className="weather-district-name">{selectedWeatherDistrict.name} Weather</h3>
                        <div className="weather-district-meta">
                          <span className="district-code">{selectedWeatherDistrict.shortName}</span>
                          <span className={`district-risk risk-${selectedWeatherDistrict.riskLevel}`}>
                            {selectedWeatherDistrict.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                      </div>
                      <button className="district-close" onClick={clearWeatherSearch}>✕</button>
                    </div>

                    {weatherLoading ? (
                      <div className="weather-loading">
                        <div className="loading-spinner">
                          <div className="spinner-icon">🔄</div>
                          <div>Loading weather data for {selectedWeatherDistrict.name}...</div>
                        </div>
                      </div>
                    ) : weatherData ? (
                      <>
                        {/* Debug: Show weather data info */}
                        <div style={{background: '#e8f5e8', padding: '12px', marginBottom: '15px', border: '2px solid #4a7c59', borderRadius: '8px'}}>
                          <div style={{fontWeight: 'bold', color: '#1f2937'}}>🌧️ WEATHER RESULTS FOR {selectedWeatherDistrict.name.toUpperCase()}</div>
                          <div>Temperature: {weatherData.current.temperature}°C | Condition: {weatherData.current.condition}</div>
                        </div>
                        {/* Current Weather */}
                        <div className="weather-hero">
                          <div style={{background: '#ffffff', padding: '16px', marginBottom: '15px', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'}}>
                            <div style={{fontWeight: '700', color: '#111827', marginBottom: '8px'}}>🌧️ WEATHER OVERVIEW</div>
                            <div style={{color: '#334155', marginBottom: '4px'}}>Location: {selectedWeatherDistrict.name}</div>
                            <div style={{color: '#334155', marginBottom: '4px'}}>Temperature: {weatherData.current.temperature}°C</div>
                            <div style={{color: '#334155'}}>Condition: {weatherData.current.condition}</div>
                          </div>
                          <div className="wh-top">
                            <div>
                              <div className="wh-loc-s">📍 {selectedWeatherDistrict.name}</div>
                              <div className="wh-city">Current Conditions</div>
                            </div>
                            <div className="wh-icon">{weatherData.current.icon}</div>
                          </div>
                          <div className="wh-temp">{weatherData.current.temperature}°C</div>
                          <div className="wh-desc">
                            {weatherData.current.condition} · {weatherData.current.alertText} · IMD Alert: {weatherData.current.alertLevel.toUpperCase()}
                          </div>
                          <div className="wh-grid">
                            <div className="wht"><div className="wht-l">Humidity</div><div className="wht-v">{weatherData.current.humidity}%</div></div>
                            <div className="wht"><div className="wht-l">Wind Speed</div><div className="wht-v">{weatherData.current.windSpeed} km/h</div></div>
                            <div className="wht"><div className="wht-l">Rainfall Today</div><div className="wht-v">{weatherData.current.rainfall} mm</div></div>
                            <div className="wht"><div className="wht-l">Visibility</div><div className="wht-v">{weatherData.current.visibility} km</div></div>
                            <div className="wht"><div className="wht-l">Pressure</div><div className="wht-v">{weatherData.current.pressure} hPa</div></div>
                            <div className="wht"><div className="wht-l">Feels Like</div><div className="wht-v">{weatherData.current.feelsLike}°C</div></div>
                            <div className="wht"><div className="wht-l">UV Index</div><div className="wht-v">{weatherData.current.uvIndex}</div></div>
                          </div>
                        </div>

                        {/* Weather Alerts */}
                        {weatherData.alerts && weatherData.alerts.length > 0 && (
                          <div className="weather-alerts-section">
                            <div className="section-title">🚨 Weather Alerts</div>
                            <div className="weather-alerts-list">
                              {weatherData.alerts.map((alert, index) => (
                                <div key={index} className={`weather-alert-item alert-${alert.severity.toLowerCase()}`}>
                                  <div className="alert-type">{alert.type}</div>
                                  <div className="alert-severity">{alert.severity}</div>
                                  <div className="alert-time">{alert.time}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 5-Day Forecast */}
                        <div className="forecast-section">
                          <div className="section-title">📅 5-Day Forecast</div>
                          <div className="forecast-row">
                            {weatherData.forecast.map((f, i) => (
                              <div key={i} className={`fc-card ${i === 0 ? 'today' : ''}`}>
                                <div className="fc-day">{f.day}</div>
                                <div className="fc-icon">{f.icon}</div>
                                <div className="fc-hi">{f.high}°</div>
                                <div className="fc-lo">{f.low}°</div>
                                <div className="fc-rain">💧 {f.rain}mm</div>
                                <div className="fc-condition">{f.condition}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="no-data">
                        <div className="no-data-icon">🌧️</div>
                        <div className="no-data-text">Unable to load weather data for {selectedWeatherDistrict.name}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Default Weather Display (when no district selected) */}
              {!selectedWeatherDistrict && (
                <>
                  <div className="weather-hero">
                    <div className="wh-top">
                      <div>
                        <div className="wh-loc-s">📍 Your Location</div>
                        <div className="wh-city">Kochi, Ernakulam</div>
                      </div>
                      <div className="wh-icon">🌧️</div>
                    </div>
                    <div className="wh-temp">28°C</div>
                    <div className="wh-desc">Heavy Showers · Southwest Monsoon Active · IMD Alert: Orange</div>
                    <div className="wh-grid">
                      <div className="wht"><div className="wht-l">Humidity</div><div className="wht-v">88%</div></div>
                      <div className="wht"><div className="wht-l">Wind Speed</div><div className="wht-v">34 km/h</div></div>
                      <div className="wht"><div className="wht-l">Rainfall Today</div><div className="wht-v">87 mm</div></div>
                      <div className="wht"><div className="wht-l">Visibility</div><div className="wht-v">3.2 km</div></div>
                    </div>
                  </div>

                  <div style={{fontSize:'12.5px',fontWeight:'700',color:'var(--forest)',marginBottom:'10px',marginTop:'20px'}}>5-Day Forecast</div>
                  <div className="forecast-row">
                    {[
                      {day:'Today', icon:'🌧️', hi:29, lo:23, rain:87},
                      {day:'Saturday', icon:'⛈️', hi:27, lo:22, rain:120},
                      {day:'Sunday', icon:'🌧️', hi:28, lo:23, rain:65},
                      {day:'Monday', icon:'🌦️', hi:30, lo:24, rain:30},
                      {day:'Tuesday', icon:'⛅', hi:31, lo:25, rain:10}
                    ].map((f, i) => (
                      <div key={i} className={`fc-card ${i === 0 ? 'today' : ''}`}>
                        <div className="fc-day">{f.day}</div>
                        <div className="fc-icon">{f.icon}</div>
                        <div className="fc-hi">{f.hi}°</div>
                        <div className="fc-lo">{f.lo}°</div>
                        <div className="fc-rain">💧 {f.rain}mm</div>
                      </div>
                    ))}
                  </div>

                  <div className="w-alert-grid">
                    <div className="wa-card">
                      <div className="wa-title">🚨 District Risk Status Today</div>
                      {districts.map((d, i) => (
                        <div key={i} className="wa-row">
                          <span className="wa-dist">{d.name}</span>
                          <span className={`wa-lvl wal-${d.risk === 'high' ? 'r' : d.risk === 'moderate' ? 'o' : d.risk === 'low' ? 'y' : 'g'}`}>
                            {d.risk === 'high' ? 'HIGH' : d.risk === 'moderate' ? 'MODERATE' : d.risk === 'low' ? 'LOW' : 'SAFE'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SHELTERS PANEL */}
          {activePanel === 'shelters' && (
            <div className="panel active">
              {/* Shelter Search Section */}
              <div className="shelter-search-section">
                <div className="search-header">
                  <div className="search-title">🏘️ Search Shelters by District</div>
                  <div className="search-sub">Find emergency shelters in any Kerala district</div>
                </div>
                <div className="search-container">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search district for shelters (e.g., TVM, EKM, Kozhikode)..."
                      value={shelterSearchQuery}
                      onChange={(e) => handleShelterSearch(e.target.value)}
                      onFocus={() => shelterSearchQuery && setShowShelterSearchResults(true)}
                    />
                    {shelterSearchQuery && (
                      <button className="search-clear-btn" onClick={clearShelterSearch}>✕</button>
                    )}
                  </div>
                  <button className="search-btn" onClick={() => handleShelterSearch(shelterSearchQuery)}>
                    🔍 Search
                  </button>
                </div>

                {/* Shelter Search Results */}
                {showShelterSearchResults && (
                  <div className="search-results">
                    {keralaDistricts
                      .filter(district => 
                        district.name.toLowerCase().includes(shelterSearchQuery.toLowerCase()) ||
                        district.shortName.toLowerCase().includes(shelterSearchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                      .map((district) => (
                        <div
                          key={district.name}
                          className="search-result-item"
                          onClick={() => handleShelterDistrictSelect(district)}
                        >
                          <div className="result-name">{district.name}</div>
                          <div className="result-details">
                            <span className="result-code">{district.shortName}</span>
                            <span className={`result-risk risk-${district.riskLevel}`}>
                              {district.riskLevel.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Selected District Shelter Display */}
                {selectedShelterDistrict && (
                  <div className="shelter-details">
                    <div className="shelter-header">
                      <div className="shelter-info">
                        <h3 className="shelter-district-name">{selectedShelterDistrict.name} Shelters</h3>
                        <div className="shelter-district-meta">
                          <span className="district-code">{selectedShelterDistrict.shortName}</span>
                          <span className={`district-risk risk-${selectedShelterDistrict.riskLevel}`}>
                            {selectedShelterDistrict.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                      </div>
                      <button className="district-close" onClick={clearShelterSearch}>✕</button>
                    </div>

                    {shelterLoading ? (
                      <div className="shelter-loading">
                        <div className="loading-spinner">
                          <div className="spinner-icon">🔄</div>
                          <div>Loading shelter data for {selectedShelterDistrict.name}...</div>
                        </div>
                      </div>
                    ) : shelterData ? (
                      <>
                        {/* Debug: Show shelter data info */}
                        <div style={{background: '#e8f5e8', padding: '12px', marginBottom: '15px', border: '2px solid #4a7c59', borderRadius: '8px'}}>
                          <div style={{fontWeight: 'bold', color: '#2d5a3d'}}>🏘️ SHELTER INFORMATION FOR {selectedShelterDistrict.name.toUpperCase()}</div>
                          <div>Total Shelters: {shelterData.emergencyShelters} | Total Capacity: {shelterData.totalCapacity} | Current Occupancy: {shelterData.totalOccupancy}</div>
                        </div>

                        {/* Shelter Statistics */}
                        <div className="shelter-stats">
                          <div className="shelter-stat-card">
                            <div className="stat-number">{shelterData.emergencyShelters}</div>
                            <div className="stat-label">Emergency Shelters</div>
                          </div>
                          <div className="shelter-stat-card">
                            <div className="stat-number">{shelterData.totalCapacity}</div>
                            <div className="stat-label">Total Capacity</div>
                          </div>
                          <div className="shelter-stat-card">
                            <div className="stat-number">{shelterData.totalOccupancy}</div>
                            <div className="stat-label">Current Occupancy</div>
                          </div>
                          <div className="shelter-stat-card">
                            <div className="stat-number">{Math.round((shelterData.totalOccupancy / shelterData.totalCapacity) * 100)}%</div>
                            <div className="stat-label">Occupancy Rate</div>
                          </div>
                        </div>

                        {/* Shelter List */}
                        <div className="shelter-list-header">
                          <h4>🏠 Available Shelters in {selectedShelterDistrict.name}</h4>
                        </div>
                        <div className="shelter-cards-grid">
                          {shelterData.shelters.map((shelter, index) => (
                            <div key={index} className="shelter-card">
                              <div className="shelter-header">
                                <div className="shelter-name">{shelter.name}</div>
                                <div className="shelter-distance">📍 {shelter.distance}</div>
                              </div>
                              <div className="shelter-location">📍 {shelter.location}</div>
                              <div className="shelter-occupancy">
                                <span>Occupancy: {shelter.currentOccupancy}/{shelter.capacity}</span>
                                <div className="occupancy-bar">
                                  <div 
                                    className="occupancy-fill" 
                                    style={{ width: `${(shelter.currentOccupancy / shelter.capacity) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="shelter-contact">
                                <span>📞 {shelter.phone}</span>
                              </div>
                              <div className="shelter-contact-person">
                                <span>👤 {shelter.contactPerson}</span>
                              </div>
                              <div className="shelter-facilities">
                                {shelter.facilities.map((facility, idx) => (
                                  <span key={idx} className="facility-tag">{facility}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="no-data">
                        <div className="no-data-icon">🏘️</div>
                        <div className="no-data-text">Unable to load shelter data for {selectedShelterDistrict.name}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Default Shelter Display (when no district selected) */}
              {!selectedShelterDistrict && (
                <div className="shelter-cards-grid">
                  {sheltersData.length === 0 ? (
                    // Show skeleton loading while shelters data is loading
                    <>
                      <SkeletonShelter />
                      <SkeletonShelter />
                      <SkeletonShelter />
                      <SkeletonShelter />
                    </>
                  ) : (
                    sheltersData.map((s) => (
                      <div key={s.id} className="sh-card">
                        <div className="shc-top">
                          <div><div className="shc-name">{s.name}</div><div className="shc-dist">📍 {s.dist}</div></div>
                          <span className={`shc-sbadge ${getStatusBadge(s.status)}`}>{s.status}</span>
                        </div>
                        <div className="shc-bar-top"><span>Occupancy</span><span>{s.occ} / {s.cap}</span></div>
                        <div className="shc-bar"><div className="shc-fill" style={{width: `${(s.occ/s.cap)*100}%`, background: s.occ === s.cap ? 'var(--red)' : s.occ/s.cap > 0.7 ? 'var(--amber)' : 'var(--green-text)'}}></div></div>
                        <div className="shc-meta"><span>📞 {s.phone}</span><span>🚌 {s.km} km</span></div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* GUIDE PANEL */}
          {activePanel === 'guide' && (
            <div className="panel active">
              <div className="ek-card">
                <div className="ek-title">🎒 Emergency Kit Checklist</div>
                <div className="ek-sub">Keep this ready at all times during monsoon season — you may need to leave in minutes</div>
                <div className="ek-grid">
                  {[
                    {icon:'💧', name:'Drinking Water', qty:'3 litres / person'},
                    {icon:'🍱', name:'Non-Perishable Food', qty:'3 days supply'},
                    {icon:'🔦', name:'Torch + Batteries', qty:'Extra batteries'},
                    {icon:'💊', name:'First Aid Kit', qty:'+ prescription meds'},
                    {icon:'📄', name:'ID Documents', qty:'Waterproof bag'},
                    {icon:'🔋', name:'Power Bank', qty:'10,000 mAh+'},
                    {icon:'📻', name:'Battery Radio', qty:'For official alerts'},
                    {icon:'💰', name:'Emergency Cash', qty:'Small denominations'}
                  ].map((item, i) => (
                    <div key={i} className="ek-item">
                      <div className="ek-icon">{item.icon}</div>
                      <div className="ek-name">{item.name}</div>
                      <div className="ek-qty">{item.qty}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VOLUNTEER SECTION */}
              <div className="volunteer-section">
                <div className="volunteer-header">
                  <div className="volunteer-title">🤝 Volunteer Help Available in {currentDistrict}</div>
                  <div className="volunteer-sub">
                    {approvedLocalVolunteers.length > 0
                      ? 'Contact trained volunteers and team heads in your district for immediate assistance.'
                      : 'Showing demo volunteers available in your current location until local responders are confirmed.'}
                  </div>
                </div>
                <div className="volunteer-grid">
                  {volunteerCards.map((volunteer) => (
                    <div key={volunteer.id} className={`volunteer-card ${volunteer.teamHead ? 'team-head' : ''}`}>
                      <div className="volunteer-top">
                        <div className="volunteer-info">
                          <div className="volunteer-name">
                            {volunteer.name}
                            {volunteer.teamHead && <span className="team-badge">👑 Team Head</span>}
                          </div>
                          <div className="volunteer-district">📍 {volunteer.district}</div>
                        </div>
                        <div className="volunteer-rating">
                          {'⭐'.repeat(Math.min(5, Math.max(1, volunteer.rating)))}
                        </div>
                      </div>
                      <div className="volunteer-details">
                        <div className="volunteer-contact">
                          <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <span>{volunteer.phone}</span>
                          </div>
                          <div className="contact-item">
                            <span className="contact-icon">✉️</span>
                            <span>{volunteer.email}</span>
                          </div>
                        </div>
                        <div className="volunteer-skills">
                          {volunteer.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                        <div className="volunteer-meta">
                          <span className="experience">💼 {volunteer.experience}</span>
                          <span className={`availability ${volunteer.availability === 'Available' ? 'available' : 'busy'}`}>
                            🟢 {volunteer.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="guide-grid">
                {[
                  {title:'Before a Flood — Preparation', icon:'🌊', bg:'var(--blue-bg)', steps:['Monitor water levels in nearby rivers and canals every day during monsoon','Know your nearest evacuation route and relief shelter location in advance','Move valuables, furniture and documents to upper floors','Disconnect all electrical appliances in low-lying areas of your home','Keep emergency kit packed and ready to grab within 2 minutes']},
                  {title:'During a Flood — What To Do', icon:'🌊', bg:'var(--red-bg)', steps:['Move immediately to higher ground — don\'t wait for official order','Never walk, swim or drive through floodwaters — 6 inches can knock you down','Call 1077 or use this app to send SOS if you are trapped','Stay far away from power lines and all electrical equipment','Listen only to official radio, KSNDMC and government updates']},
                  {title:'Landslide Safety — Warning Signs', icon:'⛰️', bg:'var(--amber-bg)', steps:['Unusual sounds — cracking trees, rumbling, boulders rolling','Ground bulging or cracks appearing in roads or slopes near you','Water suddenly becoming muddy in streams and rivers','Leaning trees, tilted poles or fences appearing along slopes','If you see ANY signs, evacuate immediately — do not return']},
                  {title:'After Disaster — Recovery Steps', icon:'✅', bg:'var(--green-bg)', steps:['Return home only after official all-clear from district collector','Do not enter damaged buildings — check for structural safety first','Use bottled water until tap water is tested and declared safe','Document all property damage with photos for insurance claims','Register for government relief at your local panchayat office']}
                ].map((guide, i) => (
                  <div key={i} className="guide-card">
                    <div className="gc-hdr">
                      <div className="gc-icon" style={{background: guide.bg}}>{guide.icon}</div>
                      <div className="gc-title">{guide.title}</div>
                    </div>
                    <div className="gc-body">
                      {guide.steps.map((step, j) => (
                        <div key={j} className="gs-row"><div className="gs-n">{j+1}</div>{step}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE PANEL */}
          {activePanel === 'profile' && (
            <div className="panel active">
              <div className="profile-hero">
                <div className="ph-av">{(user?.firstName || 'U')[0]}{(user?.lastName || '')[0]}</div>
                <div>
                  <div className="ph-name">{user?.firstName || 'User'} {user?.lastName || ''}</div>
                  <div className="ph-sub">Member since {user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'} · {user?.role || 'User'}</div>
                  <div className="ph-dist">📍 {user?.district || 'Kerala'} District</div>
                </div>
              </div>

              <div className="profile-grid">
                <div className="pc">
                  <div className="pc-title">👤 Personal Information</div>
                  {[
                    {l:'Full Name', v:`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Not set'},
                    {l:'Phone', v:user?.phone || 'Not set'},
                    {l:'Email', v:user?.email || 'Not set'},
                    {l:'District', v:user?.district || 'Not set'},
                    {l:'Panchayat / Ward', v:user?.profile?.panchayat || 'Not set'},
                    {l:'Emergency Contact', v:user?.profile?.emergencyPhone || 'Not set'}
                  ].map((item, i) => (
                    <div key={i} className="pc-row"><span className="pcr-l">{item.l}</span><span className="pcr-v">{item.v}</span></div>
                  ))}
                  <button className="pc-btn pcb-green">Edit Profile</button>
                </div>

                <div className="pc">
                  <div className="pc-title">🔔 Alert Preferences</div>
                  {[
                    {l:'Flood Alerts', sub:'Receive flood warnings for my district'},
                    {l:'Landslide Warnings', sub:'Landslide risk alerts for hilly areas'},
                    {l:'Weather Alerts', sub:'IMD orange/red alerts for my district'},
                    {l:'Cyclone Warnings', sub:'Coastal and sea state warnings'},
                    {l:'Dam Release Alerts', sub:'Notifications for dam water releases'},
                    {l:'Push Notifications', sub:'Allow browser notifications'}
                  ].map((pref, i) => (
                    <div key={i} className="tog-row">
                      <div><div className="tog-l">{pref.l}</div><div className="tog-sub">{pref.sub}</div></div>
                      <div className="tog-sw" onClick={(e) => e.target.classList.toggle('off')}></div>
                    </div>
                  ))}
                </div>

                <div className="pc">
                  <div className="pc-title">📋 My SOS History</div>
                  <div style={{color:'var(--muted)',fontSize:'13px',padding:'20px 0',textAlign:'center'}}>No SOS requests sent yet. Stay safe!</div>
                  <button className="pc-btn pcb-red" onClick={() => setShowSOS(true)}>🆘 Send Emergency SOS</button>
                </div>

                <div className="pc">
                  <div className="pc-title">⚙️ Account Settings</div>
                  {[
                    {l:'Language', v:'English / മലയാളം'},
                    {l:'App Theme', v:'Light Mode'},
                    {l:'Location Access', v:'✓ Enabled', g:true},
                    {l:'Last Login', v:'Today, 11:42 AM'}
                  ].map((item, i) => (
                    <div key={i} className="pc-row"><span className="pcr-l">{item.l}</span><span className="pcr-v" style={{color: item.g ? 'var(--green-text)' : 'inherit'}}>{item.v}</span></div>
                  ))}
                  <button className="pc-btn pcb-muted">Change Password</button>
                  <button className="pc-btn pcb-red" style={{marginTop:'6px'}}>Sign Out</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SOS MODAL */}
      {showSOS && (
        <div className="modal-overlay" onClick={() => setShowSOS(false)}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hdr">🆘 Emergency SOS</div>
            <div className="modal-body">
              <input type="text" placeholder="Your Name (Auto-filled from profile)" className="modal-input" defaultValue={user?.name || 'Your Name'}/>
              <input type="text" placeholder="Current Location" className="modal-input" defaultValue={user?.district || ''}/>
              <select className="modal-input">
                <option>Select Emergency Type...</option>
                <option>Flood Emergency</option>
                <option>Landslide</option>
                <option>House Collapse</option>
                <option>Stranded</option>
                <option>Injury Emergency</option>
                <option>Other</option>
              </select>
              <textarea placeholder="Description (Optional)" className="modal-input" style={{minHeight:'80px'}}></textarea>
              <div style={{marginTop:'20px',padding:'16px',borderRadius:'12px',background:'#f8fafc',border:'1px solid #e2e8f0'}}>
                <div style={{fontSize:'14px',fontWeight:'700',marginBottom:'10px'}}>📍 Your Location & Support</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',fontSize:'13px',color:'#334155'}}>
                  <div><strong>District:</strong> {user?.district || 'Kerala'}</div>
                  <div><strong>Panchayat/Ward:</strong> {user?.profile?.panchayat || 'Not set'}</div>
                  <div><strong>Phone:</strong> {user?.phone || 'Not set'}</div>
                  <div><strong>Emergency Type:</strong> {currentDistrictInfo?.riskLevel ? `${currentDistrictInfo.riskLevel} risk area` : 'General'}</div>
                </div>
                <div style={{marginTop:'12px',fontSize:'13px',color:'#475569'}}>
                  <div><strong>District Contacts:</strong></div>
                  <div>Control Room: {currentDistrictInfo?.emergencyContacts?.controlRoom || '1077'}</div>
                  <div>Collector: {currentDistrictInfo?.emergencyContacts?.collector || 'N/A'}</div>
                  <div>Police: {currentDistrictInfo?.emergencyContacts?.police || 'N/A'}</div>
                  <div>Fire: {currentDistrictInfo?.emergencyContacts?.fire || 'N/A'}</div>
                </div>
                <div style={{marginTop:'12px',fontSize:'13px',fontWeight:'700',color:'#dc2626'}}>Support Hotline: 1077 / KSNDMC</div>
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowSOS(false)} className="modal-btn modal-btn-gray">Cancel</button>
              <button onClick={getSOS} className="modal-btn modal-btn-red">Send SOS</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="toast-wrap">
          <div className="toast">
            <div className="toast-icon">{showToast.icon}</div>
            <div className="toast-body">
              <div className="toast-t">{showToast.title}</div>
              <div className="toast-m">{showToast.msg}</div>
            </div>
            <div className="toast-x" onClick={() => setShowToast(null)}>✕</div>
          </div>
        </div>
      )}
    </div>
  );
}
