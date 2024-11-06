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
import {
  Search,
  Github,
  Briefcase,
  Linkedin,
  Upload,
  X,
  AlertCircle,
  Timer,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { z } from "zod";
import { ethers } from "ethers";
import { Toaster, toast } from "react-hot-toast";
import SkillVerifyAbi from "../../utils/skillverify.json";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface UserProfile {
  id: string;
  walletAddress: string;
  email: string;
  github: string;
  linkedin: string;
  contributions: string;
  lastRole: string;
  lastCompany: string;
  tier: string;
}

export function CompanyProfile() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [allUserProfiles, setAllUserProfiles] = useState<UserProfile[]>([]);
  const [csvEmails, setCsvEmails] = useState<string[]>([]);
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

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
      toast.error("Failed to fetch user profiles");
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && line !== "email"); // Skip header and empty lines

      const validEmails: string[] = [];
      const invalidEmails: string[] = [];

      lines.forEach((email) => {
        try {
          emailSchema.parse({ email });
          validEmails.push(email);
        } catch {
          invalidEmails.push(email);
        }
      });

      setCsvEmails(validEmails);
      setInvalidEmails(invalidEmails);

      toast.success(`Loaded ${validEmails.length} valid email addresses`);
      if (invalidEmails.length > 0) {
        toast.error(`Found ${invalidEmails.length} invalid email addresses`);
      }
    };
    reader.readAsText(file);
  };

  const sendBulkInvitations = () => {
    if (csvEmails.length === 0) {
      toast.error("No valid emails to process");
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: csvEmails.length });

    const failedEmails: { email: string; error: string }[] = [];
    const MAX_RETRIES = 3;
    const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests

    for (let i = 0; i < csvEmails.length; i++) {
      const email = csvEmails[i];
      let retries = 0;
      let success = false;

      while (retries < MAX_RETRIES && !success) {
        try {
          fetch(process.env.NEXT_PUBLIC_NODEMAILER_URL!, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          // if (!response.ok) {
          //   const errorData = await response.text();
          //   throw new Error(
          //     `Server responded with ${response.status}: ${errorData}`
          //   );
          // }

          success = true;
          setProgress((prev) => ({ ...prev, current: i + 1 }));

          // Show progress toast every 5 emails
          if ((i + 1) % 5 === 0) {
            toast.success(
              `Progress: ${i + 1}/${csvEmails.length} emails processed`
            );
          }
        } catch (error) {
          retries++;
          console.error(`Attempt ${retries} failed for ${email}:`, error);

          if (retries === MAX_RETRIES) {
            failedEmails.push({
              email,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          } else {
            // Wait before retrying with exponential backoff
            new Promise((resolve) =>
              setTimeout(resolve, RATE_LIMIT_DELAY * Math.pow(2, retries - 1))
            );
          }
        }
      }

      // Rate limiting delay between emails
      if (i < csvEmails.length - 1) {
        // Don't delay after the last email
        new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }

    setIsProcessing(false);

    if (failedEmails.length > 0) {
      console.error("Failed emails:", failedEmails);
      toast.error(
        `Failed to send ${failedEmails.length} invitation${
          failedEmails.length > 1 ? "s" : ""
        }. Check console for details.`,
        {
          duration: 5000,
        }
      );

      // Show detailed error modal or update UI with failed emails
      failedEmails.forEach(({ email, error }) => {
        console.error(`Failed to send invitation to ${email}: ${error}`);
      });
    } else {
      toast.success("All invitations sent successfully!", {
        duration: 3000,
      });
    }

    // Don't clear emails if there were failures, so user can retry
    if (failedEmails.length === 0) {
      setCsvEmails([]);
      setInvalidEmails([]);
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

  const clearCSVEmails = () => {
    setCsvEmails([]);
    setInvalidEmails([]);
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
          Check candidate profiles or invite candidates individually or in bulk
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

        <div className="mt-8 space-y-6">
          <div className="border-t border-zinc-700 pt-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <FileSpreadsheet className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Bulk Invite</h3>
                <p className="text-sm text-zinc-400">
                  Upload a CSV file with candidate emails
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {!csvEmails.length && !invalidEmails.length ? (
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8">
                  <div className="flex flex-col items-center text-center">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="hidden"
                      id="csv-upload"
                      disabled={isProcessing}
                    />
                    <label
                      htmlFor="csv-upload"
                      className="cursor-pointer group flex flex-col items-center justify-center"
                    >
                      <div className="h-12 w-12 rounded-full bg-zinc-700 group-hover:bg-zinc-600 flex items-center justify-center transition-colors mb-2">
                        <Upload className="h-6 w-6 text-zinc-300" />
                      </div>
                      <div className="text-zinc-300">
                        Drop your CSV file here or click to browse
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">
                        Only .csv files are supported
                      </p>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-zinc-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <span className="text-zinc-200">
                          {csvEmails.length} valid email
                          {csvEmails.length !== 1 ? "s" : ""} ready to send
                        </span>
                      </div>
                      <Button
                        onClick={clearCSVEmails}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-zinc-600/50"
                        disabled={isProcessing}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>

                    <div className="max-h-40 overflow-y-auto rounded-md bg-zinc-800/50 p-3">
                      {csvEmails.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 py-1.5 px-2 rounded hover:bg-zinc-700/30"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-400"></div>
                          <span className="text-sm text-zinc-300">{email}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {invalidEmails.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <span className="text-red-400">
                          {invalidEmails.length} invalid email
                          {invalidEmails.length !== 1 ? "s" : ""} found
                        </span>
                      </div>

                      <div className="max-h-32 overflow-y-auto rounded-md bg-red-500/5 p-3">
                        {invalidEmails.map((email, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 py-1.5 px-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-red-400"></div>
                            <span className="text-sm text-red-300">
                              {email}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    {isProcessing && (
                      <div className="flex items-center space-x-2 text-zinc-400">
                        <Timer className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">
                          Processing: {progress.current}/{progress.total}
                        </span>
                      </div>
                    )}
                    <Button
                      onClick={sendBulkInvitations}
                      className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 h-11"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full bg-white animate-bounce"></span>
                          <span
                            className="h-2 w-2 rounded-full bg-white animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></span>
                          <span
                            className="h-2 w-2 rounded-full bg-white animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></span>
                        </span>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Send {csvEmails.length} Invitation
                          {csvEmails.length !== 1 ? "s" : ""}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
