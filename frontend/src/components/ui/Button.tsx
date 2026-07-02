"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "cta" | "ghost" | "text" | "auth-back" | "auth-inline";

const variantClass: Record<ButtonVariant, string> = {
  cta: "cta-btn",
  ghost: "ghost-btn",
  text: "text-btn",
  "auth-back": "auth-back-link",
  "auth-inline": "auth-inline-link"
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  loadingLabel?: string;
};

export const Button = ({
  variant = "ghost",
  loading = false,
  loadingLabel,
  disabled,
  children,
  className,
  ...props
}: Props) => {
  const classes = [variantClass[variant], loading ? "btn-loading" : "", className].filter(Boolean).join(" ");

  return (
    <button {...props} className={classes} disabled={disabled || loading} aria-busy={loading || undefined}>
      {loading ? (
        <>
          <span className="btn-spinner" aria-hidden="true" />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
