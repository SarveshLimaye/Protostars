// @ts-nocheck comment
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
import Router from "next/router";
import SkillVerifyAbi from "../../utils/skillverify.json";

export default function RegisterPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center hover:[#7b3fe4] text-white border-zinc-600 text-lg"
              onClick={() => Router.push("/register/individual")}
            >
              <User size={32} className="mb-2" />
              Individual
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center hover:[#7b3fe4] text-white border-zinc-600 text-lg"
              onClick={() => Router.push("/register/company")}
            >
              <Building2 size={32} className="mb-2" />
              Company
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
