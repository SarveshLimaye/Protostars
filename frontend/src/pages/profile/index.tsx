// @ts-nocheck comment
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import SkillVerifyAbi from "../../utils/skillverify.json";
import { CompanyProfile } from "@/components/CompanyProfile/CompanyProfile";
import { UserProfile } from "@/components/UserProfile/UserProfile";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";

export default function Profile() {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [verifiedProfiles, setVerifiedProfiles] = useState([]);
  const [isCompanyProfile, setisCompanyProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, address } = useAccount();

  const handleSearch = () => {
    console.log("Searching for:", candidateEmail);
  };

  const handleVerifyGithub = () => {
    console.log("Verifying GitHub");
  };

  const handleVerifyEmployment = () => {
    console.log("Verifying Last Employment");
  };

  useEffect(() => {
    async function checkCompanyProfile() {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC!
      );
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_SKILLVERIFY_ADDRESS,
        SkillVerifyAbi,
        provider
      );
      const isWhiteListed = await contract.isCompanyWhitelisted(address);
      console.log(isWhiteListed);
      setisCompanyProfile(isWhiteListed);
      setIsLoading(false);
    }

    if (isConnected) {
      checkCompanyProfile();
      console.log(isCompanyProfile, "profile");
    }
  }, [isConnected, address]);

  return (
    <>
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" color="accent" />
        </div>
      ) : (
        <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8 pt-20">
          <div className="max-w-4xl mx-auto mt-20">
            {isCompanyProfile ? (
              <CompanyProfile
                candidateEmail={candidateEmail}
                setCandidateEmail={setCandidateEmail}
                handleSearch={handleSearch}
                verifiedProfiles={verifiedProfiles}
              />
            ) : (
              <UserProfile
                handleVerifyGithub={handleVerifyGithub}
                handleVerifyEmployment={handleVerifyEmployment}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
