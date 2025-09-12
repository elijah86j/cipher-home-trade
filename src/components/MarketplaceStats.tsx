import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Shield, TrendingUp, Users } from "lucide-react";

const MarketplaceStats = () => {
  const stats = [
    {
      title: "Total Volume",
      value: "$24.8M",
      change: "+12.3%",
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Active Properties",
      value: "127",
      change: "+8.1%",
      icon: TrendingUp,
      color: "text-secondary"
    },
    {
      title: "Encrypted Trades",
      value: "1,543",
      change: "+23.7%",
      icon: Shield,
      color: "text-accent"
    },
    {
      title: "Active Traders",
      value: "892",
      change: "+15.2%",
      icon: Users,
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