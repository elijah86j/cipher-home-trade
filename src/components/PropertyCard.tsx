import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Lock, MapPin, TrendingUp, Info } from "lucide-react";
import { useState } from "react";
import BidDialog from "./BidDialog";
import PropertyDetailDialog from "./PropertyDetailDialog";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  tokenSupply: string;
  image: string;
  status: "encrypted" | "visible";
  roi: string;
}

const PropertyCard = ({ id, title, location, price, tokenSupply, image, status, roi }: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(status === "visible");

  return (
    <Card 
      className="property-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img 
          src={image} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Encrypted overlay */}
        <div className="property-encrypted-overlay flex items-center justify-center">
          <div className="text-center">
            <Lock className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium">Encrypted Bid Active</p>
          </div>
        </div>
        
        {/* Gradient overlay for readability */}
        <div className="gradient-property absolute bottom-0 left-0 right-0 h-1/2" />
        
        {/* Status badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant={status === "encrypted" ? "secondary" : "default"} className="glow-effect">
            {status === "encrypted" ? "Encrypted" : "Public"}
          </Badge>
          <Badge variant="outline" className="bg-background/20 backdrop-blur">
            <TrendingUp className="h-3 w-3 mr-1" />
            {roi}
          </Badge>
        </div>
        
        {/* Toggle visibility button */}
        <Button
          size="sm"
          variant="outline"
          className="absolute top-3 left-3 bg-background/20 backdrop-blur border-white/20"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
        >
          {showDetails ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {showDetails ? title : "••••••••••"}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {showDetails ? location : "Location Hidden"}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Token Price</p>
              <p className="font-semibold">
                {showDetails ? price : "••••"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supply</p>
              <p className="font-semibold">
                {showDetails ? tokenSupply : "••••"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <BidDialog property={{ id, title, location, price, tokenSupply, status, roi, image }}>
              <Button 
                className="flex-1" 
                variant={status === "encrypted" ? "secondary" : "default"}
              >
                {status === "encrypted" ? "Encrypted Bid" : "Place Bid"}
              </Button>
            </BidDialog>
            <PropertyDetailDialog property={{ id, title, location, price, tokenSupply, status, roi, image }}>
              <Button variant="outline" className="flex-1">
                <Info className="h-4 w-4 mr-1" />
                Details
              </Button>
            </PropertyDetailDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;