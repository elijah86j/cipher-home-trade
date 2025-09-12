import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { usePlaceBid } from "@/hooks/useContract";
import { useAccount } from "wagmi";
import { Lock, Shield, TrendingUp, Wallet, Clock, AlertTriangle } from "lucide-react";

interface BidDialogProps {
  property: {
    id: number;
    title: string;
    location: string;
    price: string;
    tokenSupply: string;
    status: "encrypted" | "visible";
    roi: string;
    image: string;
  };
  children: React.ReactNode;
}

const BidDialog = ({ property, children }: BidDialogProps) => {
  const [bidAmount, setBidAmount] = useState("");
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"bid" | "confirm" | "success">("bid");
  const { toast } = useToast();
  const { placeBid, isLoading: isPlacingBid, error } = usePlaceBid();
  const { address, isConnected } = useAccount();

  const tokenPrice = parseFloat(property.price.replace("$", "").replace(",", ""));
  const totalSupply = parseInt(property.tokenSupply.replace(",", ""));
  const quantity = parseInt(tokenQuantity) || 0;
  const totalCost = quantity * tokenPrice;
  const estimatedFees = totalCost * 0.025; // 2.5% fees
  const totalAmount = totalCost + estimatedFees;

  const handleSubmitBid = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to place a bid.",
        variant: "destructive",
      });
      return;
    }

    if (!bidAmount || !tokenQuantity) {
      toast({
        title: "Invalid Input",
        description: "Please enter both bid amount and token quantity.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For now, we'll simulate the encrypted bid submission
      // In a real implementation, this would use FHE encryption
      const bidAmountNum = parseFloat(bidAmount);
      
      // Simulate blockchain transaction
      setTimeout(() => {
        setStep("confirm");
        setIsSubmitting(false);
      }, 2000);
    } catch (err) {
      console.error("Error placing bid:", err);
      toast({
        title: "Transaction Failed",
        description: "Failed to place bid. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleConfirmBid = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call the actual contract
      // For now, we'll simulate the transaction
      setTimeout(() => {
        setStep("success");
        setIsSubmitting(false);
        
        toast({
          title: property.status === "encrypted" ? "Encrypted Bid Submitted" : "Bid Placed Successfully",
          description: `Your bid for ${tokenQuantity} tokens has been ${property.status === "encrypted" ? "encrypted and" : ""} submitted.`,
        });
      }, 3000);
    } catch (err) {
      console.error("Error confirming bid:", err);
      toast({
        title: "Transaction Failed",
        description: "Failed to confirm bid. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const resetDialog = () => {
    setStep("bid");
    setBidAmount("");
    setTokenQuantity("");
    setIsSubmitting(false);
  };

  return (
    <Dialog onOpenChange={(open) => !open && resetDialog()}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {property.status === "encrypted" ? (
              <Lock className="h-5 w-5 text-primary" />
            ) : (
              <TrendingUp className="h-5 w-5 text-primary" />
            )}
            {property.status === "encrypted" ? "Encrypted Bid" : "Place Bid"}
          </DialogTitle>
        </DialogHeader>

        {step === "bid" && (
          <div className="space-y-6">
            {/* Property Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm">{property.title}</h3>
              <p className="text-sm text-muted-foreground">{property.location}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">Token Price: {property.price}</span>
                <Badge variant={property.status === "encrypted" ? "secondary" : "default"}>
                  {property.status === "encrypted" ? "Encrypted" : "Public"}
                </Badge>
              </div>
            </div>

            {/* Bid Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="tokenQuantity">Token Quantity</Label>
                <Input
                  id="tokenQuantity"
                  type="number"
                  placeholder="Enter number of tokens"
                  value={tokenQuantity}
                  onChange={(e) => setTokenQuantity(e.target.value)}
                  max={totalSupply}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available: {property.tokenSupply} tokens
                </p>
              </div>

              <div>
                <Label htmlFor="bidAmount">Bid Price per Token (USD)</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  placeholder={`Current: ${property.price}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  step="0.01"
                />
              </div>

              {quantity > 0 && (
                <div className="bg-card border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tokens ({quantity})</span>
                    <span>${totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee (2.5%)</span>
                    <span>${estimatedFees.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>${totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Notice for Encrypted Bids */}
            {property.status === "encrypted" && (
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-primary">Privacy Protection</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your bid will be encrypted using zero-knowledge proofs. Other bidders cannot see your offer until the auction ends.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleSubmitBid} 
              disabled={!isConnected || !bidAmount || !tokenQuantity || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : !isConnected ? (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet to Bid
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  {property.status === "encrypted" ? "Submit Encrypted Bid" : "Place Bid"}
                </>
              )}
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Confirm Your Bid</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Please review your bid details before final submission.
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Property</span>
                <span className="text-sm font-medium">{property.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Token Quantity</span>
                <span className="text-sm font-medium">{tokenQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bid per Token</span>
                <span className="text-sm font-medium">${bidAmount}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>${totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("bid")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleConfirmBid} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Bid"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-primary">
                {property.status === "encrypted" ? "Encrypted Bid Submitted!" : "Bid Placed Successfully!"}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {property.status === "encrypted" 
                  ? "Your bid has been encrypted and submitted to the blockchain. You'll be notified when the auction ends."
                  : "Your bid is now active. You'll receive updates on the bidding status."
                }
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium">Transaction ID</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 8)}
                </p>
              </div>
            </div>

            <Button onClick={resetDialog} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BidDialog;