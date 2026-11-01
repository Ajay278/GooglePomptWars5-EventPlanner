import React, { useState } from 'react';
import { FullEventPlan, BudgetItem } from '../types/event';
import { 
  IndianRupee, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  PieChart, 
  Sparkles, 
  Receipt 
} from 'lucide-react';

interface BudgetViewProps {
  plan: FullEventPlan;
  onUpdatePlan: (updatedPlan: FullEventPlan) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({ plan, onUpdatePlan }) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [category, setCategory] = useState('Venue');
  const [itemName, setItemName] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState<number>(1000);
  const [actualAmount, setActualAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Calculations
  const totalAllocated = plan.budgetItems.reduce((acc, item) => acc + (item.allocatedAmount || 0), 0);
  const totalActual = plan.budgetItems.reduce((acc, item) => acc + (item.actualAmount || 0), 0);
  const totalPaid = plan.budgetItems.reduce((acc, item) => acc + (item.paidAmount || 0), 0);
  const remainingBudget = plan.targetBudget - totalActual;
  const costPerGuest = plan.guestCount > 0 ? Math.round(plan.targetBudget / plan.guestCount) : 0;
  const actualCostPerGuest = plan.guestCount > 0 && totalActual > 0 ? Math.round(totalActual / plan.guestCount) : 0;

  // Group by category for visual distribution
  const categoryTotals: Record<string, number> = {};
  plan.budgetItems.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.allocatedAmount;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const newItem: BudgetItem = {
      id: `b-${Date.now()}`,
      category,
      itemName: itemName.trim(),
      allocatedAmount: Number(allocatedAmount) || 0,
      actualAmount: Number(actualAmount) || 0,
      paidAmount: Number(paidAmount) || 0,
      status: Number(paidAmount) >= Number(actualAmount || allocatedAmount) ? 'paid' : Number(actualAmount) > 0 ? 'booked' : 'estimated',
      notes: notes.trim(),
    };

    onUpdatePlan({
      ...plan,
      budgetItems: [...plan.budgetItems, newItem],
      updatedAt: new Date().toISOString(),
    });

    setItemName('');
    setAllocatedAmount(500);
    setActualAmount(0);
    setPaidAmount(0);
    setNotes('');
    setIsAddingItem(false);
  };

  const handleDeleteItem = (id: string) => {
    onUpdatePlan({
      ...plan,
      budgetItems: plan.budgetItems.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateItemStatus = (id: string, newStatus: BudgetItem['status']) => {
    onUpdatePlan({
      ...plan,
      budgetItems: plan.budgetItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* 4-Stat KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Target Budget */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-2xs font-mono text-slate-500 uppercase">Target Budget</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            ₹{plan.targetBudget.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-500 mt-1">
            Planned ceiling for {plan.guestCount} guests
          </div>
        </div>

        {/* Total Allocated */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-2xs font-mono text-slate-500 uppercase">Total Allocated</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            ₹{totalAllocated.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-500 mt-1">
            Across {plan.budgetItems.length} budget items
          </div>
        </div>

        {/* Actual Committed */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-2xs font-mono text-slate-500 uppercase">Actual Committed</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            ₹{totalActual.toLocaleString()}
          </div>
          <div className="text-2xs text-emerald-700 font-medium mt-1">
            ₹{totalPaid.toLocaleString()} paid in deposits
          </div>
        </div>

        {/* Remaining Buffer */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-2xs font-mono text-slate-500 uppercase">Remaining Buffer</div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
              remainingBudget < 0 ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            ₹{remainingBudget.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-500 mt-1 font-mono tabular-nums">
            ~₹{costPerGuest}/guest target
          </div>
        </div>
      </div>

      {/* Category Allocation Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-500" />
            <span>Category Budget Allocation Breakdown</span>
          </h3>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {totalAllocated > 0 ? Math.round((totalAllocated / plan.targetBudget) * 100) : 0}% of budget allocated
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
          {Object.entries(categoryTotals).map(([catName, amt], idx) => {
            const pct = totalAllocated > 0 ? (amt / totalAllocated) * 100 : 0;
            const colors = [
              'bg-slate-900', 'bg-slate-700', 'bg-blue-600', 'bg-indigo-500', 
              'bg-emerald-600', 'bg-amber-500', 'bg-purple-600', 'bg-rose-500'
            ];
            const color = colors[idx % colors.length];
            return (
              <div
                key={catName}
                title={`${catName}: ₹${amt.toLocaleString()} (${Math.round(pct)}%)`}
                style={{ width: `${pct}%` }}
                className={`${color} h-full border-r border-white/20`}
              />
            );
          })}
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-xs text-slate-600">
          {Object.entries(categoryTotals).map(([catName, amt], idx) => {
            const pct = totalAllocated > 0 ? Math.round((amt / totalAllocated) * 100) : 0;
            return (
              <div key={catName} className="flex items-center gap-1.5 font-mono text-2xs">
                <span className="w-2 h-2 rounded-full bg-slate-800" />
                <span className="font-semibold text-slate-800">{catName}:</span>
                <span className="tabular-nums text-slate-500">₹{amt.toLocaleString()} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Budget Items Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Budget Line Items ({plan.budgetItems.length})
            </h3>
            <p className="text-2xs text-slate-500">
              Track allocated estimates, signed quotes, and deposit receipts.
            </p>
          </div>

          <button
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Line Item</span>
          </button>
        </div>

        {/* Add Item Form Drawer */}
        {isAddingItem && (
          <form onSubmit={handleAddItem} className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-6 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Item / Vendor Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Wedding Cake & Dessert Table"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 text-xs focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-slate-900 text-xs focus:outline-none focus:border-slate-900"
              >
                <option value="Venue">Venue</option>
                <option value="Catering & Bar">Catering &amp; Bar</option>
                <option value="Photography & Film">Photo &amp; Video</option>
                <option value="Floral & Decor">Floral &amp; Decor</option>
                <option value="Music & Audio">Music &amp; Audio</option>
                <option value="Attire & Beauty">Attire &amp; Beauty</option>
                <option value="Permits & Infrastructure">Permits &amp; Infrastructure</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Stationery & Favors">Stationery &amp; Favors</option>
                <option value="Contingency">Contingency</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Allocated (₹)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Actual / Quote (₹)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={actualAmount}
                onChange={(e) => setActualAmount(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full py-1.5 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="px-2.5 py-1.5 bg-slate-200 text-slate-700 font-semibold rounded hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Table Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-2xs">
              <tr>
                <th className="py-2.5 px-4">Item &amp; Category</th>
                <th className="py-2.5 px-3 text-right">Allocated</th>
                <th className="py-2.5 px-3 text-right">Actual Cost</th>
                <th className="py-2.5 px-3 text-right">Paid to Date</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plan.budgetItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{item.itemName}</div>
                    <div className="flex items-center gap-1.5 text-2xs text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-700">{item.category}</span>
                      {item.notes && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="italic truncate max-w-xs">{item.notes}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 font-medium">
                    ₹{item.allocatedAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900 font-semibold">
                    {item.actualAmount > 0 ? `₹${item.actualAmount.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                    {item.paidAmount > 0 ? `₹${item.paidAmount.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      onClick={() =>
                        handleUpdateItemStatus(
                          item.id,
                          item.status === 'paid' ? 'booked' : item.status === 'booked' ? 'estimated' : 'paid'
                        )
                      }
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold cursor-pointer select-none transition-colors ${
                        item.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800'
                          : item.status === 'booked'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status === 'paid' ? 'Paid' : item.status === 'booked' ? 'Booked' : 'Estimated'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
