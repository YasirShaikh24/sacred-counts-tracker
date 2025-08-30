import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrayer } from '@/contexts/PrayerContext';
import { PrayerCard } from '@/components/PrayerCard';
import { AdminModal } from '@/components/AdminModal';
import { Settings, Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { cards, isAdmin, loading } = usePrayer();
  const [showAdminModal, setShowAdminModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen islamic-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading prayer cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen islamic-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 urdu-text">
            جنت میں جانے کا ذریعہ
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            JANNAT ME JAANE KA ZARIYA
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Group Prayer Tracker - Everyone's contributions count together
          </p>
        </div>

        {cards.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <PrayerCard key={card.id} card={card} />
            ))}
            
            {isAdmin && (
              <Link to="/add">
                <div className="prayer-card islamic-pattern flex flex-col items-center justify-center text-center group hover:bg-primary/5 transition-colors min-h-[180px] col-span-2 lg:col-span-1">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 shadow-lg">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    ✨ Add New Prayer Card
                  </div>
                  <div className="text-sm text-muted-foreground px-4 leading-relaxed">
                    Create a beautiful counter for your spiritual practice and sacred recitations
                  </div>
                </div>
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Prayer Cards Yet</h3>
            <p className="text-muted-foreground mb-6">Start your spiritual journey by creating your first prayer counter</p>
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Admin Login
            </button>
          </div>
        )}
      </div>

      {/* Admin Button */}
      <button
        className="admin-btn"
        onClick={() => setShowAdminModal(true)}
        title={isAdmin ? "Admin Mode Active" : "Admin Login"}
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Admin Modal */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
};

export default Dashboard;