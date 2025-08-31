import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuran } from '@/contexts/QuranContext';
import { usePrayer } from '@/contexts/PrayerContext';
import { AssignSiparaModal } from '@/components/AssignSiparaModal';

const QuranShareef = () => {
  const navigate = useNavigate();
  const { siparas, loading, assignPersonToSipara, markSiparaCompleted } = useQuran();
  const { isAdmin } = usePrayer();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSipara, setSelectedSipara] = useState<number | null>(null);

  const handleEditClick = (siparaNumber: number) => {
    setSelectedSipara(siparaNumber);
    setModalOpen(true);
  };

  const handleAssign = (siparaNumber: number, personName: string) => {
    assignPersonToSipara(siparaNumber, personName);
  };

  const selectedSiparaData = selectedSipara 
    ? siparas.find(s => s.sipara_number === selectedSipara)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-foreground hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Quran Shareef</h1>
              <p className="text-sm text-muted-foreground">Family Quran Reading Tracking</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Fixed mobile spacing */}
      <main className="px-3 py-6">
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="space-y-3 w-full">
            {siparas.map((sipara) => (
              <div
                key={sipara.id}
                className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg hover:shadow-md transition-shadow w-full"
              >
                {/* Sipara Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {sipara.sipara_number}
                  </span>
                </div>

                {/* Person Name */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">
                    {sipara.assigned_person_name || (
                      <span className="text-muted-foreground italic">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Compact for mobile */}
                <div className="flex gap-1 flex-shrink-0">
                  {/* Edit Button (Admin Only) */}
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(sipara.sipara_number)}
                      className="h-7 px-2 text-xs border-gray-600 hover:bg-gray-100"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  )}

                  {/* Submit/Completed Button */}
                  <Button
                    variant={sipara.is_completed ? "default" : "outline"}
                    size="sm"
                    onClick={() => markSiparaCompleted(sipara.sipara_number)}
                    className={`h-7 px-2 text-xs ${
                      sipara.is_completed 
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                        : 'border-gray-600 hover:bg-gray-100'
                    }`}
                    disabled={!sipara.assigned_person_name && !sipara.is_completed}
                  >
                    {sipara.is_completed ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </main>

      {/* Assign Modal */}
      <AssignSiparaModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSipara(null);
        }}
        siparaNumber={selectedSipara || 0}
        currentName={selectedSiparaData?.assigned_person_name || ''}
        onAssign={handleAssign}
      />
    </div>
  );
};

export default QuranShareef;