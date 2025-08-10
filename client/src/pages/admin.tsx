import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Donor, BloodRequest, LifeSaverRequest, InsertLifeSaverRequest } from "@shared/schema";
import StatsCard from "@/components/ui/stats-card";
import { useGSAP } from "@/hooks/use-gsap";

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: donors, isLoading: donorsLoading } = useQuery<Donor[]>({
    queryKey: ['/api/donors'],
  });

  const { data: requests, isLoading: requestsLoading } = useQuery<BloodRequest[]>({
    queryKey: ['/api/blood-requests'],
  });

  const { data: stats = {} } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: lifeSaverRequests, isLoading: lifeSaverLoading } = useQuery<LifeSaverRequest[]>({
    queryKey: ['/api/life-saver-requests'],
  });

  const updateDonorMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Donor> }) =>
      apiRequest("PATCH", `/api/donors/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Donor Updated",
        description: "Donor information has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update donor information.",
        variant: "destructive"
      });
    }
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BloodRequest> }) =>
      apiRequest("PATCH", `/api/blood-requests/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blood-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Request Updated",
        description: "Blood request has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update blood request.",
        variant: "destructive"
      });
    }
  });

  const createLifeSaverRequestMutation = useMutation({
    mutationFn: (data: InsertLifeSaverRequest) =>
      apiRequest("POST", "/api/life-saver-requests", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/life-saver-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Life Saver Request Created",
        description: "Request sent successfully to the selected donor.",
      });
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Failed to create life saver request.",
        variant: "destructive"
      });
    }
  });

  const updateLifeSaverRequestMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<LifeSaverRequest> }) =>
      apiRequest("PATCH", `/api/life-saver-requests/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/life-saver-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Life Saver Request Updated",
        description: "Request status has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update life saver request.",
        variant: "destructive"
      });
    }
  });

  useGSAP(() => {
    // Animate admin cards
    window.gsap.utils.toArray('.admin-card').forEach((card: any, i: number) => {
      window.gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.4,
        delay: i * 0.05
      });
    });
  }, []);

  const filteredDonors = donors?.filter(donor => {
    const matchesSearch = (donor.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (donor.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (donor.bloodType?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "verified" && donor.isVerified) ||
                         (statusFilter === "unverified" && !donor.isVerified) ||
                         (statusFilter === "available" && donor.isAvailable);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const filteredRequests = requests?.filter(request => {
    const matchesSearch = (request.patientName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (request.bloodType?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (request.hospital?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const filteredLifeSaverRequests = lifeSaverRequests?.filter(request => {
    const selectedDonor = donors?.find(d => d.id === request.selectedDonorId);
    const matchesSearch = (request.requesterName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (request.bloodType?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (request.hospital?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (selectedDonor?.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleVerifyDonor = (donorId: string) => {
    updateDonorMutation.mutate({
      id: donorId,
      updates: { isVerified: true }
    });
  };

  const handleUpdateRequestStatus = (requestId: string, status: string) => {
    updateRequestMutation.mutate({
      id: requestId,
      updates: { status }
    });
  };

  const handleCreateLifeSaverRequest = (donorId: string, data: Partial<InsertLifeSaverRequest>) => {
    const selectedDonor = donors?.find(d => d.id === donorId);
    if (!selectedDonor) return;

    const requestData: InsertLifeSaverRequest = {
      requesterName: data.requesterName || "Admin Request",
      requesterEmail: data.requesterEmail || "admin@bloodbank.com",
      requesterPhone: data.requesterPhone || "+91 98765 00000",
      selectedDonorId: donorId,
      bloodType: selectedDonor.bloodType,
      unitsRequired: data.unitsRequired || 1,
      urgencyLevel: data.urgencyLevel || "urgent",
      hospital: data.hospital || "Emergency Hospital",
      requestReason: data.requestReason || "Emergency blood requirement",
      notes: data.notes || ""
    };

    createLifeSaverRequestMutation.mutate(requestData);
  };

  const handleUpdateLifeSaverRequestStatus = (requestId: string, status: string) => {
    updateLifeSaverRequestMutation.mutate({
      id: requestId,
      updates: { status }
    });
  };

  return (
    <div className="min-h-screen py-20 bg-dark-100" data-testid="admin-page">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="font-heading font-bold text-4xl text-white mb-2" data-testid="page-title">Admin Dashboard</h2>
            <p className="text-gray-400" data-testid="page-description">Manage donors, blood requests, and system analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-accent-green hover:bg-green-600" data-testid="button-export">
              <i className="fas fa-download mr-2"></i>
              Export Data
            </Button>
            <Button className="bg-primary-500 hover:bg-primary-600" data-testid="button-notifications">
              <i className="fas fa-bell mr-2"></i>
              Send Alert
            </Button>
          </div>
        </motion.div>

        {/* Statistics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <StatsCard
            value={(stats as any)?.totalDonors?.toString() || "0"}
            label="Total Donors"
            sublabel="Registered"
            icon="fas fa-users"
            color="accent-green"
          />
          <StatsCard
            value={(stats as any)?.verifiedDonors?.toString() || "0"}
            label="Verified Donors"
            sublabel="Approved"
            icon="fas fa-user-check"
            color="primary"
          />
          <StatsCard
            value={(stats as any)?.activeRequests?.toString() || "0"}
            label="Active Requests"
            sublabel="Pending"
            icon="fas fa-exclamation-circle"
            color="accent-coral"
          />
          <StatsCard
            value={(stats as any)?.totalDonations?.toString() || "0"}
            label="Total Donations"
            sublabel="Completed"
            icon="fas fa-tint"
            color="yellow"
          />
        </motion.div>

        {/* Life Saver Requests Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <StatsCard
            value={(stats as any)?.lifeSaverRequests?.toString() || "0"}
            label="Life Saver Requests"
            sublabel="Total"
            icon="fas fa-hands-helping"
            color="purple"
          />
          <StatsCard
            value={(stats as any)?.pendingLifeSaverRequests?.toString() || "0"}
            label="Pending Requests"
            sublabel="Life Saver"
            icon="fas fa-clock"
            color="orange"
          />
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <Input
            placeholder="Search by name, email, blood type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark-300 border-dark-400 text-white"
            data-testid="input-search"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter} data-testid="select-status-filter">
            <SelectTrigger className="bg-dark-300 border-dark-400 text-white md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="active">Active Requests</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Tabs for Donors and Requests */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Tabs defaultValue="donors" className="w-full" data-testid="admin-tabs">
            <TabsList className="grid w-full grid-cols-3 bg-dark-300">
              <TabsTrigger value="donors" className="data-[state=active]:bg-primary-500">
                Donors ({filteredDonors.length})
              </TabsTrigger>
              <TabsTrigger value="requests" className="data-[state=active]:bg-primary-500">
                Blood Requests ({filteredRequests.length})
              </TabsTrigger>
              <TabsTrigger value="lifesaver" className="data-[state=active]:bg-primary-500">
                Life Saver ({filteredLifeSaverRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donors" className="mt-6">
              {donorsLoading ? (
                <div className="text-center py-12" data-testid="loading-donors">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-green"></div>
                  <p className="text-gray-400 mt-4">Loading donors...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDonors.map((donor, index) => (
                    <Card
                      key={donor.id}
                      className="admin-card bg-dark-300 border-dark-400 hover:border-accent-green transition-all duration-300"
                      data-testid={`donor-card-${index}`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{donor.fullName}</CardTitle>
                          <Badge
                            variant={donor.isVerified ? "default" : "secondary"}
                            className={donor.isVerified ? "bg-green-500" : "bg-yellow-500"}
                          >
                            {donor.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Blood Type:</span>
                            <p className="text-white font-semibold">{donor.bloodType}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Donations:</span>
                            <p className="text-white font-semibold">{donor.totalDonations || 0}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Rating:</span>
                            <p className="text-white font-semibold">{donor.rating}/5.0</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Available:</span>
                            <p className={`font-semibold ${donor.isAvailable ? 'text-accent-green' : 'text-red-400'}`}>
                              {donor.isAvailable ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Email:</span>
                          <p className="text-white text-sm">{donor.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Phone:</span>
                          <p className="text-white text-sm">{donor.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          {!donor.isVerified && (
                            <Button
                              onClick={() => handleVerifyDonor(donor.id)}
                              disabled={updateDonorMutation.isPending}
                              className="flex-1 bg-accent-green hover:bg-green-600"
                              data-testid={`button-verify-${index}`}
                            >
                              {updateDonorMutation.isPending ? "Verifying..." : "Verify"}
                            </Button>
                          )}
                          {donor.isVerified && donor.isAvailable && (
                            <Button
                              onClick={() => handleCreateLifeSaverRequest(donor.id, {
                                requesterName: "Emergency Admin",
                                requesterEmail: "admin@bloodbank.com",
                                requesterPhone: "+91 98765 00000",
                                unitsRequired: 1,
                                urgencyLevel: "urgent",
                                hospital: "Emergency Hospital",
                                requestReason: "Emergency blood requirement"
                              })}
                              disabled={createLifeSaverRequestMutation.isPending}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              data-testid={`button-request-${index}`}
                            >
                              {createLifeSaverRequestMutation.isPending ? "Requesting..." : "Request Blood"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              {requestsLoading ? (
                <div className="text-center py-12" data-testid="loading-requests">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-green"></div>
                  <p className="text-gray-400 mt-4">Loading requests...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredRequests.map((request, index) => (
                    <Card
                      key={request.id}
                      className="admin-card bg-dark-300 border-dark-400 hover:border-accent-coral transition-all duration-300"
                      data-testid={`request-card-${index}`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{request.patientName}</CardTitle>
                          <Badge
                            variant={request.status === "active" ? "destructive" : "default"}
                            className={
                              request.status === "active" ? "bg-red-500" :
                              request.status === "completed" ? "bg-green-500" :
                              "bg-yellow-500"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Blood Type:</span>
                            <p className="text-white font-semibold">{request.bloodType}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Units:</span>
                            <p className="text-white font-semibold">{request.unitsRequired}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Urgency:</span>
                            <p className={`font-semibold ${
                              request.urgencyLevel === "critical" ? "text-red-400" :
                              request.urgencyLevel === "urgent" ? "text-yellow-400" :
                              "text-green-400"
                            }`}>
                              {request.urgencyLevel}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Created:</span>
                            <p className="text-white font-semibold">
                              {new Date(request.createdAt || "").toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Hospital:</span>
                          <p className="text-white text-sm">{request.hospital}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Contact:</span>
                          <p className="text-white text-sm">{request.contactPerson} - {request.contactPhone}</p>
                        </div>
                        {request.notes && (
                          <div>
                            <span className="text-gray-400 text-sm">Notes:</span>
                            <p className="text-white text-sm">{request.notes}</p>
                          </div>
                        )}
                        {request.status === "active" && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUpdateRequestStatus(request.id, "completed")}
                              disabled={updateRequestMutation.isPending}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              data-testid={`button-complete-${index}`}
                            >
                              Mark Complete
                            </Button>
                            <Button
                              onClick={() => handleUpdateRequestStatus(request.id, "cancelled")}
                              disabled={updateRequestMutation.isPending}
                              variant="outline"
                              className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                              data-testid={`button-cancel-${index}`}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="lifesaver" className="mt-6">
              {lifeSaverLoading ? (
                <div className="text-center py-12" data-testid="loading-lifesaver">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-green"></div>
                  <p className="text-gray-400 mt-4">Loading life saver requests...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredLifeSaverRequests.map((request, index) => {
                    const selectedDonor = donors?.find(d => d.id === request.selectedDonorId);
                    return (
                      <Card
                        key={request.id}
                        className="admin-card bg-dark-300 border-dark-400 hover:border-blue-500 transition-all duration-300"
                        data-testid={`lifesaver-card-${index}`}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-lg">
                              Request for {selectedDonor?.fullName || "Unknown Donor"}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={request.status === "pending" ? "destructive" : "default"}
                                className={
                                  request.status === "pending" ? "bg-yellow-500" :
                                  request.status === "accepted" ? "bg-green-500" :
                                  request.status === "contacted" ? "bg-blue-500" :
                                  request.status === "completed" ? "bg-green-600" :
                                  request.status === "declined" ? "bg-red-500" :
                                  "bg-gray-500"
                                }
                              >
                                {request.status === "accepted" ? "Accepted by Donor" :
                                 request.status === "declined" ? "Declined by Donor" :
                                 request.status}
                              </Badge>
                              {request.status === "declined" && (
                                <Badge className="bg-orange-500">
                                  <i className="fas fa-sync mr-1"></i>
                                  Auto-Reassigned
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Donor Blood Type:</span>
                              <p className="text-white font-semibold">{request.bloodType}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Units Required:</span>
                              <p className="text-white font-semibold">{request.unitsRequired}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Urgency:</span>
                              <p className={`font-semibold ${
                                request.urgencyLevel === "critical" ? "text-red-400" :
                                request.urgencyLevel === "urgent" ? "text-yellow-400" :
                                "text-green-400"
                              }`}>
                                {request.urgencyLevel}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400">Created:</span>
                              <p className="text-white font-semibold">
                                {new Date(request.createdAt || "").toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Requester:</span>
                            <p className="text-white text-sm">{request.requesterName}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Hospital:</span>
                            <p className="text-white text-sm">{request.hospital}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Contact:</span>
                            <p className="text-white text-sm">{request.requesterPhone}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Selected Donor:</span>
                            <p className="text-white text-sm">
                              {selectedDonor?.fullName} - {selectedDonor?.phone}
                            </p>
                          </div>
                          {request.requestReason && (
                            <div>
                              <span className="text-gray-400 text-sm">Reason:</span>
                              <p className="text-white text-sm">{request.requestReason}</p>
                            </div>
                          )}
                          {request.notes && (
                            <div>
                              <span className="text-gray-400 text-sm">Notes:</span>
                              <p className="text-white text-sm">{request.notes}</p>
                            </div>
                          )}
                          {request.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleUpdateLifeSaverRequestStatus(request.id, "contacted")}
                                disabled={updateLifeSaverRequestMutation.isPending}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                data-testid={`button-contact-${index}`}
                              >
                                Mark Contacted
                              </Button>
                              <Button
                                onClick={() => handleUpdateLifeSaverRequestStatus(request.id, "cancelled")}
                                disabled={updateLifeSaverRequestMutation.isPending}
                                variant="outline"
                                className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                                data-testid={`button-cancel-lifesaver-${index}`}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                          {(request.status === "contacted" || request.status === "accepted") && (
                            <Button
                              onClick={() => handleUpdateLifeSaverRequestStatus(request.id, "completed")}
                              disabled={updateLifeSaverRequestMutation.isPending}
                              className="w-full bg-green-600 hover:bg-green-700"
                              data-testid={`button-complete-lifesaver-${index}`}
                            >
                              Mark Completed
                            </Button>
                          )}
                          {request.status === "declined" && (
                            <div className="bg-orange-500/10 border border-orange-500 rounded-lg p-3">
                              <p className="text-orange-400 text-sm">
                                <i className="fas fa-info-circle mr-2"></i>
                                This donor declined the request. The system has automatically assigned another available donor.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
