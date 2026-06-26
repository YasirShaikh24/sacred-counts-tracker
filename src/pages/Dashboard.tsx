import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePrayer } from '@/contexts/PrayerContext';
import { PrayerCard } from '@/components/PrayerCard';
import { AdminModal } from '@/components/AdminModal';
import { Settings, Plus, BookOpen, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { cards, isAdmin, loading } = usePrayer();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const navigate = useNavigate();

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

        {/* Action Buttons */}
        <div className="mb-8 flex justify-center gap-4 flex-wrap">
          <Button
            onClick={() => navigate('/quran-shareef')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium rounded-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <BookOpen className="w-6 h-6" />
            QURAN SHAREEF
          </Button>
          <Button
            onClick={() => navigate('/digital-tasbeeh')}
            className="bg-green-700 hover:bg-green-600 text-white px-8 py-3 text-lg font-medium rounded-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Smartphone className="w-6 h-6" />
            DIGITAL TASBEEH
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => (
            <PrayerCard key={card.id} card={card} />
          ))}
        </div>

        {/* Add Card Button (Admin Only) */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Link to="/add">
              <Button className="flex items-center gap-2 px-6 py-3 text-lg">
                <Plus className="w-5 h-5" />
                Add New Prayer Card
              </Button>
            </Link>
          </div>
        )}

        {/* Empty State */}
        {cards.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Prayer Cards Yet</h3>
            <p className="text-muted-foreground mb-6">
              Login as admin to add your first prayer card
            </p>
            <Button onClick={() => setShowAdminModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
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