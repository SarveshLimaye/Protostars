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
import { ParticleProvider } from "@particle-network/provider";
import { User, Building2 } from "lucide-react";
import { ethers } from "ethers";
import { Toaster, toast } from "react-hot-toast";
import SkillVerifyAbi from "../../utils/skillverify.json";

export default function RegisterPage() {
  const [registrationType, setRegistrationType] = useState<
    "individual" | "company" | null
  >(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
      <Toaster position="top-right" />
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
  const [formData, setFormData] = useState({
    email: "",
    linkedin: "",
    github: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Individual Registration Data:", formData);

    try {
      if (window.ethereum._state.accounts.length !== 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS!,
          SkillVerifyAbi,
          signer
        );

        const accounts = await provider.listAccounts();
        const tx = await contract.registerUser(
          accounts[0],
          formData.linkedin,
          formData.github,
          formData.email
        );

        await tx.wait(1);

        toast.success("Individual registration submitted successfully!");
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
          process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS!,
          SkillVerifyAbi,
          signer
        );

        // console.log(contract);

        const tx = await contract.registerCompany(
          accounts[0],
          formData.linkedin,
          formData.github,
          formData.email
        );

        await tx.wait(1);

        toast.success("Individual registration submitted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the registration");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white text-lg">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedin" className="text-white text-lg">
          LinkedIn Profile URL
        </Label>
        <Input
          id="linkedin"
          name="linkedin"
          type="url"
          placeholder="https://www.linkedin.com/in/yourprofile"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
          value={formData.linkedin}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="github" className="text-white text-lg">
          GitHub Profile URL
        </Label>
        <Input
          id="github"
          name="github"
          type="url"
          placeholder="https://github.com/yourusername"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
          value={formData.github}
          onChange={handleChange}
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
  const [formData, setFormData] = useState({
    companyName: "",
    businessEmail: "",
    industry: "",
    companySize: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Company Registration Data:", formData);
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS!,
        SkillVerifyAbi,
        signer
      );

      const tx = await contract.registerCompany(
        formData.companyName,
        formData.businessEmail,
        formData.industry,
        Number(formData.companySize)
      );

      await tx.wait(1);

      toast.success("Company registration submitted successfully!");
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
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS!,
        SkillVerifyAbi,
        signer
      );

      // console.log(contract);

      const tx = await contract.registerCompany(
        formData.companyName,
        formData.businessEmail,
        formData.industry,
        formData.companySize
      );

      await tx.wait(1);

      toast.success("Company registration submitted successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-white text-lg">
          Company Name
        </Label>
        <Input
          id="companyName"
          name="companyName"
          placeholder="Acme Inc."
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
          value={formData.companyName}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="businessEmail" className="text-white text-lg">
          Business Email
        </Label>
        <Input
          id="businessEmail"
          name="businessEmail"
          type="email"
          placeholder="contact@acme.com"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
          value={formData.businessEmail}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry" className="text-white text-lg">
          Industry
        </Label>
        <Input
          id="industry"
          name="industry"
          placeholder="Technology"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
          value={formData.industry}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companySize" className="text-white text-lg">
          Company Size
        </Label>
        <Input
          id="companySize"
          name="companySize"
          placeholder="10"
          required
          className="bg-black text-white border-zinc-600 placeholder-zinc-400 text-lg"
          value={formData.companySize}
          onChange={handleChange}
        />
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
