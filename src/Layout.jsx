import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import MobileHeader from "@/components/layout/MobileHeader";
import BottomNav from "@/components/layout/BottomNav";
import SearchModal from "@/components/layout/SearchModal";

export default function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {});
  }, []);

  const { data: cart } = useQuery({
    queryKey: ["cart", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const carts = await base44.entities.Cart.filter({
        user_email: user.email,
      });
      return carts[0] || null;
    },
    enabled: !!user?.email,
  });

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --color-primary: #000000;
          --color-secondary: #ffffff;
          --color-accent: #f5f5f5;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>

      <MobileHeader
        cartCount={cartCount}
        onSearchClick={() => setSearchOpen(true)}
      />

      <main className="pt-14 pb-20">{children}</main>

      <BottomNav cartCount={cartCount} />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
