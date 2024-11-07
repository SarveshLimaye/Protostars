import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  ArrowLeft,
  Copy,
} from "lucide-react";

interface FormData {
  email: string;
  linkedin: string;
  github: string;
}

interface TransactionStatusProps {
  isOpen: boolean;
  txHash: string;
  error: Error | null;
  onClose: () => void;
  formData: FormData;
  isLoading: boolean;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  isOpen,
  txHash,
  error,
  onClose,
  formData,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-zinc-800/90 text-white border-zinc-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {error
              ? "Transaction Failed"
              : txHash
              ? "Registration Successful"
              : "Processing Registration"}
          </CardTitle>
          <CardDescription className="text-center text-zinc-300">
            {error
              ? "There was an error processing your registration"
              : txHash
              ? "Your registration has been confirmed on the blockchain"
              : "Please wait while we process your registration"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">
            {error && <XCircle className="w-16 h-16 text-red-500" />}
            {txHash && <CheckCircle className="w-16 h-16 text-green-500" />}
            {isLoading && (
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            )}
          </div>

          {/* Registration Details */}
          <div className="space-y-4 bg-zinc-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Registration Details</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-zinc-400">Email:</span>
                <span>{formData.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-400">LinkedIn:</span>
                <span className="truncate max-w-[300px]">
                  {formData.linkedin}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-400">GitHub:</span>
                <span className="truncate max-w-[300px]">
                  {formData.github}
                </span>
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          {txHash && (
            <div className="space-y-4 bg-zinc-900/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Transaction Details</h3>
              <div className="flex items-center justify-between gap-2 break-all">
                <span className="text-zinc-400">Transaction Hash:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-[#7B3FE4]"
                    onClick={() => copyToClipboard(txHash)}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-[#7B3FE4]"
                    onClick={() =>
                      window.open(`https://etherscan.io/tx/${txHash}`, "_blank")
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Error Details */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">
                {error.message || "An unknown error occurred"}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {error && (
              <Button
                onClick={onClose}
                className="flex-1 bg-zinc-700 text-white hover:bg-[#7B3FE4] transition-all duration-300"
              >
                Try Again
              </Button>
            )}
            {txHash && (
              <Button
                onClick={onClose}
                className="flex-1 bg-zinc-700 text-white hover:bg-[#7B3FE4] transition-all duration-300"
              >
                Back to Home
              </Button>
            )}
            {isLoading && (
              <Button
                disabled
                className="flex-1 bg-zinc-700 text-white opacity-50 cursor-not-allowed"
              >
                Processing...
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionStatus;
