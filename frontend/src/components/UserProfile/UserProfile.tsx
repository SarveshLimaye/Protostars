"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Briefcase } from "lucide-react";

export function UserProfile({
  handleVerifyGithub,
  handleVerifyEmployment,
  githubStatus,
  employmentStatus,
  githubContributions,
  lastRole,
  lastCompany,
}: {
  handleVerifyGithub: () => void;
  handleVerifyEmployment: () => void;
  githubStatus: string;
  employmentStatus: string;
  githubContributions: string;
  lastRole: string;
  lastCompany: string;
}) {
  return (
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100">
      <CardHeader>
        <CardTitle className="text-white">Verify Your Profile</CardTitle>
        <CardDescription className="text-zinc-400">
          Connect your GitHub and verify your last employment to enhance your
          profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          {githubContributions !== "" ? (
            <Button className="w-full text-zinc-100 flex justify-center">
              Total Number of GitHub Contributions this year:{" "}
              {githubContributions}
            </Button>
          ) : (
            <Button
              onClick={handleVerifyGithub}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
            >
              <Github className="mr-2 h-4 w-4" />
              {githubStatus === "" ? "Verify GitHub" : githubStatus}
            </Button>
          )}
        </div>
        <div>
          {lastRole !== "" && lastCompany !== "" ? (
            <Button className="w-full text-zinc-100 flex justify-center flex-col py-8">
              <span>Last Company: {lastCompany}</span>
              <span>Last Role: {lastRole}</span>
            </Button>
          ) : (
            <Button
              onClick={handleVerifyEmployment}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              {employmentStatus === "" ? "Verify Employment" : employmentStatus}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
