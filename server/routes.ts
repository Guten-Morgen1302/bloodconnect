import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDonorSchema, insertBloodRequestSchema, insertDonorResponseSchema, insertLifeSaverRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Donor routes
  app.post("/api/donors", async (req, res) => {
    try {
      const validatedData = insertDonorSchema.parse(req.body);
      const donor = await storage.createDonor(validatedData);
      res.json(donor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/donors", async (req, res) => {
    try {
      const donors = await storage.getAllDonors();
      res.json(donors);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/donors/:id", async (req, res) => {
    try {
      const donor = await storage.getDonor(req.params.id);
      if (!donor) {
        res.status(404).json({ message: "Donor not found" });
        return;
      }
      res.json(donor);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/donors/:id", async (req, res) => {
    try {
      const donor = await storage.updateDonor(req.params.id, req.body);
      if (!donor) {
        res.status(404).json({ message: "Donor not found" });
        return;
      }
      res.json(donor);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/donors/search/:bloodType", async (req, res) => {
    try {
      const { bloodType } = req.params;
      const { lat, lng, distance } = req.query;
      
      const donors = await storage.searchDonors(
        bloodType,
        lat as string,
        lng as string,
        distance ? parseInt(distance as string) : undefined
      );
      res.json(donors);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Blood Request routes
  app.post("/api/blood-requests", async (req, res) => {
    try {
      const validatedData = insertBloodRequestSchema.parse(req.body);
      const request = await storage.createBloodRequest(validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/blood-requests", async (req, res) => {
    try {
      const requests = await storage.getAllBloodRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/blood-requests/active", async (req, res) => {
    try {
      const requests = await storage.getActiveBloodRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/blood-requests/:id", async (req, res) => {
    try {
      const request = await storage.getBloodRequest(req.params.id);
      if (!request) {
        res.status(404).json({ message: "Blood request not found" });
        return;
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/blood-requests/:id", async (req, res) => {
    try {
      const request = await storage.updateBloodRequest(req.params.id, req.body);
      if (!request) {
        res.status(404).json({ message: "Blood request not found" });
        return;
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Donor Response routes
  app.post("/api/donor-responses", async (req, res) => {
    try {
      const validatedData = insertDonorResponseSchema.parse(req.body);
      const response = await storage.createDonorResponse(validatedData);
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/donor-responses/request/:requestId", async (req, res) => {
    try {
      const responses = await storage.getDonorResponsesByRequest(req.params.requestId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/donor-responses/donor/:donorId", async (req, res) => {
    try {
      const responses = await storage.getDonorResponsesByDonor(req.params.donorId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Life Saver Request routes
  app.post("/api/life-saver-requests", async (req, res) => {
    try {
      const validatedData = insertLifeSaverRequestSchema.parse(req.body);
      const request = await storage.createLifeSaverRequest(validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/life-saver-requests", async (req, res) => {
    try {
      const requests = await storage.getAllLifeSaverRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/life-saver-requests/:id", async (req, res) => {
    try {
      const request = await storage.getLifeSaverRequest(req.params.id);
      if (!request) {
        res.status(404).json({ message: "Life saver request not found" });
        return;
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/life-saver-requests/:id", async (req, res) => {
    try {
      const request = await storage.updateLifeSaverRequest(req.params.id, req.body);
      if (!request) {
        res.status(404).json({ message: "Life saver request not found" });
        return;
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Statistics endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const donors = await storage.getAllDonors();
      const requests = await storage.getAllBloodRequests();
      const lifeSaverRequests = await storage.getAllLifeSaverRequests();
      
      const stats = {
        totalDonors: donors.length,
        verifiedDonors: donors.filter(d => d.isVerified).length,
        availableDonors: donors.filter(d => d.isAvailable && d.isVerified).length,
        totalRequests: requests.length,
        activeRequests: requests.filter(r => r.status === "active").length,
        completedRequests: requests.filter(r => r.status === "completed").length,
        totalDonations: donors.reduce((sum, d) => sum + (d.totalDonations || 0), 0),
        lifeSaverRequests: lifeSaverRequests.length,
        pendingLifeSaverRequests: lifeSaverRequests.filter(r => r.status === "pending").length
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
