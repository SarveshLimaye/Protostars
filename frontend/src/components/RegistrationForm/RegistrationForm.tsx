"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Building2 } from "lucide-react";

export default function RegisterPage() {
  const [registrationType, setRegistrationType] = useState<
    "individual" | "company" | null
  >(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-zinc-800/80 backdrop-blur-md border-zinc-700/50 shadow-xl text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/30 via-zinc-700/10 to-transparent pointer-events-none"></div>
        <CardHeader className="relative">
          <CardTitle className="text-3xl font-bold text-center text-white">
            Register for SkillSphere
          </CardTitle>
          <CardDescription className="text-center text-zinc-300">
            Choose your registration type to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {!registrationType ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center hover:[#7b3fe4] text-white border-zinc-600 text-lg"
                onClick={() => setRegistrationType("individual")}
              >
                <User size={32} className="mb-2" />
                Individual
              </Button>
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center hover:[#7b3fe4] text-white border-zinc-600 text-lg"
                onClick={() => setRegistrationType("company")}
              >
                <Building2 size={32} className="mb-2" />
                Company
              </Button>
            </div>
          ) : registrationType === "individual" ? (
            <IndividualRegistrationForm />
          ) : (
            <CompanyRegistrationForm />
          )}
          {registrationType && (
            <Button
              variant="link"
              className="mt-4 text-white hover:text-zinc-300 text-lg"
              onClick={() => setRegistrationType(null)}
            >
              Back to registration type selection
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function IndividualRegistrationForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white text-lg">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedin" className="text-white text-lg">
          LinkedIn Profile URL
        </Label>
        <Input
          id="linkedin"
          type="url"
          placeholder="https://www.linkedin.com/in/yourprofile"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="github" className="text-white text-lg">
          GitHub Profile URL
        </Label>
        <Input
          id="github"
          type="url"
          placeholder="https://github.com/yourusername"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-zinc-700 text-white hover:bg-zinc-600 text-lg"
      >
        Register as Individual
      </Button>
    </form>
  );
}

function CompanyRegistrationForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-white text-lg">
          Company Name
        </Label>
        <Input
          id="companyName"
          placeholder="Acme Inc."
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="businessEmail" className="text-white text-lg">
          Business Email
        </Label>
        <Input
          id="businessEmail"
          type="email"
          placeholder="contact@acme.com"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry" className="text-white text-lg">
          Industry
        </Label>
        <Input
          id="industry"
          placeholder="Technology"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companySize" className="text-white text-lg">
          Company Size
        </Label>
        <RadioGroup defaultValue="1-10">
          {["1-10", "11-50", "51-200", "201+"].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <RadioGroupItem
                value={size}
                id={size}
                className="border-zinc-600 text-white"
              />
              <Label htmlFor={size} className="text-white text-lg">
                {size} employees
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <Button
        type="submit"
        className="w-full bg-zinc-700 text-white hover:bg-zinc-600 text-lg"
      >
        Register as Company
      </Button>
    </form>
  );
}
