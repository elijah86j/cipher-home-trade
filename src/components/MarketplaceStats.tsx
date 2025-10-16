import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Shield, TrendingUp, Building2 } from "lucide-react";

const MarketplaceStats = () => {
  const stats = [
    {
      title: "Available Assets",
      value: "5 Assets",
      change: "New listings",
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      title: "Total Portfolio Value",
      value: "$521,500,000",
      change: "+8.1%",
      icon: DollarSign,
      color: "text-secondary"
    },
    {
      title: "My Subscriptions",
      value: "3",
      change: "Active",
      icon: Shield,
      color: "text-accent"
    },
    {
      title: "Total Shares Owned",
      value: "2,450",
      change: "+15.2%",
      icon: Building2,
      color: "text-muted-foreground"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-primary mt-1">
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MarketplaceStats;