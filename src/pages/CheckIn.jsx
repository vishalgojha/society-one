import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronRight, ImagePlus, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { entities } from '@/api/entities';
import { uploadFile } from '@/api/storage';
import { invokeFunction } from '@/api/functions';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const steps = [
  { id: 1, label: 'Visitor type' },
  { id: 2, label: 'Details + photo' },
  { id: 3, label: 'Confirm + notify' },
];

const visitorTypes = ['guest', 'delivery', 'service', 'cab', 'staff'];

export default function CheckIn() {
  const queryClient = useQueryClient();
  const { operator, societyId } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    propertyId: localStorage.getItem('activePropertyId') || '',
    visitorType: 'guest',
    visitorName: '',
    visitorMobile: '',
    visitorPurpose: '',
    flatOrRoom: '',
    faceFile: null,
    idFile: null,
    verification: null,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['checkin-properties'],
    queryFn: () => entities.Property.list('-createdAt', 100),
  });

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === form.propertyId) || null,
    [properties, form.propertyId]
  );

  const notifyRecipients = async () => {
    if (!operator?.id) return;
    const [settings] = await entities.NotificationSettings.filter({ operatorId: operator.id });
    if (!settings?.whatsappEnabled) return;

    const tasks = [];

    if (selectedProperty?.residentPhone) {
      tasks.push(
        invokeFunction('notifyPreApprovedVisitor', {
          phone: selectedProperty.residentPhone,
          recipientType: 'resident',
          recipientName: selectedProperty.ownerName || selectedProperty.name || 'Resident',
          visitorName: form.visitorName,
          visitorType: form.visitorType,
          visitorPurpose: form.visitorPurpose,
          propertyName: selectedProperty.name || selectedProperty.unitNumber || form.flatOrRoom,
          flatOrRoom: form.flatOrRoom,
          isPreApproved: Boolean(form.verification?.isPreApproved),
        })
      );
    }

    if (form.verification?.isPreApproved && form.visitorMobile) {
      tasks.push(
        invokeFunction('notifyPreApprovedVisitor', {
          phone: form.visitorMobile,
          recipientType: 'visitor',
          recipientName: form.visitorName,
          visitorName: form.visitorName,
          visitorType: form.visitorType,
          visitorPurpose: form.visitorPurpose,
          propertyName: selectedProperty?.name || selectedProperty?.unitNumber || form.flatOrRoom,
          flatOrRoom: form.flatOrRoom,
          isPreApproved: true,
        })
      );
    }

    if (tasks.length) {
      await Promise.allSettled(tasks);
    }
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const [facePhoto, idPhoto] = await Promise.all([
        form.faceFile ? uploadFile(form.faceFile) : Promise.resolve(null),
        form.idFile ? uploadFile(form.idFile) : Promise.resolve(null),
      ]);

      return entities.VisitorEntry.create({
        societyId,
        propertyId: form.propertyId || null,
        operatorId: operator?.id,
        name: form.visitorName,
        phone: form.visitorMobile,
        purpose: form.visitorPurpose,
        visitorType: form.visitorType,
        facePhoto,
        idPhoto,
        flatOrRoom: form.flatOrRoom,
        status: 'checked_in',
        verified: form.verification?.riskLevel === 'low',
        securityVerification: form.verification,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      toast.success('Visitor checked in');
      setForm((current) => ({
        ...current,
        visitorType: 'guest',
        visitorName: '',
        visitorMobile: '',
        visitorPurpose: '',
        flatOrRoom: '',
        faceFile: null,
        idFile: null,
        verification: null,
      }));
      setStep(1);
    },
  });

  const verifyStep = async () => {
    setSubmitting(true);
    try {
      const response = await invokeFunction('verifyVisitorSecurity', {
        visitorName: form.visitorName,
        visitorMobile: form.visitorMobile,
        visitorPurpose: form.visitorPurpose,
        flatOrRoom: form.flatOrRoom,
        visitorType: form.visitorType,
        propertyId: form.propertyId,
      });
      setForm((current) => ({ ...current, verification: response.data }));
      setStep(3);
    } catch (error) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createMutation.mutateAsync();
      await notifyRecipients().catch(() => null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader>
          <CardTitle className="text-white">Visitor check-in</CardTitle>
          <div className="grid gap-2 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step >= item.id ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {step > item.id ? <Check className="h-4 w-4" /> : item.id}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Step {item.id}</p>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Property / unit</label>
                  <Select value={form.propertyId} onValueChange={(value) => setForm((current) => ({ ...current, propertyId: value }))}>
                    <SelectTrigger className="h-14 rounded-2xl border-slate-700 bg-slate-950 text-white">
                      <SelectValue placeholder="Choose a property" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-700 bg-slate-900 text-white">
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name || property.unitNumber || property.block || property.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Visitor type</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {visitorTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, visitorType: type }))}
                        className={`rounded-2xl border px-4 py-4 text-sm font-medium capitalize transition ${form.visitorType === type ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={() => setStep(2)} disabled={!form.propertyId} className="h-14 rounded-2xl bg-emerald-500 px-6 text-base text-white hover:bg-emerald-600">
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Visitor name</label>
                  <Input value={form.visitorName} onChange={(event) => setForm((current) => ({ ...current, visitorName: event.target.value }))} className="h-14 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Rohit Sharma" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Mobile number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input value={form.visitorMobile} onChange={(event) => setForm((current) => ({ ...current, visitorMobile: event.target.value }))} className="h-14 rounded-2xl border-slate-700 bg-slate-950 pl-11 text-white" placeholder="9876543210" />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Purpose</label>
                  <Input value={form.visitorPurpose} onChange={(event) => setForm((current) => ({ ...current, visitorPurpose: event.target.value }))} className="h-14 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Parcel delivery / guest visit" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Flat / room</label>
                  <Input value={form.flatOrRoom} onChange={(event) => setForm((current) => ({ ...current, flatOrRoom: event.target.value }))} className="h-14 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder={selectedProperty?.unitNumber || 'A-1203'} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center">
                  <ImagePlus className="h-6 w-6 text-emerald-300" />
                  <span className="mt-3 text-sm font-medium text-white">Face photo</span>
                  <span className="mt-1 text-xs text-slate-500">{form.faceFile?.name || 'Tap to upload'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => setForm((current) => ({ ...current, faceFile: event.target.files?.[0] || null }))} />
                </label>
                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center">
                  <UserRound className="h-6 w-6 text-sky-300" />
                  <span className="mt-3 text-sm font-medium text-white">ID image</span>
                  <span className="mt-1 text-xs text-slate-500">{form.idFile?.name || 'Optional upload'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => setForm((current) => ({ ...current, idFile: event.target.files?.[0] || null }))} />
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="h-14 rounded-2xl border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-900">Back</Button>
                <Button onClick={verifyStep} disabled={!form.visitorName || submitting} className="h-14 rounded-2xl bg-emerald-500 px-6 text-base text-white hover:bg-emerald-600">
                  {submitting ? 'Verifying...' : 'Continue to confirmation'}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  <div>
                    <p className="text-sm font-medium text-white">Verification summary</p>
                    <p className="text-xs text-slate-500">Edge-function response before entry</p>
                  </div>
                  {form.verification?.riskLevel && (
                    <Badge className="ml-auto bg-slate-800 text-slate-100">
                      {form.verification.riskLevel} risk
                    </Badge>
                  )}
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                  <div>Name: {form.visitorName}</div>
                  <div>Phone: {form.visitorMobile || 'Not provided'}</div>
                  <div>Purpose: {form.visitorPurpose || 'General visit'}</div>
                  <div>Flat / room: {form.flatOrRoom || selectedProperty?.unitNumber || 'Not set'}</div>
                </div>
                {form.verification?.securityFlags?.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                    {form.verification.securityFlags.join(' • ')}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="h-14 rounded-2xl border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-900">Edit details</Button>
                <Button onClick={handleSubmit} disabled={submitting || createMutation.isPending} className="h-14 rounded-2xl bg-emerald-500 px-6 text-base text-white hover:bg-emerald-600">
                  {submitting || createMutation.isPending ? 'Checking in...' : 'Confirm and notify'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
