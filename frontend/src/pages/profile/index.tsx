// @ts-nocheck comment
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import SkillVerifyAbi from "../../utils/skillverify.json";
import { CompanyProfile } from "@/components/CompanyProfile/CompanyProfile";
import { UserProfile } from "@/components/UserProfile/UserProfile";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

export default function Profile() {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [verifiedProfiles, setVerifiedProfiles] = useState([]);
  const [isCompanyProfile, setisCompanyProfile] = useState(false);
  const [githubStatus, setGithubStatus] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, address } = useAccount();

  const handleSearch = () => {
    console.log("Searching for:", candidateEmail);
  };

  const handleVerifyGithub = async () => {
    try {
      setGithubStatus("Initializing...");

      // Fetch the configuration from your backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reclaim/github/generate-config`
      );
      const { reclaimProofRequestConfig } = await response.json();

      // Reconstruct the ReclaimProofRequest object
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
        reclaimProofRequestConfig
      );

      // Generate request URL
      const requestUrl = await reclaimProofRequest.getRequestUrl();

      // Start the session for better UX
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          if (proofs) {
            if (typeof proofs === "string") {
              // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
              console.log("SDK Message:", proofs);
            } else if (typeof proofs !== "string") {
              // When using the default callback url, we get a proof object in the response
              console.log("Proofs", proofs);
              console.log("Proof received:", proofs?.claimData.context);
            }
            setGithubStatus("Proof received!");
          }
          // Handle successful verification (e.g., update UI, send to backend)
        },
        onFailure: (error) => {
          console.error("Verification failed", error);
          setGithubStatus("Verification failed. Please try again.");
          // Handle verification failure (e.g., show error message)
        },
      });

      console.log("Request URL:", requestUrl);
      setGithubStatus(
        "Reclaim process started. Please follow the instructions."
      );
    } catch (error) {
      console.error("Error initializing Reclaim:", error);
      setGithubStatus("Error initializing Reclaim. Please try again.");
      // Handle initialization error (e.g., show error message)
    }
  };

  const handleVerifyEmployment = async () => {
    try {
      setEmploymentStatus("Initializing...");

      // Fetch the configuration from your backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reclaim/linkedin/generate-config`
      );
      const { reclaimProofRequestConfig } = await response.json();

      // Reconstruct the ReclaimProofRequest object
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
        reclaimProofRequestConfig
      );

      // Generate request URL
      const requestUrl = await reclaimProofRequest.getRequestUrl();

      // Start the session for better UX
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          if (proofs) {
            if (typeof proofs === "string") {
              // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
              console.log("SDK Message:", proofs);
            } else if (typeof proofs !== "string") {
              // When using the default callback url, we get a proof object in the response
              console.log("Proofs", proofs);
              console.log("Proof received:", proofs?.claimData.context);
            }
            setEmploymentStatus("Proof received!");
          }
          // Handle successful verification (e.g., update UI, send to backend)
        },
        onFailure: (error) => {
          console.error("Verification failed", error);
          setEmploymentStatus("Verification failed. Please try again.");
          // Handle verification failure (e.g., show error message)
        },
      });

      console.log("Request URL:", requestUrl);
      setEmploymentStatus(
        "Reclaim process started. Please follow the instructions."
      );
    } catch (error) {
      console.error("Error initializing Reclaim:", error);
      setEmploymentStatus("Error initializing Reclaim. Please try again.");
      // Handle initialization error (e.g., show error message)
    }
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
                githubStatus={githubStatus}
                employmentStatus={employmentStatus}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
