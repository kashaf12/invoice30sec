"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Download,
  Share2,
  ChevronDown,
  CreditCard,
  Building2,
  Wallet,
  Globe,
  Sparkles,
  Check,
  Copy,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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

  return (
    <motion.div
      className={cn("w-full", className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card className="shadow-xl shadow-foreground/5 overflow-hidden">
          <CardHeader className="relative px-5 pt-5 pb-5 bg-gradient-to-br from-muted/50 to-muted space-y-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5"
              >
                <Sparkles className="w-2.5 h-2.5" />
                Invoice
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {invoiceNumber}
            </h1>

            <div className="flex items-center gap-4 mt-2 text-sm">
              <p className="text-muted-foreground">
                Issued:{" "}
                <span className="text-foreground font-medium">{date}</span>
              </p>
              <p className="text-muted-foreground">
                Due:{" "}
                <span className="text-foreground font-medium">{dueDate}</span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                  Bill To
                </p>
                <p className="font-semibold text-foreground text-sm">
                  {clientName}
                </p>
                <p className="text-xs text-muted-foreground">{clientEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                  From
                </p>
                <p className="font-semibold text-foreground text-sm">
                  {freelancerName}
                </p>
                <p className="text-xs text-muted-foreground">Freelancer</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-5 py-3">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
              <span>Description</span>
              <span>Amount</span>
            </div>

            <motion.div
              className="divide-y divide-border"
              variants={containerVariants}
            >
              {lineItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between py-2.5"
                  variants={itemVariants}
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground tabular-nums text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-3 pt-3 space-y-1.5">
              <Separator className="border-dashed mb-3" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground tabular-nums">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {formatCurrency(tax)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-1.5">
                <span className="text-base font-semibold text-foreground">
                  Total Due
                </span>
                <span className="text-xl font-bold text-foreground tabular-nums">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-5 h-12 text-sm font-semibold rounded-xl shadow-lg shadow-primary/25"
              onClick={() => setSelectedMethod("stripe")}
              asChild
            >
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </motion.button>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 border-2 border-dashed hover:border-primary/30 hover:bg-muted/50 bg-transparent"
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
                          "relative p-3 rounded-lg border-2 transition-all text-left",
                          selectedMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30 hover:bg-muted/50"
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
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-primary-foreground" />
                            </div>
                          </motion.div>
                        )}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center mb-2",
                            method.color
                          )}
                        >
                          <method.icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="font-semibold text-foreground text-xs">
                          {method.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight">
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
                      >
                        <Card className="bg-muted/50">
                          <CardContent className="p-3 space-y-2">
                            <p className="text-xs font-medium text-foreground">
                              Bank Transfer Details
                            </p>
                            {Object.entries(bankDetails).map(([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-[10px] text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </p>
                                  <p className="text-xs font-medium text-foreground">
                                    {value}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleCopy(value, key)}
                                >
                                  {copied === key ? (
                                    <Check className="w-3 h-3 text-primary" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
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
                        <div className="w-24 h-24 bg-foreground rounded-lg p-1.5">
                          <div className="w-full h-full bg-card rounded-md flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-foreground" />
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                          Scan to pay instantly
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="px-5 pb-5 pt-0 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
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
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              asChild
            >
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5" />
                Share Link
              </motion.button>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.p
        className="text-center text-[10px] text-muted-foreground mt-3"
        variants={itemVariants}
      >
        Secured by 256-bit encryption
      </motion.p>
    </motion.div>
  );
}
