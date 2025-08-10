import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertBloodRequestSchema, type InsertBloodRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Emergency() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertBloodRequest>({
    resolver: zodResolver(insertBloodRequestSchema),
    defaultValues: {
      patientName: "",
      bloodType: "",
      unitsRequired: 1,
      urgencyLevel: "",
      hospital: "",
      contactPerson: "",
      contactPhone: "",
      notes: "",
      latitude: "",
      longitude: ""
    }
  });

  const createRequestMutation = useMutation({
    mutationFn: (data: InsertBloodRequest) => apiRequest("POST", "/api/blood-requests", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blood-requests'] });
      toast({
        title: "Emergency Alert Sent!",
        description: "Your request has been broadcasted to all eligible donors in your area.",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Alert",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertBloodRequest) => {
    createRequestMutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-primary-800 to-dark-100" data-testid="emergency-page">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6 pulse-glow">
            <i className="fas fa-exclamation-triangle text-white text-3xl"></i>
          </div>
          <h2 className="font-heading font-bold text-5xl mb-6 text-white" data-testid="page-title">Emergency Blood Request</h2>
          <p className="font-body text-xl text-gray-300 max-w-2xl mx-auto" data-testid="page-description">
            Submit urgent blood requirements and get instant alerts to nearby donors and blood banks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-dark-200 border-red-500/30 shadow-2xl" data-testid="emergency-form">
            <CardHeader>
              <CardTitle className="text-white text-center">Emergency Request Form</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Patient Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-dark-300 border-dark-400 text-white focus:border-red-500"
                              placeholder="Enter patient name"
                              data-testid="input-patient-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Blood Type Required *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} data-testid="select-blood-type">
                            <FormControl>
                              <SelectTrigger className="bg-dark-300 border-dark-400 text-white focus:border-red-500">
                                <SelectValue placeholder="Select blood type" />
                              </SelectTrigger>
                            </FormControl>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="unitsRequired"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Units Required *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              className="bg-dark-300 border-dark-400 text-white focus:border-red-500"
                              placeholder="1"
                              data-testid="input-units-required"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="urgencyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Urgency Level *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} data-testid="select-urgency">
                            <FormControl>
                              <SelectTrigger className="bg-dark-300 border-dark-400 text-white focus:border-red-500">
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="critical">Critical (0-2 hours)</SelectItem>
                              <SelectItem value="urgent">Urgent (2-6 hours)</SelectItem>
                              <SelectItem value="routine">Routine (6+ hours)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="hospital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Hospital/Location *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-dark-300 border-dark-400 text-white focus:border-red-500"
                            placeholder="Enter hospital name and address"
                            data-testid="input-hospital"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Contact Person *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-dark-300 border-dark-400 text-white focus:border-red-500"
                            placeholder="Name of contact person"
                            data-testid="input-contact-person"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            className="bg-dark-300 border-dark-400 text-white focus:border-red-500"
                            placeholder="+91 XXXXX XXXXX"
                            data-testid="input-contact-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value || ""}
                            className="bg-dark-300 border-dark-400 text-white focus:border-red-500 h-24 resize-none"
                            placeholder="Any additional information about the emergency..."
                            data-testid="input-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4" data-testid="emergency-protocol-info">
                    <div className="flex items-start">
                      <i className="fas fa-info-circle text-red-500 mt-1 mr-3"></i>
                      <div className="text-sm text-gray-300">
                        <p className="font-semibold text-red-400 mb-1">Emergency Protocol:</p>
                        <p>Once submitted, this request will be immediately broadcasted to all eligible donors within 25km radius. Blood banks will also be notified automatically.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={createRequestMutation.isPending}
                    className="w-full emergency-pulse bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-8 py-4 rounded-lg font-heading font-bold text-xl"
                    data-testid="button-send-alert"
                  >
                    {createRequestMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending Alert...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-broadcast-tower mr-3"></i>
                        Send Emergency Alert
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
