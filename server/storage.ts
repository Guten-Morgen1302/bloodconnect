import { type User, type InsertUser, type Donor, type InsertDonor, type BloodRequest, type InsertBloodRequest, type DonorResponse, type InsertDonorResponse, type LifeSaverRequest, type InsertLifeSaverRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getDonor(id: string): Promise<Donor | undefined>;
  getDonorByEmail(email: string): Promise<Donor | undefined>;
  createDonor(donor: InsertDonor): Promise<Donor>;
  updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | undefined>;
  searchDonors(bloodType: string, latitude?: string, longitude?: string, maxDistance?: number): Promise<Donor[]>;
  getAllDonors(): Promise<Donor[]>;

  getBloodRequest(id: string): Promise<BloodRequest | undefined>;
  createBloodRequest(request: InsertBloodRequest): Promise<BloodRequest>;
  updateBloodRequest(id: string, updates: Partial<BloodRequest>): Promise<BloodRequest | undefined>;
  getAllBloodRequests(): Promise<BloodRequest[]>;
  getActiveBloodRequests(): Promise<BloodRequest[]>;

  createDonorResponse(response: InsertDonorResponse): Promise<DonorResponse>;
  getDonorResponsesByRequest(requestId: string): Promise<DonorResponse[]>;
  getDonorResponsesByDonor(donorId: string): Promise<DonorResponse[]>;

  createLifeSaverRequest(request: InsertLifeSaverRequest): Promise<LifeSaverRequest>;
  getAllLifeSaverRequests(): Promise<LifeSaverRequest[]>;
  updateLifeSaverRequest(id: string, updates: Partial<LifeSaverRequest>): Promise<LifeSaverRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private donors: Map<string, Donor>;
  private bloodRequests: Map<string, BloodRequest>;
  private donorResponses: Map<string, DonorResponse>;
  private lifeSaverRequests: Map<string, LifeSaverRequest>;

  constructor() {
    this.users = new Map();
    this.donors = new Map();
    this.bloodRequests = new Map();
    this.donorResponses = new Map();
    this.lifeSaverRequests = new Map();

    // Add some sample data for testing
    this.seedData();
  }

  private seedData() {
    // Sample donors
    const sampleDonors = [
      {
        id: "donor-1",
        fullName: "Raj Sharma",
        email: "raj.sharma@email.com",
        phone: "+91 98765 43210",
        bloodType: "O+",
        dateOfBirth: "1990-05-15",
        gender: "male",
        weight: 75,
        address: "123 Main Street, Mumbai, Maharashtra",
        latitude: "19.0760",
        longitude: "72.8777",
        isAvailable: true,
        isVerified: true,
        totalDonations: 23,
        rating: "4.9"
      },
      {
        id: "donor-2",
        fullName: "Priya Patel",
        email: "priya.patel@email.com",
        phone: "+91 87654 32109",
        bloodType: "A+",
        dateOfBirth: "1988-08-22",
        gender: "female",
        weight: 62,
        address: "456 Park Avenue, Delhi",
        latitude: "28.6139",
        longitude: "77.2090",
        isAvailable: true,
        isVerified: true,
        totalDonations: 15,
        rating: "4.7"
      },
      {
        id: "donor-3",
        fullName: "Amit Kumar",
        email: "amit.kumar@email.com",
        phone: "+91 76543 21098",
        bloodType: "B-",
        dateOfBirth: "1985-12-10",
        gender: "male",
        weight: 80,
        address: "789 Lake Road, Bangalore, Karnataka",
        latitude: "12.9716",
        longitude: "77.5946",
        isAvailable: false,
        isVerified: true,
        totalDonations: 31,
        rating: "4.8"
      },
      {
        id: "donor-4",
        fullName: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        phone: "+91 98456 78901",
        bloodType: "AB+",
        dateOfBirth: "1992-03-18",
        gender: "female",
        weight: 58,
        address: "321 Garden Street, Hyderabad, Telangana",
        latitude: "17.3850",
        longitude: "78.4867",
        isAvailable: true,
        isVerified: true,
        totalDonations: 12,
        rating: "4.6"
      },
      {
        id: "donor-5",
        fullName: "Rohit Singh",
        email: "rohit.singh@email.com",
        phone: "+91 87965 23401",
        bloodType: "O-",
        dateOfBirth: "1987-09-25",
        gender: "male",
        weight: 72,
        address: "654 River View, Pune, Maharashtra",
        latitude: "18.5204",
        longitude: "73.8567",
        isAvailable: true,
        isVerified: true,
        totalDonations: 45,
        rating: "5.0"
      },
      {
        id: "donor-6",
        fullName: "Kavya Nair",
        email: "kavya.nair@email.com",
        phone: "+91 76823 45678",
        bloodType: "A-",
        dateOfBirth: "1995-07-12",
        gender: "female",
        weight: 55,
        address: "987 Coastal Road, Kochi, Kerala",
        latitude: "9.9312",
        longitude: "76.2673",
        isAvailable: true,
        isVerified: true,
        totalDonations: 8,
        rating: "4.5"
      },
      {
        id: "donor-7",
        fullName: "Arjun Gupta",
        email: "arjun.gupta@email.com",
        phone: "+91 98234 56789",
        bloodType: "B+",
        dateOfBirth: "1991-11-08",
        gender: "male",
        weight: 78,
        address: "159 Hill Station Road, Shimla, Himachal Pradesh",
        latitude: "31.1048",
        longitude: "77.1734",
        isAvailable: true,
        isVerified: true,
        totalDonations: 19,
        rating: "4.7"
      },
      {
        id: "donor-8",
        fullName: "Meera Joshi",
        email: "meera.joshi@email.com",
        phone: "+91 87654 90123",
        bloodType: "AB-",
        dateOfBirth: "1989-01-30",
        gender: "female",
        weight: 60,
        address: "753 Temple Street, Jaipur, Rajasthan",
        latitude: "26.9124",
        longitude: "75.7873",
        isAvailable: true,
        isVerified: true,
        totalDonations: 27,
        rating: "4.8"
      }
    ];

    sampleDonors.forEach(donor => this.donors.set(donor.id, donor));

    // Add sample blood requests
    const sampleBloodRequests: BloodRequest[] = [
      {
        id: "req-1",
        requesterId: "user-1",
        bloodType: "O+",
        units: 2,
        status: "active",
        reason: "Emergency surgery",
        createdAt: new Date("2024-08-10T10:00:00Z").toISOString(),
        location: "Mumbai General Hospital",
        latitude: "19.0706",
        longitude: "72.8698"
      },
      {
        id: "req-2",
        requesterId: "user-2",
        bloodType: "A-",
        units: 1,
        status: "fulfilled",
        reason: "Chronic illness",
        createdAt: new Date("2024-08-09T14:30:00Z").toISOString(),
        location: "Pune City Hospital",
        latitude: "18.5204",
        longitude: "73.8567"
      }
    ];
    sampleBloodRequests.forEach(req => this.bloodRequests.set(req.id, req));

    // Add sample donor responses
    const sampleDonorResponses: DonorResponse[] = [
      {
        id: "resp-1",
        requestId: "req-1",
        donorId: "donor-1",
        status: "accepted",
        responseTime: new Date("2024-08-10T10:15:00Z").toISOString()
      },
      {
        id: "resp-2",
        requestId: "req-1",
        donorId: "donor-9", // Assuming donor-9 exists and is O+
        status: "pending",
        responseTime: new Date("2024-08-10T10:20:00Z").toISOString()
      },
      {
        id: "resp-3",
        requestId: "req-2",
        donorId: "donor-7", // Assuming donor-7 exists and is A-
        status: "accepted",
        responseTime: new Date("2024-08-09T14:45:00Z").toISOString()
      }
    ];
    sampleDonorResponses.forEach(resp => this.donorResponses.set(resp.id, resp));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDonor(id: string): Promise<Donor | undefined> {
    return this.donors.get(id);
  }

  async getDonorByEmail(email: string): Promise<Donor | undefined> {
    return Array.from(this.donors.values()).find(
      (donor) => donor.email === email,
    );
  }

  async createDonor(insertDonor: InsertDonor): Promise<Donor> {
    const id = randomUUID();
    const donor: Donor = {
      ...insertDonor,
      id,
      isAvailable: true,
      isVerified: false,
      totalDonations: 0,
      rating: "0",
      lastDonation: null,
      latitude: insertDonor.latitude || null,
      longitude: insertDonor.longitude || null
    };
    this.donors.set(id, donor);
    return donor;
  }

  async updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | undefined> {
    const donor = this.donors.get(id);
    if (!donor) return undefined;

    const updatedDonor = { ...donor, ...updates };
    this.donors.set(id, updatedDonor);
    return updatedDonor;
  }

  async searchDonors(bloodType: string, latitude?: string, longitude?: string, maxDistance = 50): Promise<Donor[]> {
    const donors = Array.from(this.donors.values());

    // In a real implementation, you would use the provided latitude, longitude, and maxDistance
    // to filter donors geographically. For this in-memory store, we'll just filter by blood type and availability/verification.
    return donors.filter(donor =>
      donor.bloodType === bloodType &&
      donor.isAvailable &&
      donor.isVerified
    );
  }

  async getAllDonors(): Promise<Donor[]> {
    return Array.from(this.donors.values());
  }

  async getBloodRequest(id: string): Promise<BloodRequest | undefined> {
    return this.bloodRequests.get(id);
  }

  async createBloodRequest(insertRequest: InsertBloodRequest): Promise<BloodRequest> {
    const id = randomUUID();
    const request: BloodRequest = {
      ...insertRequest,
      id,
      status: "active",
      createdAt: new Date().toISOString(),
      latitude: insertRequest.latitude || null,
      longitude: insertRequest.longitude || null
    };
    this.bloodRequests.set(id, request);
    return request;
  }

  async updateBloodRequest(id: string, updates: Partial<BloodRequest>): Promise<BloodRequest | undefined> {
    const request = this.bloodRequests.get(id);
    if (!request) return undefined;

    const updatedRequest = { ...request, ...updates };
    this.bloodRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async getAllBloodRequests(): Promise<BloodRequest[]> {
    return Array.from(this.bloodRequests.values());
  }

  async getActiveBloodRequests(): Promise<BloodRequest[]> {
    return Array.from(this.bloodRequests.values()).filter(
      request => request.status === "active"
    );
  }

  async createDonorResponse(insertResponse: InsertDonorResponse): Promise<DonorResponse> {
    const id = randomUUID();
    const response: DonorResponse = {
      ...insertResponse,
      id,
      responseTime: new Date().toISOString()
    };
    this.donorResponses.set(id, response);
    return response;
  }

  async getDonorResponsesByRequest(requestId: string): Promise<DonorResponse[]> {
    return Array.from(this.donorResponses.values()).filter(
      response => response.requestId === requestId
    );
  }

  async getDonorResponsesByDonor(donorId: string): Promise<DonorResponse[]> {
    return Array.from(this.donorResponses.values()).filter(
      response => response.donorId === donorId
    );
  }

  // Life Saver Request methods
  async createLifeSaverRequest(request: InsertLifeSaverRequest): Promise<LifeSaverRequest> {
    const id = randomUUID();
    const lifeSaverRequest: LifeSaverRequest = {
      ...request,
      id,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.lifeSaverRequests.set(id, lifeSaverRequest);
    return lifeSaverRequest;
  }

  async getAllLifeSaverRequests(): Promise<LifeSaverRequest[]> {
    return Array.from(this.lifeSaverRequests.values());
  }

  async getLifeSaverRequest(id: string): Promise<LifeSaverRequest | undefined> {
    return this.lifeSaverRequests.get(id);
  }

  async updateLifeSaverRequest(id: string, updates: Partial<LifeSaverRequest>): Promise<LifeSaverRequest | undefined> {
    const request = this.lifeSaverRequests.get(id);
    if (!request) return undefined;

    const updatedRequest = { ...request, ...updates, updatedAt: new Date().toISOString() };
    this.lifeSaverRequests.set(id, updatedRequest);

    // If request is declined, automatically find another donor
    if (updates.status === "declined") {
      await this.assignNextAvailableDonor(updatedRequest);
    }

    return updatedRequest;
  }

  private async assignNextAvailableDonor(originalRequest: LifeSaverRequest): Promise<void> {
    // Find available donors with matching blood type, excluding the one who declined
    const availableDonors = Array.from(this.donors.values()).filter(donor => 
      donor.bloodType === originalRequest.bloodType &&
      donor.isAvailable &&
      donor.isVerified &&
      donor.id !== originalRequest.selectedDonorId
    );

    if (availableDonors.length > 0) {
      // Select the donor with highest rating or most donations
      const nextDonor = availableDonors.sort((a, b) => {
        const aScore = (parseFloat(a.rating || "0") * 10) + (a.totalDonations || 0);
        const bScore = (parseFloat(b.rating || "0") * 10) + (b.totalDonations || 0);
        return bScore - aScore;
      })[0];

      // Create a new request for the next donor
      const newRequest: LifeSaverRequest = {
        ...originalRequest,
        id: randomUUID(),
        selectedDonorId: nextDonor.id,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: (originalRequest.notes || "") + " [Auto-assigned after previous donor declined]"
      };

      this.lifeSaverRequests.set(newRequest.id, newRequest);
    }
  }
}

export const storage = new MemStorage();