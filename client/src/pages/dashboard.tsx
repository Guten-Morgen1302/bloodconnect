import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import StatsCard from "@/components/ui/stats-card";
import { Donor, BloodRequest, LifeSaverRequest } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Mock current user data - in a real app this would come from authentication
const currentUser = {
  id: "donor-1",
  name: "Raj Sharma",
  bloodType: "O+",
  totalDonations: 23,
  rating: "4.9",
  isAvailable: true
};

export default function Dashboard() {
  const { data: donors } = useQuery<Donor[]>({
    queryKey: ['/api/donors'],
  });

  const { data: requests } = useQuery<BloodRequest[]>({
    queryKey: ['/api/blood-requests'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: lifeSaverRequests } = useQuery<LifeSaverRequest[]>({
    queryKey: ['/api/life-saver-requests'],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentDonor = donors?.find(d => d.id === currentUser.id);
  
  // Filter life saver requests for current donor that are pending
  const pendingRequests = lifeSaverRequests?.filter(
    request => request.selectedDonorId === currentUser.id && request.status === "pending"
  ) || [];

  const respondToLifeSaverRequestMutation = useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: string }) =>
      apiRequest("PATCH", `/api/life-saver-requests/${requestId}`, { status }),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/life-saver-requests'] });
      toast({
        title: status === "accepted" ? "Request Accepted" : "Request Declined",
        description: status === "accepted" 
          ? "Thank you for accepting! The requester will be notified." 
          : "Request declined. Another donor will be contacted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to respond to request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleLifeSaverResponse = (requestId: string, accepted: boolean) => {
    const status = accepted ? "accepted" : "declined";
    respondToLifeSaverRequestMutation.mutate({ requestId, status });
  };

  return (
    <div className="min-h-screen py-20 bg-dark-200" data-testid="dashboard-page">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="font-heading font-bold text-4xl text-white mb-2" data-testid="page-title">Dashboard</h2>
            <p className="text-gray-400" data-testid="welcome-message">Welcome back, {currentUser.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-accent-green hover:bg-green-600" data-testid="button-edit-profile">
              <i className="fas fa-user-edit mr-2"></i>
              Edit Profile
            </Button>
            <div className="relative">
              <Button variant="outline" className="bg-dark-300 hover:bg-dark-400 border-dark-400" data-testid="button-notifications">
                <i className="fas fa-bell text-white"></i>
              </Button>
              {pendingRequests.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white animate-pulse" data-testid="notification-count">
                  {pendingRequests.length}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Life Saver Request Notifications */}
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-red-500 to-red-600 border-red-400" data-testid="life-saver-notifications">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <i className="fas fa-heart-pulse mr-3 text-2xl"></i>
                  Urgent Blood Request - Life Saver Needed!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRequests.map((request, index) => (
                  <div key={request.id} className="bg-white/10 rounded-lg p-4" data-testid={`request-${index}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-white font-semibold text-lg">Emergency Blood Needed</h4>
                        <p className="text-red-100 text-sm">Requested by: {request.requesterName}</p>
                      </div>
                      <Badge className="bg-yellow-500 text-black font-semibold">
                        {request.urgencyLevel?.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-red-200">Blood Type:</span>
                        <p className="text-white font-semibold">{request.bloodType}</p>
                      </div>
                      <div>
                        <span className="text-red-200">Units Required:</span>
                        <p className="text-white font-semibold">{request.unitsRequired}</p>
                      </div>
                      <div>
                        <span className="text-red-200">Hospital:</span>
                        <p className="text-white font-semibold">{request.hospital}</p>
                      </div>
                      <div>
                        <span className="text-red-200">Contact:</span>
                        <p className="text-white font-semibold">{request.requesterPhone}</p>
                      </div>
                    </div>
                    
                    {request.requestReason && (
                      <div className="mb-4">
                        <span className="text-red-200 text-sm">Reason:</span>
                        <p className="text-white text-sm">{request.requestReason}</p>
                      </div>
                    )}
                    
                    <div className="text-red-100 text-sm mb-4">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      Please visit: {request.hospital}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleLifeSaverResponse(request.id, true)}
                        disabled={respondToLifeSaverRequestMutation.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        data-testid={`button-accept-${index}`}
                      >
                        <i className="fas fa-check mr-2"></i>
                        Accept Request
                      </Button>
                      <Button
                        onClick={() => handleLifeSaverResponse(request.id, false)}
                        disabled={respondToLifeSaverRequestMutation.isPending}
                        variant="outline"
                        className="flex-1 bg-white/20 border-white/40 text-white hover:bg-white/30"
                        data-testid={`button-decline-${index}`}
                      >
                        <i className="fas fa-times mr-2"></i>
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-dark-300 border-dark-400" data-testid="profile-card">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-accent-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-user text-white text-3xl"></i>
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-white mb-1" data-testid="profile-name">{currentUser.name}</h3>
                  <p className="text-gray-400 mb-2" data-testid="profile-status">Verified Donor</p>
                  <div className="inline-flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold" data-testid="profile-blood-type">
                    <i className="fas fa-tint mr-2"></i>
                    {currentUser.bloodType} Blood Type
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Donations</span>
                    <span className="font-semibold text-accent-green" data-testid="stat-total-donations">{currentUser.totalDonations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Lives Saved</span>
                    <span className="font-semibold text-accent-coral" data-testid="stat-lives-saved">{currentUser.totalDonations * 3}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rating</span>
                    <span className="font-semibold text-yellow-400" data-testid="stat-rating">{currentUser.rating} ⭐</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Availability</span>
                    <span className={`font-semibold ${currentUser.isAvailable ? 'text-accent-green' : 'text-red-400'}`} data-testid="stat-availability">
                      {currentUser.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Next Eligible</span>
                    <span className="text-sm text-white" data-testid="next-eligible">Ready Now</span>
                  </div>
                  <div className="w-full bg-dark-400 rounded-full h-2">
                    <div className="bg-accent-green h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-dark-300 border-dark-400" data-testid="activity-timeline">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Activity Item 1 */}
                  <div className="flex items-start space-x-4" data-testid="activity-item-1">
                    <div className="w-10 h-10 bg-accent-green rounded-full flex items-center justify-center">
                      <i className="fas fa-tint text-white"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">Blood Donation Completed</h4>
                        <span className="text-sm text-gray-400">2 days ago</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">You donated blood at City Hospital for emergency case #12345</p>
                      <div className="flex items-center mt-2">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Item 2 */}
                  <div className="flex items-start space-x-4" data-testid="activity-item-2">
                    <div className="w-10 h-10 bg-accent-coral rounded-full flex items-center justify-center">
                      <i className="fas fa-bell text-white"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">Emergency Alert Received</h4>
                        <span className="text-sm text-gray-400">1 week ago</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">Urgent O+ blood needed at Metro Hospital - You responded</p>
                      <div className="flex items-center mt-2">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">Responded</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Item 3 */}
                  <div className="flex items-start space-x-4" data-testid="activity-item-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-user-check text-white"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">Profile Verified</h4>
                        <span className="text-sm text-gray-400">2 weeks ago</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">Your donor profile has been verified and approved</p>
                      <div className="flex items-center mt-2">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
        >
          <StatsCard
            value="2"
            label="This Month"
            sublabel="Donations"
            icon="fas fa-tint"
            color="accent-green"
          />
          <StatsCard
            value="95%"
            label="Response Rate"
            sublabel="To Alerts"
            icon="fas fa-clock"
            color="accent-coral"
          />
          <StatsCard
            value="45m"
            label="Avg Time"
            sublabel="To Respond"
            icon="fas fa-stopwatch"
            color="primary"
          />
          <StatsCard
            value="Gold"
            label="Recognition"
            sublabel="Donor Status"
            icon="fas fa-medal"
            color="yellow"
          />
        </motion.div>
      </div>
    </div>
  );
}
