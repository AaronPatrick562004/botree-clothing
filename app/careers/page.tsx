import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, DollarSign, Users, Heart } from "lucide-react";

const jobOpenings = [
  {
    title: "Senior Fashion Designer",
    department: "Design",
    location: "Mumbai",
    type: "Full-time",
    experience: "5+ years",
    salary: "₹15-20 LPA",
    description: "Lead our design team in creating innovative collections that define the Botree aesthetic."
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Mumbai",
    type: "Full-time",
    experience: "3+ years",
    salary: "₹10-15 LPA",
    description: "Drive brand awareness and customer engagement through strategic marketing campaigns."
  },
  {
    title: "E-commerce Specialist",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
    salary: "₹6-9 LPA",
    description: "Manage our online store, optimize user experience, and drive sales growth."
  },
  {
    title: "Customer Support Executive",
    department: "Support",
    location: "Mumbai",
    type: "Full-time",
    experience: "1+ years",
    salary: "₹3-5 LPA",
    description: "Provide exceptional support to our customers and resolve inquiries with care."
  },
  {
    title: "Supply Chain Coordinator",
    department: "Operations",
    location: "Mumbai",
    type: "Full-time",
    experience: "2+ years",
    salary: "₹5-8 LPA",
    description: "Coordinate with suppliers and manage inventory to ensure smooth operations."
  },
  {
    title: "Social Media Manager",
    department: "Marketing",
    location: "Remote",
    type: "Part-time",
    experience: "2+ years",
    salary: "₹4-6 LPA",
    description: "Create engaging content and manage our social media presence across platforms."
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Health Insurance",
    description: "Comprehensive coverage for you and your family"
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Work-life balance with flexible timing"
  },
  {
    icon: Users,
    title: "Team Culture",
    description: "Collaborative and supportive environment"
  },
  {
    icon: DollarSign,
    title: "Competitive Pay",
    description: "Industry-leading compensation packages"
  }
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Join the Botree Team
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Help us shape the future of fashion. We're looking for passionate individuals who love what they do.
        </p>
      </div>

      {/* Why Join Us */}
      <div className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-center mb-8">Why Work With Us</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center p-6 bg-secondary/30 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-16">
        <h2 className="font-serif text-2xl font-bold mb-8">Open Positions</h2>
        <div className="space-y-4">
          {jobOpenings.map((job, index) => (
            <div key={index} className="bg-secondary/30 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                  <p className="text-sm text-primary">{job.department}</p>
                </div>
                <Button size="sm">Apply Now</Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                {job.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary/5 rounded-2xl p-12 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
          Don't See the Right Role?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/contact">Send Your Resume</Link>
        </Button>
      </div>
    </div>
  );
}