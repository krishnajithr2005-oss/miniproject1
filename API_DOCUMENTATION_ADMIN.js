/*
  ================================================================================
  ADMIN DASHBOARD - BACKEND API DOCUMENTATION
  ================================================================================
  
  This document outlines all the API endpoints needed to support the Admin Dashboard.
  The Admin Dashboard is accessible at /admin and requires admin authentication.
  
  BASE URL: http://localhost:5000/api/admin
  AUTHENTICATION: Bearer Token (JWT) with role='admin'
  
  ================================================================================
  1. ADMIN AUTHENTICATION
  ================================================================================
  
  POST /api/auth/admin-login
  Description: Admin-specific login endpoint
  Body: {
    email: "admin@kerala-disaster.gov",
    password: "secureAdminPassword123"
  }
  Response: {
    success: true,
    token: "jwt_token_here",
    user: {
      id: "admin_id",
      name: "Admin Name",
      email: "admin@kerala-disaster.gov",
      role: "admin"
    }
  }
  
  ================================================================================
  2. VOLUNTEER MANAGEMENT ENDPOINTS
  ================================================================================
  
  GET /api/admin/volunteers
  Description: Get all volunteers (pending, approved, rejected)
  Query Params:
    - status: "pending" | "approved" | "rejected" (optional)
    - district: "Ernakulam" (optional)
    - page: 1 (optional, for pagination)
  Response: {
    success: true,
    data: [
      {
        id: "vol_001",
        name: "John Doe",
        email: "john@example.com",
        phone: "9876543210",
        district: "Ernakulam",
        skills: ["first-aid", "swimming"],
        experience: "intermediate",
        availability: "part-time",
        languages: ["Malayalam", "English"],
        motivation: "Want to help community",
        documentUrl: "path/to/document",
        status: "pending",
        appliedDate: "2026-04-20T10:30:00Z"
      }
    ],
    total: 45,
    page: 1
  }
  
  POST /api/admin/volunteers/:id/approve
  Description: Approve a pending volunteer
  Body: {
    adminNotes: "Approved - meets all criteria" (optional)
  }
  Response: {
    success: true,
    message: "Volunteer approved successfully",
    volunteer: { ...updated volunteer object }
  }
  
  POST /api/admin/volunteers/:id/reject
  Description: Reject a pending volunteer
  Body: {
    reason: "Missing required documents"
  }
  Response: {
    success: true,
    message: "Volunteer rejected",
    data: { volunteer details }
  }
  
  DELETE /api/admin/volunteers/:id
  Description: Delete a volunteer
  Response: {
    success: true,
    message: "Volunteer deleted successfully"
  }
  
  ================================================================================
  3. SHELTER MANAGEMENT ENDPOINTS
  ================================================================================
  
  GET /api/admin/shelters
  Description: Get all shelters (pending, approved, active)
  Query Params:
    - status: "pending" | "approved" | "active" (optional)
    - district: "Ernakulam" (optional)
    - page: 1 (optional)
  Response: {
    success: true,
    data: [
      {
        id: "shelter_001",
        name: "Red Cross Shelter",
        location: "Kochi",
        district: "Ernakulam",
        address: "123 Main St",
        latitude: 9.9312,
        longitude: 76.2673,
        capacity: 500,
        currentOccupancy: 250,
        amenities: ["food", "medical", "water"],
        contactPerson: "Manager Name",
        contactPhone: "9876543210",
        ownershipProofUrl: "path/to/proof",
        status: "pending",
        registeredDate: "2026-04-19T15:45:00Z"
      }
    ],
    total: 12,
    page: 1
  }
  
  POST /api/admin/shelters/:id/approve
  Description: Approve a pending shelter
  Body: {
    adminNotes: "Verified - ready to publish" (optional)
  }
  Response: {
    success: true,
    message: "Shelter approved and published",
    shelter: { ...updated shelter object }
  }
  
  POST /api/admin/shelters/:id/reject
  Description: Reject a pending shelter
  Body: {
    reason: "Invalid ownership proof"
  }
  Response: {
    success: true,
    message: "Shelter rejected",
    data: { shelter details }
  }
  
  PATCH /api/admin/shelters/:id/occupancy
  Description: Update shelter occupancy (from shelter manager)
  Body: {
    currentOccupancy: 275
  }
  Response: {
    success: true,
    data: { updated shelter }
  }
  
  ================================================================================
  4. ALERT MANAGEMENT ENDPOINTS
  ================================================================================
  
  GET /api/admin/alerts
  Description: Get all alerts
  Query Params:
    - status: "active" | "resolved" | "archived" (optional)
    - severity: "high" | "medium" | "low" (optional)
    - district: "Alappuzha" (optional)
    - type: "flood" | "landslide" | "thunderstorm" (optional)
  Response: {
    success: true,
    data: [
      {
        id: "alert_001",
        type: "Flood",
        district: "Alappuzha",
        severity: "high",
        description: "Heavy flooding in low-lying areas",
        affectedAreas: ["Area 1", "Area 2"],
        latitude: 9.4867,
        longitude: 76.2619,
        createdBy: "user_id",
        status: "active",
        createdDate: "2026-04-23T08:15:00Z",
        resolvedDate: null,
        affectedPeople: 1200,
        estimatedDamage: "High"
      }
    ],
    total: 7,
    page: 1
  }
  
  POST /api/admin/alerts/:id/resolve
  Description: Mark alert as resolved
  Body: {
    resolutionNotes: "Situation under control",
    damageReport: "Moderate damage in 5 houses"
  }
  Response: {
    success: true,
    message: "Alert marked as resolved",
    alert: { ...updated alert object }
  }
  
  POST /api/admin/alerts/:id/update-severity
  Description: Update alert severity
  Body: {
    severity: "medium"
  }
  Response: {
    success: true,
    data: { updated alert }
  }
  
  POST /api/admin/alerts/broadcast
  Description: Send push notification to affected users
  Body: {
    alertId: "alert_001",
    message: "Flood alert for Alappuzha district",
    recipientDistricts: ["Alappuzha", "Kottayam"]
  }
  Response: {
    success: true,
    notificationsSent: 450
  }
  
  ================================================================================
  5. USER MANAGEMENT ENDPOINTS
  ================================================================================
  
  GET /api/admin/users
  Description: Get all system users
  Query Params:
    - role: "user" | "admin" (optional)
    - verified: true | false (optional)
    - page: 1 (optional)
  Response: {
    success: true,
    data: [
      {
        id: "user_001",
        name: "User Name",
        email: "user@example.com",
        phone: "9876543210",
        district: "Ernakulam",
        role: "user",
        verified: true,
        createdDate: "2026-01-15T09:30:00Z",
        lastLogin: "2026-04-23T14:20:00Z"
      }
    ],
    total: 1250,
    page: 1
  }
  
  PATCH /api/admin/users/:id/role
  Description: Update user role
  Body: {
    role: "moderator" | "user"
  }
  Response: {
    success: true,
    user: { ...updated user }
  }
  
  DELETE /api/admin/users/:id
  Description: Delete a user account
  Response: {
    success: true,
    message: "User deleted successfully"
  }
  
  ================================================================================
  6. ANALYTICS & MONITORING ENDPOINTS
  ================================================================================
  
  GET /api/admin/analytics/dashboard
  Description: Get dashboard statistics
  Response: {
    success: true,
    data: {
      totalUsers: 1250,
      activeToday: 342,
      newThisWeek: 45,
      verifiedUsers: 1050,
      activeVolunteers: 45,
      activeShelters: 12,
      activeAlerts: 7,
      pendingApprovals: 8,
      totalDistricts: 14
    }
  }
  
  GET /api/admin/analytics/traffic
  Description: Get website traffic analytics
  Query Params:
    - days: 7 | 30 | 90 (optional, default: 7)
  Response: {
    success: true,
    data: {
      dailyActiveUsers: 342,
      totalPageViews: 2450,
      avgSessionDuration: "8m 32s",
      bounceRate: 32.5,
      topPages: [
        { page: "/dashboard", views: 450 },
        { page: "/alerts", views: 380 },
        { page: "/shelters", views: 320 }
      ]
    }
  }
  
  GET /api/admin/analytics/features
  Description: Get feature usage analytics
  Response: {
    success: true,
    data: {
      sosRequests: 23,
      shelterSearches: 1240,
      volunteerSignups: 45,
      weatherChecks: 890,
      alertClicks: 650
    }
  }
  
  GET /api/admin/analytics/geographic
  Description: Get geographic distribution
  Response: {
    success: true,
    data: {
      byDistrict: [
        { district: "Ernakulam", users: 250, alerts: 3 },
        { district: "Thiruvananthapuram", users: 180, alerts: 2 },
        { district: "Alappuzha", users: 145, alerts: 2 }
      ],
      mostActiveDistrict: "Ernakulam",
      coveragePercentage: 94
    }
  }
  
  ================================================================================
  7. SYSTEM SETTINGS ENDPOINTS
  ================================================================================
  
  GET /api/admin/settings
  Description: Get system settings
  Response: {
    success: true,
    data: {
      maxShelterCapacity: 500,
      autoApproveAfterDays: 7,
      alertNotificationRadius: 5,
      emailNotificationsEnabled: true,
      dailyReportEnabled: true,
      smsAlertsEnabled: false
    }
  }
  
  PATCH /api/admin/settings
  Description: Update system settings
  Body: {
    maxShelterCapacity: 500,
    autoApproveAfterDays: 7,
    alertNotificationRadius: 5,
    emailNotificationsEnabled: true,
    dailyReportEnabled: true,
    smsAlertsEnabled: false
  }
  Response: {
    success: true,
    message: "Settings updated successfully",
    data: { updated settings }
  }
  
  ================================================================================
  8. REPORT GENERATION ENDPOINTS
  ================================================================================
  
  POST /api/admin/reports/generate
  Description: Generate system reports
  Body: {
    type: "daily" | "weekly" | "monthly",
    format: "pdf" | "csv" | "json"
  }
  Response: {
    success: true,
    downloadUrl: "path/to/report.pdf"
  }
  
  ================================================================================
  ERROR RESPONSES
  ================================================================================
  
  Unauthorized (401):
  {
    success: false,
    message: "Unauthorized access - Admin role required"
  }
  
  Not Found (404):
  {
    success: false,
    message: "Resource not found"
  }
  
  Bad Request (400):
  {
    success: false,
    message: "Invalid request parameters",
    errors: { field: "error message" }
  }
  
  Server Error (500):
  {
    success: false,
    message: "Internal server error"
  }
  
  ================================================================================
  IMPLEMENTATION NOTES
  ================================================================================
  
  1. All endpoints require admin authentication (JWT token with role='admin')
  2. Implement proper pagination for list endpoints (default 10 items per page)
  3. Add rate limiting to prevent abuse
  4. Log all admin actions for audit trail
  5. Implement proper validation for all inputs
  6. Use transactions for critical operations (approval, rejection)
  7. Cache analytics data for better performance
  8. Send notifications when items are approved/rejected
  9. Implement soft delete for users and volunteers
  10. Add backup functionality for important data
  
  ================================================================================
*/

// This file is for documentation only - implement these endpoints in server.js
