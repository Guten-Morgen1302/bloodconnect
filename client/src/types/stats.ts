// Statistics data types for the application
export interface AppStats {
  totalDonors: number;
  verifiedDonors: number;
  availableDonors: number;
  activeRequests: number;
  totalDonations: number;
  completedDonations: number;
  pendingRequests: number;
  emergencyRequests: number;
}

// Default stats with fallback values
export const defaultStats: AppStats = {
  totalDonors: 0,
  verifiedDonors: 0,
  availableDonors: 0,
  activeRequests: 0,
  totalDonations: 0,
  completedDonations: 0,
  pendingRequests: 0,
  emergencyRequests: 0
};