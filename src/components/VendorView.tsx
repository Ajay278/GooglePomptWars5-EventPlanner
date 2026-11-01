import React, { useState } from 'react';
import { FullEventPlan, VendorItem, VendorStatus } from '../types/event';
import { 
  Users, 
  Plus, 
  Trash2, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  FileText, 
  IndianRupee, 
  Briefcase 
} from 'lucide-react';

interface VendorViewProps {
  plan: FullEventPlan;
  onUpdatePlan: (updatedPlan: FullEventPlan) => void;
}

const STATUS_LABELS: Record<VendorStatus, { label: string; color: string }> = {
  researching: { label: 'Researching', color: 'bg-slate-100 text-slate-700' },
  contacted: { label: 'Contacted', color: 'bg-blue-50 text-blue-800' },
  proposal_received: { label: 'Proposal Received', color: 'bg-purple-50 text-purple-800' },
  contract_signed: { label: 'Contract Signed', color: 'bg-amber-50 text-amber-800' },
  deposit_paid: { label: 'Deposit Paid', color: 'bg-teal-50 text-teal-800' },
  confirmed: { label: 'Confirmed & Ready', color: 'bg-emerald-50 text-emerald-800' },
};

export const VendorView: React.FC<VendorViewProps> = ({ plan, onUpdatePlan }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Catering & Bar');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<VendorStatus>('researching');
  const [priceQuote, setPriceQuote] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const vendors = plan.vendors;
  const confirmedCount = vendors.filter((v) => v.status === 'confirmed' || v.status === 'contract_signed' || v.status === 'deposit_paid').length;

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newVendor: VendorItem = {
      id: `v-${Date.now()}`,
      category,
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      status,
      priceQuote: Number(priceQuote) || 0,
      depositAmount: Number(depositAmount) || 0,
      notes: notes.trim(),
    };

    onUpdatePlan({
      ...plan,
      vendors: [...vendors, newVendor],
      updatedAt: new Date().toISOString(),
    });

    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setPriceQuote(0);
    setDepositAmount(0);
    setNotes('');
    setIsAdding(false);
  };

  const handleUpdateStatus = (id: string, newStatus: VendorStatus) => {
    onUpdatePlan({
      ...plan,
      vendors: vendors.map((v) => (v.id === id ? { ...v, status: newStatus } : v)),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteVendor = (id: string) => {
    onUpdatePlan({
      ...plan,
      vendors: vendors.filter((v) => v.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <span>VENDOR DIRECTORY &amp; CONTRACT HUB</span>
              <span aria-hidden="true">·</span>
              <span>OUTREACH, DEPOSITS &amp; CONFIRMATION</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Vendor Checklist &amp; Partner Coordination
            </h2>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Vendor</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            Contract status:{' '}
            <span className="font-mono tabular-nums font-bold text-slate-900">
              {confirmedCount} of {vendors.length} vendors secured
            </span>
          </div>
          <span className="text-slate-500 font-mono text-2xs">
            Direct coordination for catering, venue, music &amp; infrastructure
          </span>
        </div>
      </div>

      {/* Add Vendor Form */}
      {isAdding && (
        <form onSubmit={handleAddVendor} className="p-5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-4 text-xs">
          <div className="font-bold text-slate-900">New Vendor Entry</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business / Vendor Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Pacific Coast Floral Studio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Service Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 bg-white"
              >
                <option value="Venue">Venue</option>
                <option value="Catering & Bar">Catering &amp; Bar</option>
                <option value="Lead Photographer">Photography / Video</option>
                <option value="Floral & Decor">Floral &amp; Decor</option>
                <option value="Music / DJ">Music &amp; Entertainment</option>
                <option value="Rentals & Infrastructure">Rentals &amp; Canopies</option>
                <option value="Bakery / Cake">Bakery &amp; Cake</option>
                <option value="Hair & Makeup">Hair &amp; Beauty</option>
                <option value="Municipal / Permits">Municipal &amp; Permits</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VendorStatus)}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 bg-white"
              >
                <option value="researching">Researching</option>
                <option value="contacted">Contacted</option>
                <option value="proposal_received">Proposal Received</option>
                <option value="contract_signed">Contract Signed</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="e.g. (555) 019-2831"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="contact@vendor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Price Quote (₹)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={priceQuote}
                onChange={(e) => setPriceQuote(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deposit Paid (₹)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold cursor-pointer"
            >
              Save Vendor
            </button>
          </div>
        </form>
      )}

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((vendor) => {
          const statusConfig = STATUS_LABELS[vendor.status] || STATUS_LABELS.researching;

          return (
            <div
              key={vendor.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3 relative hover:border-slate-400 transition-colors"
            >
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500 uppercase text-2xs tracking-wider">
                  {vendor.category}
                </span>

                <select
                  value={vendor.status}
                  onChange={(e) => handleUpdateStatus(vendor.id, e.target.value as VendorStatus)}
                  className={`text-2xs font-semibold px-2 py-0.5 rounded cursor-pointer border border-transparent focus:outline-none ${statusConfig.color}`}
                >
                  <option value="researching">Researching</option>
                  <option value="contacted">Contacted</option>
                  <option value="proposal_received">Proposal Received</option>
                  <option value="contract_signed">Contract Signed</option>
                  <option value="deposit_paid">Deposit Paid</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>

              {/* Vendor Name */}
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {vendor.name}
                </h3>
                {vendor.contactPerson && (
                  <div className="text-xs text-slate-600 mt-0.5 font-medium">
                    Contact: {vendor.contactPerson}
                  </div>
                )}
              </div>

              {/* Contact info */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
                {vendor.phone && (
                  <a
                    href={`tel:${vendor.phone}`}
                    className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{vendor.phone}</span>
                  </a>
                )}
                {vendor.email && (
                  <a
                    href={`mailto:${vendor.email}`}
                    className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[180px]">{vendor.email}</span>
                  </a>
                )}
              </div>

              {/* Financial Quote & Deposit */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-mono tabular-nums">
                <div>
                  <span className="text-slate-500">Quote: </span>
                  <span className="font-bold text-slate-900">
                    {vendor.priceQuote ? `₹${vendor.priceQuote.toLocaleString()}` : 'Pending Quote'}
                  </span>
                </div>
                {vendor.depositAmount ? (
                  <div className="text-emerald-700 font-medium">
                    ₹{vendor.depositAmount.toLocaleString()} deposit paid
                  </div>
                ) : null}
              </div>

              {/* Delete action */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove vendor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
