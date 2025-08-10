import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/ui/stats-card";
import { useGSAP } from "@/hooks/use-gsap";

const teamMembers = [
  {
    name: "Dr. Ananya Krishnan",
    role: "Chief Medical Officer",
    description: "15+ years in emergency medicine, passionate about healthcare innovation",
    color: "accent-green"
  },
  {
    name: "Arjun Malhotra",
    role: "CTO & Co-Founder",
    description: "Former Google engineer, expert in AI and real-time systems",
    color: "primary"
  },
  {
    name: "Priya Sharma",
    role: "Head of Operations",
    description: "Healthcare operations specialist with NGO background",
    color: "accent-coral"
  }
];

export default function About() {
  const { data: stats = {} } = useQuery({
    queryKey: ['/api/stats'],
  });

  useGSAP(() => {
    // Animate mission features
    window.gsap.utils.toArray('.mission-feature').forEach((feature: any, i: number) => {
      window.gsap.from(feature, {
        scrollTrigger: {
          trigger: feature,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.2
      });
    });

    // Animate team cards
    window.gsap.utils.toArray('.team-card').forEach((card: any, i: number) => {
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

  return (
    <div className="min-h-screen py-20 bg-dark-100" data-testid="about-page">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-5xl mb-6 text-white" data-testid="page-title">About BloodConnect</h2>
          <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto" data-testid="page-description">
            We're revolutionizing emergency blood donation through technology, connecting donors with those in need faster than ever before.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Mission Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="mission-content"
          >
            <h3 className="font-heading font-bold text-3xl text-white mb-6">Our Mission</h3>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Every minute counts in medical emergencies. BloodConnect bridges the critical gap between blood donors and those in urgent need, using AI-powered matching and real-time location services to save lives.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Since our launch, we've facilitated over 2,500 successful blood donations, directly contributing to saving thousands of lives across India.
            </p>
            
            <div className="space-y-4">
              <div className="mission-feature flex items-center" data-testid="feature-1">
                <div className="w-12 h-12 bg-accent-green rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-check text-white"></i>
                </div>
                <span className="text-white font-semibold">Instant donor matching within 2km radius</span>
              </div>
              <div className="mission-feature flex items-center" data-testid="feature-2">
                <div className="w-12 h-12 bg-accent-coral rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-check text-white"></i>
                </div>
                <span className="text-white font-semibold">24/7 emergency response system</span>
              </div>
              <div className="mission-feature flex items-center" data-testid="feature-3">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-check text-white"></i>
                </div>
                <span className="text-white font-semibold">Verified donor database with health screening</span>
              </div>
            </div>
          </motion.div>

          {/* Mission Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
            data-testid="mission-image"
          >
            <div className="relative bg-dark-200 rounded-2xl h-96 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-green/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <i className="fas fa-heart text-6xl mb-4 text-primary-500"></i>
                  <p className="text-lg">Medical professionals and volunteers</p>
                  <p className="text-sm mt-2">Working together to save lives</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Impact Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-dark-200 rounded-2xl p-12 border border-dark-300 mb-20"
          data-testid="impact-stats"
        >
          <h3 className="font-heading font-bold text-3xl text-white text-center mb-12">Our Impact</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard
              value={(stats as any)?.totalDonors?.toLocaleString() || "15,000+"}
              label="Registered Donors"
              color="accent-green"
            />
            <StatsCard
              value={(stats as any)?.totalDonations?.toLocaleString() || "2,500"}
              label="Lives Saved"
              color="accent-coral"
            />
            <StatsCard
              value="50+"
              label="Partner Hospitals"
              color="primary"
            />
            <StatsCard
              value="25"
              label="Cities Covered"
              color="yellow"
            />
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="font-heading font-bold text-3xl text-white mb-6" data-testid="team-title">Meet Our Team</h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Passionate healthcare professionals and technologists working together to save lives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={member.name}
              className="team-card bg-dark-300 border-dark-400 text-center hover:border-accent-green transition-all duration-300 transform hover:scale-105"
              data-testid={`team-member-${index + 1}`}
            >
              <CardContent className="p-6">
                <div className={`w-24 h-24 bg-gradient-to-r ${
                  member.color === 'accent-green' ? 'from-accent-green to-green-600' :
                  member.color === 'primary' ? 'from-primary-500 to-primary-700' :
                  'from-accent-coral to-red-600'
                } rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className="fas fa-user text-white text-2xl"></i>
                </div>
                <h4 className="font-heading font-semibold text-xl text-white mb-2">{member.name}</h4>
                <p className={`mb-3 ${
                  member.color === 'accent-green' ? 'text-accent-green' :
                  member.color === 'primary' ? 'text-primary-500' :
                  'text-accent-coral'
                }`}>{member.role}</p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
