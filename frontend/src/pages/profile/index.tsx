// @ts-nocheck comment
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import SkillVerifyAbi from "../../utils/skillverify.json";
import { CompanyProfile } from "@/components/CompanyProfile/CompanyProfile";
import { UserProfile } from "@/components/UserProfile/UserProfile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { QRCodeSVG } from "qrcode.react";

import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { Toaster, toast } from "react-hot-toast";

export default function Profile() {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [verifiedProfiles, setVerifiedProfiles] = useState([]);
  const [isCompanyProfile, setisCompanyProfile] = useState(false);
  const [githubStatus, setGithubStatus] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [githubContributions, setGithubContributions] = useState("");
  const [lastRole, setLastRole] = useState("");
  const [lastCompany, setLastCompany] = useState("");
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
        onSuccess: async (proofs) => {
          if (proofs) {
            if (typeof proofs === "string") {
              // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
              console.log("SDK Message:", proofs);
            } else if (typeof proofs !== "string") {
              // When using the default callback url, we get a proof object in the response
              console.log("Proofs", proofs);
              setIsModalOpen(false);
              console.log("Proof received:", proofs?.claimData.context);
            }
            setGithubStatus("Proof received. Please sign the transaction.");

            const trgt = '"contributions":"';

            const ctx = proofs?.claimData.context;

            const claimInfo = {
              provider: proofs?.claimData.provider,
              parameters: proofs?.claimData.parameters,
              context: proofs?.claimData.context,
            };

            const signedClaim = {
              claim: {
                identifier: proofs?.claimData.identifier,
                owner: proofs?.claimData.owner,
                epoch: proofs?.claimData.epoch,
                timestampS: proofs?.claimData.timestampS,
              },
              signatures: proofs?.signatures,
            };

            const proofObj = {
              claimInfo: claimInfo,
              signedClaim: signedClaim,
            };

            if (window.ethereum._state.accounts.length !== 0) {
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const signer = provider.getSigner();
              const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_SKILLVERIFY_ADDRESS!,
                SkillVerifyAbi,
                signer
              );

              const accounts = await provider.listAccounts();
              const tx = await contract.verifyProofGithub(proofObj, ctx, trgt);

              await tx.wait(1);

              toast.success("Github verification submitted successfully!");
            } else {
              //@ts-ignore
              const particleProvider = new ParticleProvider(particle.auth);
              console.log(particleProvider);
              const accounts = await particleProvider.request({
                method: "eth_accounts",
              });
              const ethersProvider = new ethers.providers.Web3Provider(
                particleProvider,
                "any"
              );
              const signer = ethersProvider.getSigner();

              const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_SKILLVERIFY_ADDRESS!,
                SkillVerifyAbi,
                signer
              );

              // console.log(contract);

              const tx = await contract.verifyProofGithub(proofObj, ctx, trgt);

              await tx.wait(1);

              toast.success("Github verification submitted successfully!");
            }
          }
          // Handle successful verification (e.g., update UI, send to backend)
          setGithubStatus("Thank you for verifying your Github account.");
        },
        onFailure: (error) => {
          console.error("Verification failed", error);
          setGithubStatus("Verification failed. Please try again.");
          // Handle verification failure (e.g., show error message)
        },
      });
      console.log("Request URL:", requestUrl);
      setQrCodeUrl(requestUrl);
      setGithubStatus(
        "Reclaim process started. Please follow the instructions."
      );
      setIsModalOpen(true);
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
        onSuccess: async (proofs) => {
          if (proofs) {
            if (typeof proofs === "string") {
              // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
              console.log("SDK Message:", proofs);
            } else if (typeof proofs !== "string") {
              // When using the default callback url, we get a proof object in the response
              setIsModalOpen(false);
              console.log("Proofs", proofs);
              console.log("Proof received:", proofs?.claimData.context);
            }
            setEmploymentStatus("Proof received. Please sign the transaction.");

            const trgt = '"companyName":"';
            const trgt2 = '"role":"';

            const ctx = proofs?.claimData.context;

            const claimInfo = {
              provider: proofs?.claimData.provider,
              parameters: proofs?.claimData.parameters,
              context: proofs?.claimData.context,
            };

            const signedClaim = {
              claim: {
                identifier: proofs?.claimData.identifier,
                owner: proofs?.claimData.owner,
                epoch: proofs?.claimData.epoch,
                timestampS: proofs?.claimData.timestampS,
              },
              signatures: proofs?.signatures,
            };

            const proofObj = {
              claimInfo: claimInfo,
              signedClaim: signedClaim,
            };

            if (window.ethereum._state.accounts.length !== 0) {
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const signer = provider.getSigner();
              const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_SKILLVERIFY_ADDRESS!,
                SkillVerifyAbi,
                signer
              );

              const accounts = await provider.listAccounts();
              const tx = await contract.verifyProofLinkedin(
                proofObj,
                ctx,
                trgt2,
                trgt
              );

              await tx.wait(1);

              toast.success("LinkedIn verification submitted successfully!");
            } else {
              //@ts-ignore
              const particleProvider = new ParticleProvider(particle.auth);
              console.log(particleProvider);
              const accounts = await particleProvider.request({
                method: "eth_accounts",
              });
              const ethersProvider = new ethers.providers.Web3Provider(
                particleProvider,
                "any"
              );
              const signer = ethersProvider.getSigner();

              const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_SKILLVERIFY_ADDRESS!,
                SkillVerifyAbi,
                signer
              );

              // console.log(contract);

              const tx = await contract.verifyProofLinkedin(
                proofObj,
                ctx,
                trgt2,
                trgt
              );

              await tx.wait(1);

              toast.success("LinkedIn verification submitted successfully!");
            }
          }
          // Handle successful verification (e.g., update UI, send to backend)

          setEmploymentStatus(
            "Thank you for verifying your Recent Employment."
          );
        },
        onFailure: (error) => {
          console.error("Verification failed", error);
          setEmploymentStatus("Verification failed. Please try again.");
          // Handle verification failure (e.g., show error message)
        },
      });

      console.log("Request URL:", requestUrl);
      setQrCodeUrl(requestUrl);
      setEmploymentStatus(
        "Reclaim process started. Please follow the instructions."
      );
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error initializing Reclaim:", error);
      setEmploymentStatus("Error initializing Reclaim. Please try again.");
      // Handle initialization error (e.g., show error message)
    }
  };
  const getVerifiedUserData = async () => {
    try {
      if (window.ethereum._state.accounts.length !== 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_SKILLVERIFY_ADDRESS!,
          SkillVerifyAbi,
          signer
        );

        const accounts = await provider.listAccounts();
        const userID = await contract.walletAddressToId(address);

        const userData = await contract.userIdtoUser(userID);

        console.log(userData);
        setGithubContributions(
          userData.githubContributions.trim().replace(/\\n/g, "")
        );

        setLastRole(userData.lastRole);
        setLastCompany(userData.lastCompany);

        // toast.success("Github verification submitted successfully!");
      } else {
        const particleProvider = new ParticleProvider(particle.auth);
        const accounts = await particleProvider.request({
          method: "eth_accounts",
        });
        const ethersProvider = new ethers.providers.Web3Provider(
          particleProvider,
          "any"
        );
        const signer = ethersProvider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_SKILLVERIFY_ADDRESS!,
          SkillVerifyAbi,
          signer
        );
        const userID = await contract.walletAddressToId(address);

        const userData = await contract.userIdtoUser(userID);

        console.log(userData);
        setGithubContributions(
          userData.githubContributions.trim().replace(/\\n/g, "")
        );

        setLastRole(userData.lastRole);
        setLastCompany(userData.lastCompany);
      }
    } catch (error) {
      console.error("Error Fetching data", error);
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
      // const userid = await contract.getUserId(address);
      console.log(isWhiteListed);
      setisCompanyProfile(isWhiteListed);
      setIsLoading(false);
    }

    if (isConnected) {
      checkCompanyProfile();
      console.log(isCompanyProfile, "profile");
    }
  }, [isConnected, address]);

  useEffect(() => {
    getVerifiedUserData();
  }, [githubContributions, lastRole, lastCompany]);

  return (
    <>
      <Toaster position="top-right" />
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" color="accent" />
        </div>
      ) : (
        <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8 pt-20">
          <div className="max-w-4xl mx-auto mt-20">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan QR Code to Verify</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                  {qrCodeUrl && <QRCodeSVG value={qrCodeUrl} size={256} />}
                </div>
              </DialogContent>
            </Dialog>
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
                githubContributions={githubContributions}
                lastRole={lastRole}
                lastCompany={lastCompany}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
