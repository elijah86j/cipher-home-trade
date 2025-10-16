import { Shield, Wallet, Search, Bell, User, ChevronDown, TrendingUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

const Header = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-muted/50 border-b border-border/50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-muted-foreground">Live Market Data</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Total Volume: <span className="text-primary font-medium">$24.8M</span></span>
                <span className="text-muted-foreground">24h Change: <span className="text-primary font-medium">+12.5%</span></span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Cipher Home Trade
                </h1>
                <p className="text-xs text-muted-foreground">Decentralized Real Estate</p>
              </div>
            </div>

          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="w-64 pl-9 bg-muted/50"
              />
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* Market Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">Market Active</span>
              </div>

              {/* Wallet */}
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button 
                              variant="default" 
                              className="flex items-center gap-2 shadow-lg"
                              onClick={openConnectModal}
                            >
                              <Wallet className="h-4 w-4" />
                              <span className="hidden sm:inline">Connect Wallet</span>
                            </Button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <Button 
                              variant="destructive" 
                              className="flex items-center gap-2"
                              onClick={openChainModal}
                            >
                              Wrong network
                            </Button>
                          );
                        }

                        return (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="default" className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <span className="hidden sm:inline font-mono text-sm">
                                  {account.displayName}
                                </span>
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem onClick={openAccountModal}>
                                <User className="h-4 w-4 mr-2" />
                                Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={openAccountModal}>
                                <Wallet className="h-4 w-4 mr-2" />
                                Wallet Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={openAccountModal}>
                                Disconnect
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;