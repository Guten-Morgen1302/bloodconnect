import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGSAP } from "@/hooks/use-gsap";

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const contactInfo = [
  {
    title: "Emergency Hotline",
    subtitle: "Available 24/7",
    value: "+91-911-BLOOD-1",
    icon: "fas fa-phone",
    color: "accent-green"
  },
  {
    title: "Email Support",
    subtitle: "We'll respond within 2 hours",
    value: "support@bloodconnect.in",
    icon: "fas fa-envelope",
    color: "accent-coral"
  },
  {
    title: "Headquarters",
    subtitle: "Visit us during business hours",
    value: "Mumbai, Maharashtra 400001",
    icon: "fas fa-map-marker-alt",
    color: "primary"
  }
];

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  useGSAP(() => {
    // Animate contact cards
    window.gsap.utils.toArray('.contact-card').forEach((card: any, i: number) => {
      window.gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.1
      });
    });
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to Send Message",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen py-20 bg-dark-200" data-testid="contact-page">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-5xl mb-6 text-white" data-testid="page-title">Get In Touch</h2>
          <p className="font-body text-xl text-gray-300 max-w-2xl mx-auto" data-testid="page-description">
            Have questions or need support? We're here to help 24/7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-dark-300 border-dark-400" data-testid="contact-form">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-dark-200 border-dark-400 text-white focus:border-accent-green"
                                placeholder="John"
                                data-testid="input-first-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-dark-200 border-dark-400 text-white focus:border-accent-green"
                                placeholder="Doe"
                                data-testid="input-last-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-dark-200 border-dark-400 text-white focus:border-accent-green"
                              placeholder="john@example.com"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Subject</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} data-testid="select-subject">
                            <FormControl>
                              <SelectTrigger className="bg-dark-200 border-dark-400 text-white focus:border-accent-green">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="emergency">Medical Emergency</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="bg-dark-200 border-dark-400 text-white focus:border-accent-green h-32 resize-none"
                              placeholder="Tell us how we can help..."
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full bg-gradient-to-r from-accent-green to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
                      data-testid="button-send-message"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info, index) => (
                <Card
                  key={info.title}
                  className="contact-card bg-dark-300 border-dark-400 hover:border-accent-green transition-all duration-300"
                  data-testid={`contact-info-${index + 1}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        info.color === 'accent-green' ? 'bg-accent-green' :
                        info.color === 'accent-coral' ? 'bg-accent-coral' :
                        'bg-primary-500'
                      }`}>
                        <i className={`${info.icon} text-white`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{info.title}</h4>
                        <p className="text-gray-400">{info.subtitle}</p>
                      </div>
                    </div>
                    <p className={`text-lg font-semibold ${
                      info.color === 'accent-green' ? 'text-accent-green' :
                      info.color === 'accent-coral' ? 'text-accent-coral' :
                      'text-white'
                    }`} data-testid={`contact-value-${index + 1}`}>
                      {info.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <Card className="bg-dark-300 border-dark-400" data-testid="location-map">
              <CardHeader>
                <CardTitle className="text-white">Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-dark-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <i className="fas fa-map text-4xl mb-4"></i>
                    <p>Interactive map integration</p>
                    <p className="text-sm mt-2">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
