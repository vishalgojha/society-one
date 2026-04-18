import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Package, Wrench, Clock, LogOut, Star, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from 'moment';

const typeConfig = {
    guest: { icon: User, color: 'bg-blue-500', label: 'Guest' },
    delivery: { icon: Package, color: 'bg-amber-500', label: 'Delivery' },
    service: { icon: Wrench, color: 'bg-purple-500', label: 'Service' },
};

export default function VisitorCard({ visitor, onCheckout, showCheckout = true }) {
    const config = typeConfig[visitor.visitorType] || typeConfig.guest;
    const Icon = config.icon;
    const checkInTime = moment(visitor.checkInTime);
    const duration = moment.duration(moment().diff(checkInTime));
    
    let timeAgo;
    if (duration.asMinutes() < 60) {
        timeAgo = `${Math.floor(duration.asMinutes())}m`;
    } else if (duration.asHours() < 24) {
        timeAgo = `${Math.floor(duration.asHours())}h ${Math.floor(duration.minutes())}m`;
    } else {
        timeAgo = `${Math.floor(duration.asDays())}d`;
    }

    return (
        <div className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border transition-all",
            visitor.isVIP 
                ? 'bg-amber-500/5 border-amber-500/50 hover:border-amber-500/70' 
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50'
        )}>
            <div className="relative">
                {visitor.facePhoto ? (
                    <img 
                        src={visitor.facePhoto} 
                        alt="Visitor" 
                        className="h-16 w-16 rounded-xl object-cover"
                    />
                ) : (
                    <div className="h-16 w-16 rounded-xl bg-slate-700 flex items-center justify-center">
                        <User className="h-8 w-8 text-slate-500" />
                    </div>
                )}
                <div className={cn(
                    "absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center",
                    config.color
                )}>
                    <Icon className="h-3 w-3 text-white" />
                </div>
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-medium text-white truncate">
                        {visitor.parsedName || visitor.spokenText || 'Visitor'}
                    </p>
                    {visitor.isVIP && (
                        <Star className="h-4 w-4 text-amber-400 fill-current flex-shrink-0" />
                    )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className={cn("text-xs", config.color, "text-white border-0")}>
                        {config.label}
                    </Badge>
                    {visitor.flatOrRoom && (
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {visitor.flatOrRoom}
                        </Badge>
                    )}
                    {visitor.securityVerification?.isPreApproved && (
                        <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400 flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Pre-approved
                        </Badge>
                    )}
                    {visitor.securityVerification?.riskLevel === 'high' && (
                        <Badge variant="outline" className="text-xs border-red-500 text-red-400 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            High Risk
                        </Badge>
                    )}
                    {visitor.securityVerification?.riskLevel === 'medium' && (
                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Review
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-1 mt-2 text-slate-500 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>{checkInTime.format('h:mm A')}</span>
                    <span className="text-slate-600">•</span>
                    <span>{timeAgo} ago</span>
                </div>
            </div>

            {showCheckout && visitor.status === 'checked_in' && onCheckout && (
                <Button
                    onClick={() => onCheckout(visitor)}
                    size="sm"
                    className="h-10 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white"
                >
                    <LogOut className="h-4 w-4 mr-1" />
                    Out
                </Button>
            )}
        </div>
    );
}