import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import MarketplaceStats from "@/components/MarketplaceStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";

// Import property images
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Index = () => {
  const properties = [
    {
      id: "1",
      title: "Sunset Villa Estate",
      location: "Malibu, California",
      price: "$2,450",
      tokenSupply: "10,000",
      image: property1,
      status: "encrypted" as const,
      roi: "+18.5%"
    },
    {
      id: "2", 
      title: "Manhattan Penthouse",
      location: "New York, NY",
      price: "$5,200",
      tokenSupply: "25,000",
      image: property2,
      status: "visible" as const,
      roi: "+24.2%"
    },
    {
      id: "3",
      title: "Beachfront Paradise",
      location: "Miami Beach, FL",
      price: "$3,780",
      tokenSupply: "15,000",
      image: property3,
      status: "encrypted" as const,
      roi: "+31.7%"
    },
    {
      id: "4",
      title: "Modern Mountain Retreat", 
      location: "Aspen, Colorado",
      price: "$1,890",
      tokenSupply: "8,500",
      image: property1,
      status: "visible" as const,
      roi: "+12.3%"
    },
    {
      id: "5",
      title: "Urban Luxury Loft",
      location: "San Francisco, CA", 
      price: "$4,120",
      tokenSupply: "18,000",
      image: property2,
      status: "encrypted" as const,
      roi: "+28.9%"
    },
    {
      id: "6",
      title: "Coastal Modern Villa",
      location: "Santa Barbara, CA",
      price: "$2,950",
      tokenSupply: "12,500",
      image: property3,
      status: "visible" as const,
      roi: "+15.8%"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="glow-effect">
              🔒 Zero-Knowledge Privacy
            </Badge>
            <Badge variant="outline">
              🚀 $24.8M Volume
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            The Future of Real Estate Trading
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Trade property tokens with complete privacy. Your bids stay encrypted until execution, 
            preventing front-running and ensuring fair market conditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Trading
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats */}
        <MarketplaceStats />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Properties
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
