import React, { useState, useEffect } from 'react';
import { MenuItem, SelectedOption } from '../types';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

interface ItemOptionModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    options: SelectedOption[],
    specialInstruction: string
  ) => void;
}

export const ItemOptionModal: React.FC<ItemOptionModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, SelectedOption>>({});
  const [specialInstruction, setSpecialInstruction] = useState('');

  // Initialize defaults for required groups
  useEffect(() => {
    if (!item.customizationGroups) return;
    const initialMap: Record<string, SelectedOption> = {};

    item.customizationGroups.forEach((group) => {
      if (group.required && group.options.length > 0) {
        // Pick first option as default required selection
        const firstOpt = group.options[0];
        initialMap[group.id] = {
          groupId: group.id,
          groupName: group.name,
          optionId: firstOpt.id,
          optionName: firstOpt.name,
          price: firstOpt.price,
        };
      }
    });

    setSelectedOptionsMap(initialMap);
    setQuantity(1);
    setSpecialInstruction('');
  }, [item]);

  const handleSelectOption = (
    groupId: string,
    groupName: string,
    optionId: string,
    optionName: string,
    price: number,
    required: boolean
  ) => {
    setSelectedOptionsMap((prev) => {
      const copy = { ...prev };
      const current = copy[groupId];

      if (!required && current && current.optionId === optionId) {
        // Toggle off if optional
        delete copy[groupId];
      } else {
        copy[groupId] = {
          groupId,
          groupName,
          optionId,
          optionName,
          price,
        };
      }
      return copy;
    });
  };

  const selectedOptionsList: SelectedOption[] = Object.values(selectedOptionsMap);
  const optionsPriceSum = selectedOptionsList.reduce((acc, curr) => acc + curr.price, 0);
  const unitPrice = item.price + optionsPriceSum;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = () => {
    onAddToCart(item, quantity, selectedOptionsList, specialInstruction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transform transition-all">
        {/* Header Image banner */}
        <div className="relative h-48 w-full bg-amber-100">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/50 text-white hover:bg-black/70 p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-xs text-gray-200 mt-1">{item.description}</p>
          </div>
        </div>

        {/* Customization Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 divide-y divide-gray-100">
          {item.customizationGroups?.map((group) => {
            return (
              <div key={group.id} className="pt-4 first:pt-0">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                    <span>{group.name}</span>
                    {group.required ? (
                      <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                        必選
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                        複選/加購
                      </span>
                    )}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {group.options.map((opt) => {
                    const isSelected = selectedOptionsMap[group.id]?.optionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          handleSelectOption(
                            group.id,
                            group.name,
                            opt.id,
                            opt.name,
                            opt.price,
                            group.required
                          )
                        }
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/30'
                            : 'border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{opt.name}</span>
                        {opt.price > 0 && (
                          <span className="text-amber-700 font-bold ml-1">+${opt.price}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special instructions */}
          <div className="pt-4">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              此品項特殊需求 (選填)
            </label>
            <input
              type="text"
              value={specialInstruction}
              onChange={(e) => setSpecialInstruction(e.target.value)}
              placeholder="例如：少醬、不加蔥、飯少..."
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Footer Actions: Quantity & Add to Cart */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-800 disabled:opacity-40 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-base text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 hover:bg-amber-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto flex-1 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold py-3 px-6 rounded-xl shadow-md flex items-center justify-between gap-2 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>加入購物車</span>
            </div>
            <span className="text-lg font-black text-amber-100">NT$ {totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
