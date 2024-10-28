"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Github, Briefcase, Search } from "lucide-react";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function CompanyProfile({
  candidateEmail,
  setCandidateEmail,
  handleSearch,
  verifiedProfiles,
}: {
  candidateEmail: string;
  setCandidateEmail: (email: string) => void;
  handleSearch: () => void;
  verifiedProfiles: Array<{
    email: string;
    github: string;
    lastEmployment: string;
  }>;
}) {
  const [errors, setErrors] = useState<{ email?: string }>({});

  const search = () => {
    try {
      emailSchema.parse({ email: candidateEmail });
      setErrors({});
      handleSearch();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {}
        );
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
      <CardHeader>
        <CardTitle className="text-white">Candidate Verification</CardTitle>
        <CardDescription className="text-zinc-400">
          Enter a candidate's email to view their verified profiles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-6">
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Candidate email"
              value={candidateEmail}
              onChange={(e) => {
                setCandidateEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
              className={`bg-zinc-700 border-zinc-600 text-zinc-100 placeholder-zinc-400 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            <Button
              onClick={search}
              className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
            >
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm block">{errors.email}</span>
          )}
        </div>
        <div className="space-y-4">
          {verifiedProfiles.map((profile, index) => (
            <Card
              key={index}
              className="bg-zinc-700 border-zinc-600 text-zinc-100"
            >
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  {profile.email}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-200">
                  <Github className="inline mr-2" /> GitHub: {profile.github}
                </p>
                <p className="text-zinc-200">
                  <Briefcase className="inline mr-2" /> Last Employment:{" "}
                  {profile.lastEmployment}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
