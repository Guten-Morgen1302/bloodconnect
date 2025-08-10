import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Donor } from "@shared/schema";
import { motion } from "framer-motion";

interface DonorCardProps {
  donor: Donor;
  onContact?: (donor: Donor) => void;
  showDistance?: boolean;
  distance?: number;
}

export default function DonorCard({ donor, onContact, showDistance = true, distance }: DonorCardProps) {
  const handleContact = () => {
    if (onContact) {
      onContact(donor);
    } else {
      // Default action - could open a modal or navigate to contact page
      window.open(`tel:${donor.phone}`, '_self');
    }
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors: Record<string, string> = {
      'O+': 'bg-red-500',
      'O-': 'bg-red-600',
      'A+': 'bg-blue-500',
      'A-': 'bg-blue-600',
      'B+': 'bg-green-500',
      'B-': 'bg-green-600',
      'AB+': 'bg-purple-500',
      'AB-': 'bg-purple-600'
    };
    return colors[bloodType] || 'bg-gray-500';
  };

  const getAvailabilityText = () => {
    if (!donor.isAvailable) return "Not Available";
    if (donor.lastDonation) {
      const lastDonationDate = new Date(donor.lastDonation);
      const daysSince = Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince < 90) {
        return `Available in ${90 - daysSince} days`;
      }
    }
    return "Available now";
  };

  const isCurrentlyAvailable = donor.isAvailable && (!donor.lastDonation || 
    Math.floor((Date.now() - new Date(donor.lastDonation).getTime()) / (1000 * 60 * 60 * 24)) >= 90);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="bg-dark-300 border-dark-400 hover:border-accent-green transition-all duration-300 transform hover:shadow-lg"
        data-testid="donor-card"
      >
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-green-600 rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-user text-white"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white" data-testid="donor-name">{donor.fullName}</h4>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-400">Verified Donor</p>
                {donor.isVerified && (
                  <i className="fas fa-check-circle text-accent-green text-sm"></i>
                )}
              </div>
            </div>
            <Badge 
              className={`${getBloodTypeColor(donor.bloodType)} text-white px-3 py-1 rounded-full text-sm font-semibold`}
              data-testid="donor-blood-type"
            >
              {donor.bloodType}
            </Badge>
          </div>
          
          <div className="space-y-2 mb-4">
            {showDistance && distance && (
              <div className="flex items-center text-sm text-gray-400" data-testid="donor-distance">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>{distance.toFixed(1)} km away</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-400" data-testid="donor-availability">
              <i className="fas fa-clock mr-2"></i>
              <span className={isCurrentlyAvailable ? "text-accent-green" : "text-yellow-400"}>
                {getAvailabilityText()}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-400" data-testid="donor-rating">
              <i className="fas fa-star mr-2"></i>
              <span>{donor.rating || "4.5"} rating ({donor.totalDonations || 0} donations)</span>
            </div>
            {donor.address && (
              <div className="flex items-center text-sm text-gray-400" data-testid="donor-location">
                <i className="fas fa-location-dot mr-2"></i>
                <span className="truncate">{donor.address}</span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleContact}
            disabled={!donor.isAvailable || !isCurrentlyAvailable}
            className={`w-full transition-all duration-300 ${
              donor.isAvailable && isCurrentlyAvailable
                ? "bg-primary-500 hover:bg-primary-600" 
                : "bg-gray-600 cursor-not-allowed"
            }`}
            data-testid="button-contact-donor"
          >
            <i className="fas fa-phone mr-2"></i>
            {donor.isAvailable && isCurrentlyAvailable ? "Contact Donor" : "Not Available"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
