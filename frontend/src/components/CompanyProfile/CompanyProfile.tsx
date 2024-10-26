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
  return (
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
      <CardHeader>
        <CardTitle className="text-white">Candidate Verification</CardTitle>
        <CardDescription className="text-zinc-400">
          Enter a candidate's email to view their verified profiles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            type="email"
            placeholder="Candidate email"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
            className="bg-zinc-700 border-zinc-600 text-zinc-100 placeholder-zinc-400"
          />
          <Button
            onClick={handleSearch}
            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
          >
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
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
