import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DonorCard from "@/components/ui/donor-card";
import InteractiveMap from "@/components/ui/interactive-map";
import { motion } from "framer-motion";
import { Donor } from "@shared/schema";

export default function FindDonors() {
  const [bloodType, setBloodType] = useState("");
  const [distance, setDistance] = useState(10);
  const [urgency, setUrgency] = useState("");

  const { data: donors, isLoading } = useQuery<Donor[]>({
    queryKey: ['/api/donors'],
  });

  const filteredDonors = donors?.filter(donor => 
    (!bloodType || donor.bloodType === bloodType) && 
    donor.isAvailable && 
    donor.isVerified
  ) || [];

  return (
    <div className="min-h-screen py-20 bg-dark-200" data-testid="find-donors-page">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-5xl mb-6 text-white" data-testid="page-title">Find Donors Near You</h2>
          <p className="font-body text-xl text-gray-300 max-w-2xl mx-auto" data-testid="page-description">
            Use our advanced search and mapping system to locate verified blood donors in real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Filters */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-dark-300 border-dark-400" data-testid="search-filters">
              <CardHeader>
                <CardTitle className="text-white">Search Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-2">Blood Type</Label>
                  <Select value={bloodType} onValueChange={setBloodType} data-testid="select-blood-type">
                    <SelectTrigger className="bg-dark-200 border-dark-400 text-white">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-gray-300 mb-2">Distance (km)</Label>
                  <Input
                    type="range"
                    min="1"
                    max="50"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value))}
                    className="accent-primary-500"
                    data-testid="input-distance"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>1km</span>
                    <span className="text-white" data-testid="text-distance-value">{distance}km</span>
                    <span>50km</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300 mb-2">Urgency Level</Label>
                  <RadioGroup value={urgency} onValueChange={setUrgency} data-testid="radio-urgency">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="critical" id="critical" />
                      <Label htmlFor="critical" className="text-red-400">Critical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent" className="text-yellow-400">Urgent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="routine" id="routine" />
                      <Label htmlFor="routine" className="text-green-400">Routine</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-accent-green to-green-600 hover:from-green-600 hover:to-green-700" data-testid="button-search">
                  <i className="fas fa-search mr-2"></i>
                  Search Donors
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-dark-300 border-dark-400" data-testid="map-container">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Live Donor Map</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-accent-green rounded-full mr-2"></div>
                      <span className="text-sm text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-accent-coral rounded-full mr-2"></div>
                      <span className="text-sm text-gray-400">Blood Banks</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <InteractiveMap donors={filteredDonors} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search Results */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <h3 className="font-heading font-semibold text-2xl mb-6 text-white" data-testid="results-title">
            Available Donors ({filteredDonors.length})
          </h3>
          
          {isLoading ? (
            <div className="text-center py-12" data-testid="loading-donors">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-green"></div>
              <p className="text-gray-400 mt-4">Loading donors...</p>
            </div>
          ) : filteredDonors.length === 0 ? (
            <Card className="bg-dark-300 border-dark-400" data-testid="no-donors-found">
              <CardContent className="text-center py-12">
                <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-400">No donors found matching your criteria</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <DonorCard donor={donor} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
