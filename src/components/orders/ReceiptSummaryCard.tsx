"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

/** Mirrors `receipt_summary_card.dart`: zigzag top edge, rows, dashed divider, total, CTA. */
export function ReceiptSummaryCard({
  ctaTitle = "Place Order",
  ctaIcon = "check-circle-bold",
  onCta,
  ctaDisabled,
  className,
}: {
  ctaTitle?: string;
  ctaIcon?: string;
  onCta?: () => void;
  ctaDisabled?: boolean;
  className?: string;
}) {
  const cart = useCart();
  const [info, setInfo] = useState(false);

  return (
    <div className={cn("flex flex-col", className)}>
      <ZigzagEdge />
      <div className="bg-card px-5 pb-5 pt-4">
        <h3 className="text-[17px] font-extrabold text-text">Summary</h3>
        <div className="mt-2.5">
          <ReceiptRow label="Items" value={cart.subtotal} />
          <ReceiptRow label="Delivery" value={cart.deliveryFee} />
          <ReceiptRow
            label="Service fee"
            value={cart.serviceFee}
            onInfo={() => setInfo(true)}
          />
          {cart.tipAmount > 0 && (
            <ReceiptRow
              label={`Courier tip (${cart.tipPercent.toFixed(1)} %)`}
              value={cart.tipAmount}
            />
          )}
          {cart.discount > 0 && (
            <ReceiptRow
              label={`Discount (${cart.promoCode})`}
              value={-cart.discount}
              valueClass="text-green"
            />
          )}
        </div>
        <DashedDivider className="my-2.5" />
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-extrabold text-text">Total to pay</span>
          <span className="text-[17px] font-extrabold text-primary">
            ${cart.total.toFixed(2)}
          </span>
        </div>
        {onCta && (
          <Button
            title={ctaTitle}
            icon={ctaIcon}
            onClick={onCta}
            isDisabled={ctaDisabled}
            className="mt-2.5"
          />
        )}
      </div>
      <Dialog
        open={info}
        onClose={() => setInfo(false)}
        variant="info"
        title="Service Fee"
        message="This fee helps us run the Tako's Korner platform — covering payment processing, order support, and app maintenance."
      />
    </div>
  );
}

export function ReceiptRow({
  label,
  value,
  valueClass,
  onInfo,
}: {
  label: string;
  value: number;
  valueClass?: string;
  onInfo?: () => void;
}) {
  return (
    <div className="flex items-center py-[5px] text-[13px]">
      <span className="text-text-body">{label}</span>
      {onInfo && (
        <button
          type="button"
          aria-label="What is this fee?"
          onClick={onInfo}
          className="ms-1 p-0.5 text-text-muted"
        >
          <Icon name="info-circle-outline" size={13} />
        </button>
      )}
      <span className="flex-1" />
      <span className={cn("font-semibold text-text", valueClass)}>
        {value < 0 ? "–" : ""}${Math.abs(value).toFixed(3)}
      </span>
    </div>
  );
}

export function ZigzagEdge({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-2.5 w-full bg-card", className)}
      style={{
        maskImage:
          "linear-gradient(135deg, transparent 50%, #000 50%) , linear-gradient(-135deg, transparent 50%, #000 50%)",
        WebkitMaskImage:
          "linear-gradient(135deg, transparent 50%, #000 50%), linear-gradient(-135deg, transparent 50%, #000 50%)",
        maskSize: "12px 100%",
        WebkitMaskSize: "12px 100%",
        maskPosition: "0 0, 6px 0",
        WebkitMaskPosition: "0 0, 6px 0",
        maskRepeat: "repeat-x",
        WebkitMaskRepeat: "repeat-x",
      }}
    />
  );
}

export function DashedDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-px w-full", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--receipt-divider) 0 6px, transparent 6px 10px)",
      }}
    />
  );
}
