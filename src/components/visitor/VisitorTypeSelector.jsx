import React from 'react';
import { Button } from "@/components/ui/button";
import { User, Package, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const visitorTypes = [
    { id: 'guest', label: 'Guest', labelHi: 'मेहमान', icon: User, color: 'bg-blue-500' },
    { id: 'delivery', label: 'Delivery', labelHi: 'डिलीवरी', icon: Package, color: 'bg-amber-500' },
    { id: 'service', label: 'Service', labelHi: 'सर्विस', icon: Wrench, color: 'bg-purple-500' },
];

export default function VisitorTypeSelector({ selected, onSelect, showHindi = true }) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {visitorTypes.map(type => {
                const Icon = type.icon;
                const isSelected = selected === type.id;
                return (
                    <Button
                        key={type.id}
                        onClick={() => onSelect(type.id)}
                        variant="ghost"
                        className={cn(
                            "h-24 flex-col gap-2 rounded-2xl border-2 transition-all duration-200",
                            isSelected
                                ? `${type.color} border-transparent text-white`
                                : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                        )}
                    >
                        <Icon className="h-8 w-8" />
                        <div className="text-center">
                            <p className="font-semibold">{type.label}</p>
                            {showHindi && <p className="text-xs opacity-70">{type.labelHi}</p>}
                        </div>
                    </Button>
                );
            })}
        </div>
    );
}