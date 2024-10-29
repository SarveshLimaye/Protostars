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
import { Search, Github, Briefcase, Linkedin } from "lucide-react";
import { z } from "zod";
import { ethers } from "ethers";
import { Toaster, toast } from "react-hot-toast";
import SkillVerifyAbi from "../../utils/skillverify.json";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function CompanyProfile() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [allUserProfiles, setAllUserProfiles] = useState<any[]>([]);

  const checkEmailRegistration = async () => {
    try {
      emailSchema.parse({ email });
      setErrors({});
      setIsLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_SKILLVERIFY_ADDRESS!,
        SkillVerifyAbi,
        signer
      );

      const userId = await contract.emailToUserId(email);

      if (userId.toNumber() === 0) {
        setIsRegistered(false);
        setUserProfile(null);
        return;
      }

      const userInfo = await contract.userIdtoUser(userId);
      setIsRegistered(true);
      setUserProfile({
        id: userInfo.id.toString(),
        walletAddress: userInfo.walletAddress,
        email: userInfo.mail,
        github: userInfo.githubProfile,
        linkedin: userInfo.linkdeinProfile,
        contributions: userInfo.githubContributions.trim().replace(/\\n/g, ""),
        lastRole: userInfo.lastRole,
        lastCompany: userInfo.lastCompany,
        tier: userInfo.tierList.toString(),
      });
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
      } else {
        console.error("Contract interaction error:", error);
        setErrors({ email: "Error checking registration status" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logAllUserProfiles = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_SKILLVERIFY_ADDRESS!,
        SkillVerifyAbi,
        signer
      );

      const totalUsers = await contract.getTotalUsers();

      const profiles = [];
      for (let i = 1; i <= totalUsers; i++) {
        const userInfo = await contract.userIdtoUser(i);
        profiles.push({
          id: userInfo.id.toString(),
          walletAddress: userInfo.walletAddress,
          email: userInfo.mail,
          github: userInfo.githubProfile,
          linkedin: userInfo.linkdeinProfile,
          contributions: userInfo.githubContributions,
          lastRole: userInfo.lastRole,
          lastCompany: userInfo.lastCompany,
          tier: userInfo.tierList.toString(),
        });
      }
      setAllUserProfiles(profiles);
    } catch (error) {
      console.error("Contract interaction error:", error);
    }
  };
  const sendInvitation = (emailToInvite: string) => {
    try {
      fetch(process.env.NEXT_PUBLIC_NODEMAILER_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailToInvite }),
      });

      toast.success("Invitation sent successfully!");
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    }
  };
  return (
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100 relative">
      <Toaster position="top-right" />
      {isRegistered !== null && (
        <div className="absolute top-4 right-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              isRegistered
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {isRegistered ? "Member" : "Not a Member"}
          </span>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-white">Candidate Verification</CardTitle>
        <CardDescription className="text-zinc-400">
          Checkout candidate's profile by entering their email
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 mb-6">
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Candidate's Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
                setIsRegistered(null);
                setUserProfile(null);
              }}
              className={`bg-zinc-700 border-zinc-600 text-zinc-100 placeholder-zinc-400 ${
                errors.email ? "border-red-500" : ""
              }`}
              disabled={isLoading}
            />
            <Button
              onClick={checkEmailRegistration}
              className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">
                {isLoading ? "Verifying..." : "Search"}
              </span>
            </Button>
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm block">{errors.email}</span>
          )}
        </div>

        {isRegistered !== null && (
          <Card className="bg-zinc-700 border-zinc-600 mt-4">
            <CardContent className="pt-6">
              {isRegistered ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-green-400 font-medium">
                      ✓ Email is registered
                    </p>
                  </div>
                  {userProfile && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <a
                          href={userProfile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-zinc-200 hover:text-zinc-100 transition-colors"
                        >
                          <Github className="h-5 w-5" />
                          <span>GitHub Profile</span>
                        </a>
                        <a
                          href={userProfile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-zinc-200 hover:text-zinc-100 transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                          <span>LinkedIn Profile</span>
                        </a>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-5 w-5 text-zinc-400" />
                          <span className="text-zinc-200">
                            {userProfile.lastRole} at {userProfile.lastCompany}
                          </span>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-4">
                          <div className="flex justify-between items-baseline mb-1">
                            <p className="text-zinc-400 text-sm">
                              GitHub Contributions
                            </p>
                            <span className="text-zinc-500 text-xs">
                              Past 12 months
                            </span>
                          </div>
                          <p className="text-zinc-100 text-2xl font-bold">
                            {userProfile.contributions}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">✗ Email is not registered</p>
                  <Button
                    className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white font-medium py-2 px-8 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                    onClick={() => sendInvitation(email)}
                  >
                    Invite Candidate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>

      <div className="flex justify-end mt-4 px-6 pb-6">
        <Button
          onClick={logAllUserProfiles}
          className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
        >
          View all candidate profiles
        </Button>
      </div>

      {allUserProfiles.length > 0 && (
        <div className="mt-4 px-6 pb-6">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {allUserProfiles.map((profile, index) => (
              <Card
                key={index}
                className="bg-zinc-700 border-zinc-600 flex-shrink-0 w-64"
              >
                <CardContent className="p-4">
                  <p className="text-zinc-200 font-medium mb-2">
                    #{profile.id}
                  </p>
                  <p className="text-zinc-300">{profile.email}</p>
                  <div className="flex space-x-2 mt-3">
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-zinc-200"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-zinc-200"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default CompanyProfile;
