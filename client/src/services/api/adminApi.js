import axios from 'axios';
import { apiUrl } from '../../config/api';

class AdminApi {
  constructor(token) {
    this.token = token;
    this.headers = token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Dashboard Overview
  async getDashboardStats() {
    const response = await axios.get(apiUrl('/api/admin/dashboard'), {
      headers: this.headers
    });
    return response.data;
  }

  // User Management
  async getAllUsers() {
    const response = await axios.get(apiUrl('/api/admin/users'), {
      headers: this.headers
    });
    return response.data;
  }

  async updateUserRole(userId, newRole) {
    const response = await axios.put(
      apiUrl(`/api/admin/users/${userId}/role`),
      { role: newRole },
      { headers: this.headers }
    );
    return response.data;
  }

  async updateUserStatus(userId, isActive) {
    const response = await axios.put(
      apiUrl(`/api/admin/users/${userId}/status`),
      { isActive },
      { headers: this.headers }
    );
    return response.data;
  }

  async createAdmin(adminData) {
    const response = await axios.post(apiUrl('/api/admin/users/create-admin'), adminData, {
      headers: this.headers
    });
    return response.data;
  }

  // Create a new user (any role)
  async createUser(userData) {
    const response = await axios.post(apiUrl('/api/admin/users/create-user'), userData, {
      headers: this.headers
    });
    return response.data;
  }

  // Create a new volunteer
  async createVolunteer(volunteerData) {
    const response = await axios.post(apiUrl('/api/admin/volunteers/create'), volunteerData, {
      headers: this.headers
    });
    return response.data;
  }

  // Create a new shelter
  async createShelter(shelterData) {
    const response = await axios.post(apiUrl('/api/admin/shelters/create'), shelterData, {
      headers: this.headers
    });
    return response.data;
  }

  // Create a new beneficiary
  async createBeneficiary(beneficiaryData) {
    const response = await axios.post(apiUrl('/api/admin/beneficiaries/create'), beneficiaryData, {
      headers: this.headers
    });
    return response.data;
  }

  // Application Management
  async getAllApplications(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);

    const response = await axios.get(apiUrl(`/api/admin/applications?${params}`), {
      headers: this.headers
    });
    return response.data;
  }

  async approveApplication(applicationId, notes = '') {
    const response = await axios.put(
      apiUrl(`/api/admin/applications/${applicationId}/approve`),
      { notes },
      { headers: this.headers }
    );
    return response.data;
  }

  async rejectApplication(applicationId, notes = '') {
    const response = await axios.put(
      apiUrl(`/api/admin/applications/${applicationId}/reject`),
      { notes },
      { headers: this.headers }
    );
    return response.data;
  }

  // Alert Management
  async getAllAlerts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.severity) params.append('severity', filters.severity);

    const response = await axios.get(apiUrl(`/api/alerts/applications?${params}`), {
      headers: this.headers
    });
    return response.data;
  }

  async getPendingAlerts() {
    const response = await axios.get(apiUrl('/api/alerts/pending'), {
      headers: this.headers
    });
    return response.data;
  }

  async publishAlert(alertId) {
    const response = await axios.put(
      apiUrl(`/api/alerts/${alertId}/verify`),
      { action: 'publish' },
      { headers: this.headers }
    );
    return response.data;
  }

  async rejectAlert(alertId) {
    const response = await axios.put(
      apiUrl(`/api/alerts/${alertId}/verify`),
      { action: 'reject' },
      { headers: this.headers }
    );
    return response.data;
  }

  async createAlert(alertData) {
    const response = await axios.post(apiUrl('/api/admin/alerts'), alertData, {
      headers: this.headers
    });
    return response.data;
  }

  // Shelter Management
  async getAllShelters(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.district) params.append('district', filters.district);

    const response = await axios.get(apiUrl(`/api/shelters/applications?${params}`), {
      headers: this.headers
    });
    return response.data;
  }

  async getPendingShelters() {
    const response = await axios.get(apiUrl('/api/shelters/pending'), {
      headers: this.headers
    });
    return response.data;
  }

  async approveShelter(shelterId, notes = '') {
    const response = await axios.put(
      apiUrl(`/api/shelters/${shelterId}/verify`),
      { action: 'approve', notes },
      { headers: this.headers }
    );
    return response.data;
  }

  async rejectShelter(shelterId, notes = '') {
    const response = await axios.put(
      apiUrl(`/api/shelters/${shelterId}/verify`),
      { action: 'reject', notes },
      { headers: this.headers }
    );
    return response.data;
  }

  // Volunteer Management
  async getAllVolunteers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.district) params.append('district', filters.district);

    const response = await axios.get(apiUrl(`/api/volunteers?${params}`), {
      headers: this.headers
    });
    return response.data;
  }

  async getPendingVolunteers() {
    const response = await axios.get(apiUrl('/api/volunteers/pending'), {
      headers: this.headers
    });
    return response.data;
  }

  async approveVolunteer(volunteerId, notes = '') {
    const response = await axios.put(
      apiUrl(`/api/volunteers/${volunteerId}/verify`),
      { action: 'approve', notes },
      { headers: this.headers }
    );
    return response.data;
  }

  async rejectVolunteer(volunteerId, notes = '') {
    const response = await axios.put(
      apiUrl(`/api/volunteers/${volunteerId}/verify`),
      { action: 'reject', notes },
      { headers: this.headers }
    );
    return response.data;
  }

  // Knowledge Management
  async getAllKnowledge() {
    const response = await axios.get(apiUrl('/api/admin/knowledge'), {
      headers: this.headers
    });
    return response.data;
  }

  async createKnowledge(knowledgeData) {
    const response = await axios.post(apiUrl('/api/admin/knowledge'), knowledgeData, {
      headers: this.headers
    });
    return response.data;
  }

  async updateKnowledge(knowledgeId, knowledgeData) {
    const response = await axios.put(
      apiUrl(`/api/admin/knowledge/${knowledgeId}`),
      knowledgeData,
      { headers: this.headers }
    );
    return response.data;
  }

  async deleteKnowledge(knowledgeId) {
    const response = await axios.delete(apiUrl(`/api/admin/knowledge/${knowledgeId}`), {
      headers: this.headers
    });
    return response.data;
  }

  // Places & Risk Management
  async getAllPlaces() {
    const response = await axios.get(apiUrl('/api/places'), {
      headers: this.headers
    });
    return response.data;
  }

  async createPlace(placeData) {
    const response = await axios.post(apiUrl('/api/admin/places'), placeData, {
      headers: this.headers
    });
    return response.data;
  }

  async updatePlace(placeId, placeData) {
    const response = await axios.put(
      apiUrl(`/api/admin/places/${placeId}`),
      placeData,
      { headers: this.headers }
    );
    return response.data;
  }

  async deletePlace(placeId) {
    const response = await axios.delete(apiUrl(`/api/admin/places/${placeId}`), {
      headers: this.headers
    });
    return response.data;
  }

  // Beneficiary Management
  async getAllBeneficiaries() {
    const response = await axios.get(apiUrl('/api/admin/beneficiaries'), {
      headers: this.headers
    });
    return response.data;
  }

  // Approval History
  async getApprovalHistory() {
    const response = await axios.get(apiUrl('/api/admin/approvals/history'), {
      headers: this.headers
    });
    return response.data;
  }
}

export default AdminApi;
