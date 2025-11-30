"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Eye,
  Clock,
  CircleDollarSign,
  Send,
  RefreshCw,
  Bell,
} from "lucide-react";

interface InvoiceTrackingViewProps {
  className?: string;
}

type StepStatus = "completed" | "pending" | "future";

interface TimelineStep {
  status: StepStatus;
  title: string;
  description: string;
  date: string;
  icon: "send" | "eye" | "clock" | "dollar";
}

export const InvoiceTrackingView = ({
  className = "",
}: InvoiceTrackingViewProps) => {
  const timelineSteps: TimelineStep[] = [
    {
      status: "completed",
      title: "Invoice Sent",
      description: "The invoice was shared with the client",
      date: "March 15, 2024",
      icon: "send",
    },
    {
      status: "completed",
      title: "Viewed by Client",
      description: "The client opened and viewed the invoice",
      date: "March 16, 2024",
      icon: "eye",
    },
    {
      status: "pending",
      title: "Payment Pending",
      description: "Awaiting payment from client",
      date: "Due: March 30, 2024",
      icon: "clock",
    },
    {
      status: "future",
      title: "Payment Received",
      description: "Payment confirmation",
      date: "Not received yet",
      icon: "dollar",
    },
  ];

  const getIcon = (icon: TimelineStep["icon"], status: StepStatus) => {
    const iconClass =
      status === "future" ? "text-muted-foreground" : "text-white";
    const size = 16;

    switch (icon) {
      case "send":
        return <Send className={iconClass} size={size} />;
      case "eye":
        return <Eye className={iconClass} size={size} />;
      case "clock":
        return <Clock className={iconClass} size={size} />;
      case "dollar":
        return <CircleDollarSign className={iconClass} size={size} />;
    }
  };

  const getStatusStyles = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "pending":
        return "bg-amber-500";
      case "future":
        return "bg-muted border-2 border-dashed border-muted-foreground/30";
    }
  };

  const getLineStyles = (status: StepStatus, nextStatus?: StepStatus) => {
    if (status === "completed" && nextStatus === "completed") {
      return "bg-emerald-500";
    }
    if (status === "completed" && nextStatus === "pending") {
      return "bg-gradient-to-b from-emerald-500 to-amber-500";
    }
    return "bg-muted-foreground/20";
  };

  return (
    <Card className={`w-full max-w-md mx-auto shadow-lg ${className}`}>
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">INV-2024-001</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Issued: March 15, 2024 · Due: March 30, 2024
            </p>
          </div>
          <Badge
            variant="secondary"
            className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 font-medium"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-2xl font-bold">$2,950.00</span>
          <span className="text-sm text-muted-foreground">USD</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-5 px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            Payment Progress
          </h2>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
            <RefreshCw className="w-3 h-3" />
            Refresh
          </Button>
        </div>

        <div className="relative">
          {timelineSteps.map((step, index) => {
            const isLast = index === timelineSteps.length - 1;
            const nextStep = timelineSteps[index + 1];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`relative flex gap-3 ${!isLast ? "pb-5" : ""}`}
              >
                {/* Connecting line */}
                {!isLast && (
                  <div
                    className={`absolute left-[15px] top-8 w-0.5 h-[calc(100%-16px)] ${getLineStyles(
                      step.status,
                      nextStep?.status
                    )}`}
                  />
                )}

                {/* Status circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${getStatusStyles(
                    step.status
                  )} ${step.status === "future" ? "opacity-50" : ""}`}
                >
                  {step.status === "completed" ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    getIcon(step.icon, step.status)
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 min-w-0 ${
                    step.status === "future" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {step.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {step.date}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-full mt-5 gap-2 bg-transparent"
          size="sm"
        >
          <Bell className="w-4 h-4" />
          Send Payment Reminder
        </Button>
      </CardContent>
    </Card>
  );
};
