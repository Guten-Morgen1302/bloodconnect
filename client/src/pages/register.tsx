import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertDonorSchema, type InsertDonor } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";

const steps = [
  { id: 1, title: "Personal Information", icon: "fas fa-user" },
  { id: 2, title: "Health Information", icon: "fas fa-heart" },
  { id: 3, title: "Verification", icon: "fas fa-check-circle" }
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertDonor>({
    resolver: zodResolver(insertDonorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      bloodType: "",
      dateOfBirth: "",
      gender: "",
      weight: 50,
      address: "",
      latitude: "",
      longitude: "",
      isAvailable: true
    }
  });

  const createDonorMutation = useMutation({
    mutationFn: (data: InsertDonor) => apiRequest("POST", "/api/donors", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donors'] });
      toast({
        title: "Registration Successful!",
        description: "We will contact you soon for the blood checkup.",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertDonor) => {
    createDonorMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen py-20 bg-dark-100" data-testid="register-page">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-5xl mb-6 text-white" data-testid="page-title">Become a Life Saver</h2>
          <p className="font-body text-xl text-gray-300 max-w-2xl mx-auto" data-testid="page-description">
            Join thousands of verified donors making a difference in their communities. Complete registration in just 3 steps.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center mb-12"
            data-testid="progress-indicator"
          >
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-300 text-gray-400'
                    }`}
                    data-testid={`step-${step.id}`}
                  >
                    {currentStep > step.id ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 transition-all duration-300 ${
                        currentStep > step.id ? 'bg-primary-500' : 'bg-dark-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-dark-200 border-dark-300" data-testid="registration-form">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center">
                  {steps[currentStep - 1].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {currentStep === 1 && (
                      <div className="space-y-6" data-testid="step-1-content">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Full Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="bg-dark-300 border-dark-400 text-white"
                                    placeholder="Enter your full name"
                                    data-testid="input-full-name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Email Address *</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    className="bg-dark-300 border-dark-400 text-white"
                                    placeholder="your@email.com"
                                    data-testid="input-email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Phone Number *</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="tel"
                                    className="bg-dark-300 border-dark-400 text-white"
                                    placeholder="+91 XXXXX XXXXX"
                                    data-testid="input-phone"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Date of Birth *</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="date"
                                    className="bg-dark-300 border-dark-400 text-white"
                                    data-testid="input-date-of-birth"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Address *</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="bg-dark-300 border-dark-400 text-white h-24 resize-none"
                                  placeholder="Enter your complete address"
                                  data-testid="input-address"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6" data-testid="step-2-content">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="bloodType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Blood Type *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} data-testid="select-blood-type">
                                  <FormControl>
                                    <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
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
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Gender *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} data-testid="select-gender">
                                  <FormControl>
                                    <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Weight (kg) *</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="45"
                                    className="bg-dark-300 border-dark-400 text-white"
                                    placeholder="50"
                                    data-testid="input-weight"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6" data-testid="step-3-content">
                        <h4 className="font-semibold text-lg text-white">Health Screening</h4>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox id="health1" className="border-dark-400" data-testid="checkbox-health-1" />
                            <label htmlFor="health1" className="text-gray-300">
                              I am in good health and not currently taking any medications
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox id="health2" className="border-dark-400" data-testid="checkbox-health-2" />
                            <label htmlFor="health2" className="text-gray-300">
                              I have not donated blood in the last 3 months
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox id="terms" className="border-dark-400" data-testid="checkbox-terms" />
                            <label htmlFor="terms" className="text-gray-300">
                              I agree to terms and conditions and privacy policy
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-6">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="px-8 py-3 border-dark-400 text-gray-400 hover:bg-dark-300"
                          data-testid="button-back"
                        >
                          Back
                        </Button>
                      )}
                      
                      {currentStep < 3 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="px-8 py-3 bg-gradient-to-r from-accent-green to-green-600 hover:from-green-600 hover:to-green-700 ml-auto"
                          data-testid="button-next"
                        >
                          Continue to Next Step
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={createDonorMutation.isPending}
                          className="px-8 py-3 bg-gradient-to-r from-accent-green to-green-600 hover:from-green-600 hover:to-green-700 ml-auto"
                          data-testid="button-submit"
                        >
                          {createDonorMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Registering...
                            </>
                          ) : (
                            "Complete Registration"
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
