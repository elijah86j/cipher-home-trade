import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, TrendingUp, Users, Calendar, DollarSign, PieChart } from "lucide-react";

interface PropertyDetailDialogProps {
  property: {
    id: string;
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

const PropertyDetailDialog = ({ property, children }: PropertyDetailDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Property Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Image */}
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img 
              src={property.image} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge variant={property.status === "encrypted" ? "secondary" : "default"}>
                {property.status === "encrypted" ? "Encrypted" : "Public"}
              </Badge>
            </div>
          </div>

          {/* Property Info */}
          <div>
            <h2 className="text-2xl font-bold">{property.title}</h2>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-3 text-center">
              <DollarSign className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Token Price</p>
              <p className="font-semibold">{property.price}</p>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <PieChart className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Total Supply</p>
              <p className="font-semibold">{property.tokenSupply}</p>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Expected ROI</p>
              <p className="font-semibold text-primary">{property.roi}</p>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <Users className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Holders</p>
              <p className="font-semibold">{Math.floor(Math.random() * 150 + 50)}</p>
            </div>
          </div>

          <Separator />

          {/* Property Description */}
          <div>
            <h3 className="font-semibold mb-3">About This Property</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This premium real estate investment opportunity offers exposure to high-value properties 
              through tokenized ownership. Each token represents a fractional ownership stake in the 
              underlying real estate asset, providing investors with potential rental income and 
              capital appreciation.
            </p>
          </div>

          {/* Investment Details */}
          <div>
            <h3 className="font-semibold mb-3">Investment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Minimum Investment</span>
                <span className="text-sm font-medium">1 Token ({property.price})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Asset Type</span>
                <span className="text-sm font-medium">Residential Property</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Investment Period</span>
                <span className="text-sm font-medium">5-10 Years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Dividend Frequency</span>
                <span className="text-sm font-medium">Quarterly</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className="bg-muted/50 border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Investment Risk Notice</h4>
            <p className="text-xs text-muted-foreground">
              Real estate investments involve risk including potential loss of principal. 
              Past performance does not guarantee future results. Please consider your 
              investment objectives and risk tolerance before investing.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailDialog;