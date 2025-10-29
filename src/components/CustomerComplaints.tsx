
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Complaint {
  id: string;
  customer_id: string;
  content: string;
  created_at: string;
  resolved: boolean;
}

interface CustomerComplaintsProps {
  customerId: string;
}

const CustomerComplaints: React.FC<CustomerComplaintsProps> = ({
  customerId
}) => {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [newComplaint, setNewComplaint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('customer_complaints')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setComplaints(data as Complaint[]);
      } catch (error) {
        console.error('Error loading complaints:', error);
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };
    
    loadComplaints();
  }, [customerId]);

  const submitComplaint = async () => {
    if (!newComplaint.trim()) {
      toast.error('Please enter a complaint');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('customer_complaints')
        .insert([
          {
            customer_id: customerId,
            content: newComplaint.trim(),
            resolved: false
          }
        ])
        .select();
        
      if (error) throw error;
      
      setComplaints([...(data as Complaint[]), ...complaints]);
      setNewComplaint("");
      toast.success('Complaint submitted successfully');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-3">{t('complaints.title')}</h2>
        <div className="space-y-3">
          <Textarea
            placeholder={t('complaints.placeholder')}
            value={newComplaint}
            onChange={(e) => setNewComplaint(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={submitComplaint}
            disabled={isSubmitting || !newComplaint.trim()}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? t('complaints.submitting') : t('complaints.submit')}
          </Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-3">{t('complaints.previous')}</h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            {t('complaints.loading')}
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('complaints.noComplaints')}
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map(complaint => (
              <Card key={complaint.id} className="p-4">
                <div className="flex gap-2 mb-2">
                  <AlertCircle className={`h-5 w-5 shrink-0 ${complaint.resolved ? 'text-green-500' : 'text-amber-500'}`} />
                  <div>
                    <div className="font-medium">
                      {complaint.resolved ? t('common.resolved') : t('common.openComplaint')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(complaint.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm mt-2 p-2 bg-secondary/20 rounded-md">
                  {complaint.content}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerComplaints;
