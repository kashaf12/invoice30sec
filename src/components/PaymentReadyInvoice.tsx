"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Download,
  ChevronDown,
  CreditCard,
  Building2,
  Wallet,
  Globe,
  Check,
  Copy,
  QrCode,
  FileText,
  User,
  List,
  Coins,
  Link2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LineItem {
  description: string;
  quantity: number;
  price: number;
}

interface PaymentReadyInvoiceProps {
  invoiceNumber?: string;
  date?: string;
  dueDate?: string;
  clientName?: string;
  clientEmail?: string;
  freelancerName?: string;
  lineItems?: LineItem[];
  currency?: string;
  className?: string;
}

const paymentMethods = [
  {
    id: "stripe",
    name: "Credit Card",
    description: "Visa, Mastercard, Amex",
    icon: CreditCard,
    color: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay with PayPal balance",
    icon: Wallet,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Direct bank payment",
    icon: Building2,
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
  {
    id: "crypto",
    name: "Crypto",
    description: "BTC, ETH, USDC",
    icon: Globe,
    color: "bg-gradient-to-br from-orange-500 to-amber-600",
  },
];

const bankDetails = {
  accountName: "Sarah Chen",
  accountNumber: "****7890",
  routingNumber: "****4321",
  bankName: "Chase Bank",
};

export function PaymentReadyInvoice({
  invoiceNumber = "INV-2024-001",
  date = "March 15, 2024",
  dueDate = "March 30, 2024",
  clientName = "Acme Corporation",
  clientEmail = "billing@acme.co",
  freelancerName = "Sarah Chen",
  lineItems = [
    { description: "Website Redesign", quantity: 1, price: 1200.0 },
    { description: "Logo Design", quantity: 1, price: 800.0 },
  ],
  currency = "INR",
  className = "",
}: PaymentReadyInvoiceProps) {
  const [isPaymentMethodsOpen, setIsPaymentMethodsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.0;
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.3 },
    },
  };

  const floatingAnimation = shouldReduceMotion
    ? undefined
    : ({
        y: [0, -4, 0],
        transition: {
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      } as any);

  return (
    <div
      className={cn(
        "w-full md:w-[85%] lg:w-[70%] md:ml-auto relative",
        className
      )}
    >
      <div className="absolute inset-x-8 bottom-0 h-8 bg-black/20 blur-2xl rounded-full" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative"
      >
        <motion.div
          variants={itemVariants}
          animate={floatingAnimation || undefined}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div
            className={cn(
              "relative rounded-2xl overflow-hidden",
              "bg-white/[0.03] backdrop-blur-xl",
              "border border-white/10",
              "ring-1 ring-black/10",
              "shadow-lg",
              "shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
              // Inner glow
              "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
              "before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none"
            )}
            animate={{
              scale: isHovered ? 1.02 : 1,
              boxShadow: isHovered
                ? "0 8px 24px rgba(0,0,0,0.4), 0 0 24px rgba(17,208,122,0.2)"
                : "0 8px 24px rgba(0,0,0,0.4)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Header Section */}
            <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-b border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-white/70 border-white/10 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5"
                >
                  Invoice
                </Badge>
              </div>

              <h1 className="text-2xl font-bold text-white tracking-tight">
                {invoiceNumber}
              </h1>

              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-white/50">Issued:</span>
                  <span className="text-white font-medium">{date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-white/50">Due:</span>
                  <span className="text-white font-medium">{dueDate}</span>
                </div>
              </div>

              {/* Bill To / From Section */}
              <div className="mt-4 grid grid-cols-2 gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 h-fit">
                    <Building2 className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                      Bill To
                    </p>
                    <p className="font-semibold text-white text-sm">
                      {clientName}
                    </p>
                    <p className="text-xs text-white/50">{clientEmail}</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end text-right">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                      From
                    </p>
                    <p className="font-semibold text-white text-sm">
                      {freelancerName}
                    </p>
                    <p className="text-xs text-white/50">Freelancer</p>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 h-fit">
                    <User className="w-3 h-3 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Section */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  <List className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
                  Line Items
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider pb-2 border-b border-white/10">
                <span>Description</span>
                <span>Amount</span>
              </div>

              <motion.div
                className="divide-y divide-white/5"
                variants={containerVariants}
              >
                {lineItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between py-2.5 group"
                    variants={itemVariants}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm group-hover:text-emerald-300 transition-colors">
                        {item.description}
                      </p>
                      <p className="text-xs text-white/40">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-white tabular-nums text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Total Section */}
              <div className="mt-3 pt-3 space-y-1.5">
                <Separator className="border-dashed border-white/10 mb-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="font-medium text-white/80 tabular-nums">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Tax</span>
                    <span className="font-medium text-white/80 tabular-nums">
                      {formatCurrency(tax)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 p-3 -mx-1 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                      <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-base font-semibold text-white">
                      Total Due
                    </span>
                  </div>
                  <span className="text-xl font-bold text-white tabular-nums">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <motion.div className="mt-5">
                <Button
                  size="lg"
                  className={cn(
                    "w-full h-12 text-sm font-semibold rounded-xl",
                    "bg-gradient-to-r from-emerald-500 to-emerald-600",
                    "hover:from-emerald-400 hover:to-emerald-500",
                    "shadow-[0_0_20px_rgba(17,208,122,0.4)]",
                    "border border-emerald-400/30"
                  )}
                  asChild
                >
                  <motion.button
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : { scale: 1.02, filter: "brightness(1.1)" }
                    }
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            boxShadow: [
                              "0 0 20px rgba(17,208,122,0.4)",
                              "0 0 30px rgba(17,208,122,0.6)",
                              "0 0 20px rgba(17,208,122,0.4)",
                            ],
                          }
                    }
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                  </motion.button>
                </Button>
              </motion.div>

              {/* More Payment Options */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 border-2 border-dashed border-white/10 hover:border-emerald-500/30 hover:bg-white/5 text-white/60 hover:text-white"
                onClick={() => setIsPaymentMethodsOpen(!isPaymentMethodsOpen)}
                aria-expanded={isPaymentMethodsOpen}
              >
                <span className="text-sm">
                  {isPaymentMethodsOpen ? "Less" : "More"} Payment Options
                </span>
                <motion.div
                  animate={{ rotate: isPaymentMethodsOpen ? 180 : 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                  className="ml-2"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </Button>

              <AnimatePresence>
                {isPaymentMethodsOpen && (
                  <motion.div
                    className="mt-3 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        duration: shouldReduceMotion ? 0 : 0.3,
                        ease: "easeOut",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
                    }}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map((method, index) => (
                        <motion.button
                          key={method.id}
                          className={cn(
                            "relative p-3 rounded-xl text-left transition-all",
                            "bg-white/[0.03] border border-white/10",
                            "hover:bg-white/[0.06] hover:border-emerald-500/30",
                            selectedMethod === method.id &&
                              "border-emerald-500/50 bg-emerald-500/10"
                          )}
                          onClick={() => setSelectedMethod(method.id)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: shouldReduceMotion ? 0 : index * 0.05,
                            },
                          }}
                          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        >
                          {selectedMethod === method.id && (
                            <motion.div
                              className="absolute top-1.5 right-1.5"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </div>
                            </motion.div>
                          )}
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                              method.color
                            )}
                          >
                            <method.icon className="w-4 h-4 text-white" />
                          </div>
                          <p className="font-semibold text-white text-xs">
                            {method.name}
                          </p>
                          <p className="text-[10px] text-white/40 leading-tight">
                            {method.description}
                          </p>
                        </motion.button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {selectedMethod === "bank" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2"
                        >
                          <p className="text-xs font-medium text-white">
                            Bank Transfer Details
                          </p>
                          {Object.entries(bankDetails).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="text-[10px] text-white/40 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </p>
                                <p className="text-xs font-medium text-white">
                                  {value}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-white/10"
                                onClick={() => handleCopy(value, key)}
                              >
                                {copied === key ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-white/40" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"
                      onClick={() => setShowQR(!showQR)}
                    >
                      <QrCode className="w-3.5 h-3.5 mr-2" />
                      {showQR ? "Hide" : "Show"} QR Code
                    </Button>

                    <AnimatePresence>
                      {showQR && (
                        <motion.div
                          className="flex flex-col items-center py-3"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <div className="w-24 h-24 bg-white rounded-lg p-1.5">
                            <div className="w-full h-full bg-gray-900 rounded-md flex items-center justify-center">
                              <QrCode className="w-16 h-16 text-white" />
                            </div>
                          </div>
                          <p className="text-[10px] text-white/40 mt-1.5">
                            Scan to pay instantly
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="px-5 pb-5 pt-0 flex gap-2 border-t border-white/5 mt-2 pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"
                asChild
              >
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download PDF
                </motion.button>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"
                asChild
              >
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                >
                  <Link2 className="w-3.5 h-3.5 mr-1.5" />
                  Copy Link
                </motion.button>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-center text-[10px] text-white/30 mt-4"
          variants={itemVariants}
        >
          Secured by 256-bit encryption
        </motion.p>
      </motion.div>
    </div>
  );
}
