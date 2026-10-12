"use client";

import { useState } from "react";

import { CartIcon, CheckIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { cart, useCart } from "@/lib/partsCart";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  size?: "sm" | "md";
}

export function QuantityStepper({ value, onChange, label, size = "md" }: QuantityStepperProps) {
  const box = size === "sm" ? "size-8" : "size-12";
  return (
    <div className="inline-flex items-center rounded-sm border border-ink/15 bg-white" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Adedi azalt"
        className={`${box} inline-flex items-center justify-center text-ink transition-colors hover:text-accent disabled:text-steel-400`}
      >
        <MinusIcon size={14} />
      </button>
      <span className={`min-w-8 text-center font-display font-semibold text-ink ${size === "sm" ? "text-sm" : "text-lg"}`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= 99}
        aria-label="Adedi artır"
        className={`${box} inline-flex items-center justify-center text-ink transition-colors hover:text-accent disabled:text-steel-400`}
      >
        <PlusIcon size={14} />
      </button>
    </div>
  );
}

interface AddToCartProps {
  slug: string;
  title: string;
  variant?: "card" | "detail";
}

export function AddToCart({ slug, title, variant = "card" }: AddToCartProps) {
  const { lines } = useCart();
  const [quantity, setQuantity] = useState(1);
  const inCart = lines.find((line) => line.slug === slug);

  if (variant === "card") {
    return inCart ? (
      <button
        type="button"
        onClick={cart.open}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-accent bg-accent/8 px-4 text-[0.8rem] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
      >
        <CheckIcon size={16} />
        Sepette · {inCart.quantity}
      </button>
    ) : (
      <button
        type="button"
        onClick={() => cart.add(slug)}
        aria-label={`${title} ürününü sepete ekle`}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-[0.8rem] font-semibold text-white transition-colors hover:bg-accent-600"
      >
        <CartIcon size={16} />
        Sepete Ekle
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <QuantityStepper value={quantity} onChange={(value) => setQuantity(Math.min(99, Math.max(1, value)))} label="Adet" />
        <button
          type="button"
          onClick={() => {
            cart.add(slug, quantity);
            setQuantity(1);
          }}
          className="btn btn-primary flex-1 basis-[13rem] px-5"
        >
          <CartIcon size={18} />
          Teklif Listesine Ekle
        </button>
      </div>
      {inCart && (
        <p className="flex items-center gap-2 text-sm text-steel-700">
          <CheckIcon size={16} className="text-accent" />
          Teklif listenizde {inCart.quantity} adet var.
          <button type="button" onClick={cart.open} className="font-semibold text-ink underline underline-offset-4 hover:text-accent">
            Listeyi gör
          </button>
        </p>
      )}
    </div>
  );
}
