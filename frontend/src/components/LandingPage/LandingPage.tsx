// @ts-nocheck comment
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Shield, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Showcase Your Skills, Protect Your Identity
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            SkillSphere empowers professionals to verify their qualifications
            and access opportunities while maintaining pseudonymity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="relative overflow-hidden transition-all duration-300 hover:bg-[#7B3FE4] hover:scale-105 hover:shadow-lg hover:shadow-[#7B3FE4]/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#7B3FE4]/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="transition-all duration-300 hover:border-[#7B3FE4] hover:text-[#7B3FE4] hover:scale-105"
            >
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose SkillSphere?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Verified Skills",
                description: "Showcase your abilities with cryptographic proof",
                icon: CheckCircle,
              },
              {
                title: "Pseudonymous Identity",
                description:
                  "Maintain privacy while building your professional profile",
                icon: Shield,
              },
              {
                title: "Access Opportunities",
                description:
                  "Connect with employers and collaborators globally",
                icon: Zap,
              },
              {
                title: "Build Trust",
                description:
                  "Establish credibility without compromising personal information",
                icon: Users,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group bg-primary-foreground/10 backdrop-blur-lg border border-primary/20 hover:bg-primary/20 transition-all duration-300 ease-in-out"
              >
                <CardHeader>
                  <feature.icon className="w-10 h-10 mb-4 text-primary-foreground group-hover:text-[#7b3fe4] transition-colors duration-300" />
                  <CardTitle className="text-primary-foreground group-hover:text-primary-foreground/90 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-primary-foreground/80 group-hover:text-primary-foreground transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Create Your Profile",
                description:
                  "Sign up and build your pseudonymous professional identity",
              },
              {
                title: "Verify Your Skills",
                description: "Verify your credentials using reclaim protocol",
              },
              {
                title: "Connect and Collaborate",
                description:
                  "Access job opportunities and connect with potential collaborators",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Showcase Your Skills?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join SkillSphere today and take control of your professional
            identity while accessing global opportunities.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
