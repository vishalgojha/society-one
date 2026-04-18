import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Admin() {
  const queryClient = useQueryClient();
  const { societyId } = useAuth();
  const [operatorForm, setOperatorForm] = useState({ name: '', phone: '', role: 'operator' });
  const [propertyForm, setPropertyForm] = useState({ name: '', unitNumber: '', block: '', ownerName: '', type: 'society' });
  const [preApprovedForm, setPreApprovedForm] = useState({ name: '', phone: '', propertyId: '', validUntil: '' });

  const { data } = useQuery({
    queryKey: ['admin-console'],
    queryFn: async () => {
      const [operators, properties, preApprovedVisitors] = await Promise.all([
        entities.Operator.list('-updatedDate', 100),
        entities.Property.list('-createdAt', 100),
        entities.PreApprovedVisitor.list('-createdAt', 100),
      ]);
      return { operators, properties, preApprovedVisitors };
    },
  });

  const createOperator = useMutation({
    mutationFn: () => entities.Operator.create({ ...operatorForm, societyId }),
    onSuccess: () => {
      toast.success('Operator created');
      setOperatorForm({ name: '', phone: '', role: 'operator' });
      queryClient.invalidateQueries({ queryKey: ['admin-console'] });
    },
  });

  const createProperty = useMutation({
    mutationFn: () => entities.Property.create({ ...propertyForm, societyId }),
    onSuccess: () => {
      toast.success('Property created');
      setPropertyForm({ name: '', unitNumber: '', block: '', ownerName: '', type: 'society' });
      queryClient.invalidateQueries({ queryKey: ['admin-console'] });
    },
  });

  const createPreApproved = useMutation({
    mutationFn: () => entities.PreApprovedVisitor.create({ ...preApprovedForm, societyId }),
    onSuccess: () => {
      toast.success('Pre-approved visitor added');
      setPreApprovedForm({ name: '', phone: '', propertyId: '', validUntil: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-console'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
          <CardHeader><CardTitle className="text-white">Create operator</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={operatorForm.name} onChange={(event) => setOperatorForm((current) => ({ ...current, name: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Name" />
            <Input value={operatorForm.phone} onChange={(event) => setOperatorForm((current) => ({ ...current, phone: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Phone" />
            <select value={operatorForm.role} onChange={(event) => setOperatorForm((current) => ({ ...current, role: event.target.value }))} className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 text-white">
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="guard">Guard</option>
              <option value="resident">Resident</option>
            </select>
            <Button onClick={() => createOperator.mutate()} className="h-12 w-full rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">Add operator</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
          <CardHeader><CardTitle className="text-white">Create property</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={propertyForm.name} onChange={(event) => setPropertyForm((current) => ({ ...current, name: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Property name" />
            <Input value={propertyForm.unitNumber} onChange={(event) => setPropertyForm((current) => ({ ...current, unitNumber: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Unit number" />
            <Input value={propertyForm.block} onChange={(event) => setPropertyForm((current) => ({ ...current, block: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Block" />
            <Input value={propertyForm.ownerName} onChange={(event) => setPropertyForm((current) => ({ ...current, ownerName: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Owner name" />
            <Button onClick={() => createProperty.mutate()} className="h-12 w-full rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">Add property</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
          <CardHeader><CardTitle className="text-white">Pre-approve visitor</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={preApprovedForm.name} onChange={(event) => setPreApprovedForm((current) => ({ ...current, name: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Visitor name" />
            <Input value={preApprovedForm.phone} onChange={(event) => setPreApprovedForm((current) => ({ ...current, phone: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Phone number" />
            <select value={preApprovedForm.propertyId} onChange={(event) => setPreApprovedForm((current) => ({ ...current, propertyId: event.target.value }))} className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 text-white">
              <option value="">Select property</option>
              {data?.properties?.map((property) => (
                <option key={property.id} value={property.id}>{property.name || property.unitNumber || property.id}</option>
              ))}
            </select>
            <Input type="datetime-local" value={preApprovedForm.validUntil} onChange={(event) => setPreApprovedForm((current) => ({ ...current, validUntil: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" />
            <Button onClick={() => createPreApproved.mutate()} className="h-12 w-full rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">Save visitor</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-3xl border-slate-800 bg-slate-900/80 xl:col-span-1">
          <CardHeader><CardTitle className="text-white">Operators</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data?.operators?.map((operator) => (
              <div key={operator.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <div>
                  <p className="font-medium text-white">{operator.name || 'Unnamed operator'}</p>
                  <p className="text-sm text-slate-500">{operator.phone || 'No phone'}</p>
                </div>
                <Badge className="bg-slate-800 text-slate-200">{operator.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-800 bg-slate-900/80 xl:col-span-1">
          <CardHeader><CardTitle className="text-white">Properties</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data?.properties?.map((property) => (
              <div key={property.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="font-medium text-white">{property.name || property.unitNumber || 'Property'}</p>
                <p className="text-sm text-slate-500">{property.block || property.ownerName || property.type}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-800 bg-slate-900/80 xl:col-span-1">
          <CardHeader><CardTitle className="text-white">Pre-approved visitors</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data?.preApprovedVisitors?.map((visitor) => (
              <div key={visitor.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="font-medium text-white">{visitor.name}</p>
                <p className="text-sm text-slate-500">{visitor.phone || 'No phone'} • {visitor.validUntil || 'Open window'}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
