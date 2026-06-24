"use client";

import * as React from "react";

type Tone = "neutral" | "primary" | "success" | "warning" | "error" | "info" | "purple";
type Space = "0" | "2" | "4" | "6" | "8" | "12" | "16" | "20" | "24" | "32" | "40" | "48" | "64";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function describedBy(...ids: Array<string | undefined>): string | undefined {
  const values = ids.filter((id): id is string => Boolean(id));
  return values.length > 0 ? values.join(" ") : undefined;
}

function useOpenState(
  open: boolean | undefined,
  defaultOpen: boolean | undefined,
  onOpenChange: ((isOpen: boolean) => void) | undefined
) {
  const [internalOpen, setInternalOpen] = React.useState(Boolean(defaultOpen));
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setIsOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return [isOpen, setIsOpen] as const;
}

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useLayerFocus(
  isOpen: boolean,
  layerRef: React.RefObject<HTMLElement | null>,
  setIsOpen: (nextOpen: boolean) => void
) {
  React.useEffect(() => {
    if (!isOpen) return undefined;

    const previousElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = layerRef.current?.querySelector<HTMLElement>(focusableSelector);
    focusable?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousElement?.focus();
    };
  }, [isOpen, layerRef, setIsOpen]);
}

function trapLayerFocus(event: React.KeyboardEvent<HTMLElement>, layer: HTMLElement | null) {
  if (event.key !== "Tab" || !layer) return;

  const focusable = Array.from(layer.querySelectorAll<HTMLElement>(focusableSelector));
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loadingLabel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    leadingIcon,
    trailingIcon,
    loadingLabel = "جاري التحميل",
    className,
    children,
    disabled,
    type = "button",
    ...buttonProps
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={cx("raina-button", `raina-button--${variant}`, `raina-button--${size}`, className)}
    >
      {isLoading ? <span className="raina-button__spinner" aria-hidden="true" /> : null}
      {!isLoading && leadingIcon ? (
        <span className="raina-button__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span className="raina-button__label">{isLoading ? loadingLabel : children}</span>
      {!isLoading && trailingIcon ? (
        <span className="raina-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});

export interface IconButtonProps extends Omit<
  ButtonProps,
  "children" | "leadingIcon" | "trailingIcon"
> {
  label: string;
  icon: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, size = "icon", className, ...buttonProps },
  ref
) {
  return (
    <Button
      {...buttonProps}
      ref={ref}
      size={size}
      aria-label={label}
      className={cx("raina-icon-button", className)}
    >
      <span aria-hidden="true">{icon}</span>
    </Button>
  );
});

export type TextInputKind = "text" | "numeric" | "phone" | "search";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix" | "size"
> {
  label: string;
  helperText?: string;
  errorText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  kind?: TextInputKind;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    helperText,
    errorText,
    prefix,
    suffix,
    kind = "text",
    className,
    inputMode,
    pattern,
    type,
    ...inputProps
  },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? `raina-input-${generatedId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;
  const isInvalid = Boolean(errorText);
  const resolvedType = type ?? (kind === "search" ? "search" : "text");
  const resolvedInputMode =
    inputMode ?? (kind === "numeric" || kind === "phone" ? "numeric" : undefined);
  const resolvedPattern =
    pattern ?? (kind === "numeric" || kind === "phone" ? "[0-9]*" : undefined);

  return (
    <div className={cx("raina-field", className)}>
      <label className="raina-field__label" htmlFor={inputId}>
        {label}
        {inputProps.required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <div className={cx("raina-field__control", isInvalid && "raina-field__control--error")}>
        {prefix ? <span className="raina-field__affix">{prefix}</span> : null}
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          type={resolvedType}
          inputMode={resolvedInputMode}
          pattern={resolvedPattern}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy(helperId, errorId)}
          className={cx("raina-input", kind === "phone" && "raina-input--phone")}
        />
        {suffix ? <span className="raina-field__affix">{suffix}</span> : null}
      </div>
      {helperText ? (
        <p className="raina-field__helper" id={helperId}>
          {helperText}
        </p>
      ) : null}
      {errorText ? (
        <p className="raina-field__error" id={errorId}>
          {errorText}
        </p>
      ) : null}
    </div>
  );
});

export interface OtpInputProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  length?: number;
  disabled?: boolean;
  isLoading?: boolean;
  errorText?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
}

export function OtpInput({
  label = "رمز التحقق",
  value,
  defaultValue = "",
  length = 4,
  disabled = false,
  isLoading = false,
  errorText,
  onValueChange,
  onComplete,
  className
}: OtpInputProps) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue.replace(/\D/g, "").slice(0, length)
  );
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const generatedId = React.useId();
  const currentValue = (value ?? internalValue).replace(/\D/g, "").slice(0, length);
  const isDisabled = disabled || isLoading;
  const errorId = errorText ? `raina-otp-${generatedId}-error` : undefined;

  const commitValue = React.useCallback(
    (nextValue: string) => {
      const normalized = nextValue.replace(/\D/g, "").slice(0, length);
      if (value === undefined) setInternalValue(normalized);
      onValueChange?.(normalized);
      if (normalized.length === length) onComplete?.(normalized);
    },
    [length, onComplete, onValueChange, value]
  );

  const focusIndex = React.useCallback((index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  }, []);

  const setDigitAt = React.useCallback(
    (index: number, digit: string) => {
      const nextDigits = currentValue.padEnd(length, " ").split("");
      nextDigits[index] = digit;
      commitValue(nextDigits.join("").replace(/\s/g, ""));
    },
    [commitValue, currentValue, length]
  );

  const onChangeAt = (index: number, rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "");
    if (digits.length === 0) {
      setDigitAt(index, "");
      return;
    }

    const nextDigits = currentValue.padEnd(length, " ").split("");
    digits
      .slice(0, length - index)
      .split("")
      .forEach((digit, offset) => {
        nextDigits[index + offset] = digit;
      });
    const nextValue = nextDigits.join("").replace(/\s/g, "");
    commitValue(nextValue);
    focusIndex(Math.min(index + digits.length, length - 1));
  };

  const onKeyDownAt = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !currentValue[index] && index > 0) {
      event.preventDefault();
      focusIndex(index - 1);
    }
  };

  const onPasteAt = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    onChangeAt(index, event.clipboardData.getData("text"));
  };

  return (
    <fieldset
      className={cx("raina-otp", className)}
      disabled={isDisabled}
      aria-describedby={errorId}
    >
      <legend className="raina-field__label">{label}</legend>
      <div className="raina-otp__group" dir="ltr">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            className={cx("raina-otp__input", errorText && "raina-otp__input--error")}
            value={currentValue[index] ?? ""}
            onChange={(event) => onChangeAt(index, event.currentTarget.value)}
            onKeyDown={(event) => onKeyDownAt(index, event)}
            onPaste={(event) => onPasteAt(index, event)}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`الخانة ${index + 1} من ${length}`}
            aria-invalid={Boolean(errorText) || undefined}
          />
        ))}
      </div>
      {isLoading ? <p className="raina-field__helper">يتم التحقق من الرمز</p> : null}
      {errorText ? (
        <p className="raina-field__error" id={errorId}>
          {errorText}
        </p>
      ) : null}
    </fieldset>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  errorText?: string;
  maxCount?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, helperText, errorText, maxCount, className, value, defaultValue, ...textareaProps },
  ref
) {
  const generatedId = React.useId();
  const textareaId = id ?? `raina-textarea-${generatedId}`;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  const errorId = errorText ? `${textareaId}-error` : undefined;
  const countValue =
    typeof value === "string" ? value : typeof defaultValue === "string" ? defaultValue : "";

  return (
    <div className={cx("raina-field", className)}>
      <label className="raina-field__label" htmlFor={textareaId}>
        {label}
      </label>
      <textarea
        {...textareaProps}
        ref={ref}
        id={textareaId}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={Boolean(errorText) || undefined}
        aria-describedby={describedBy(helperId, errorId)}
        className={cx("raina-textarea", errorText && "raina-textarea--error")}
      />
      <div className="raina-field__meta">
        {helperText ? (
          <p className="raina-field__helper" id={helperId}>
            {helperText}
          </p>
        ) : null}
        {maxCount ? (
          <span className="raina-field__count" aria-label="عدد الأحرف">
            {countValue.length}/{maxCount}
          </span>
        ) : null}
      </div>
      {errorText ? (
        <p className="raina-field__error" id={errorId}>
          {errorText}
        </p>
      ) : null}
    </div>
  );
});

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label: string;
  options: SelectOption[];
  helperText?: string;
  errorText?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, label, options, helperText, errorText, placeholder, className, ...selectProps },
  ref
) {
  const generatedId = React.useId();
  const selectId = id ?? `raina-select-${generatedId}`;
  const helperId = helperText ? `${selectId}-helper` : undefined;
  const errorId = errorText ? `${selectId}-error` : undefined;

  return (
    <div className={cx("raina-field", className)}>
      <label className="raina-field__label" htmlFor={selectId}>
        {label}
      </label>
      <select
        {...selectProps}
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(errorText) || undefined}
        aria-describedby={describedBy(helperId, errorId)}
        className={cx("raina-select", errorText && "raina-select--error")}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText ? (
        <p className="raina-field__helper" id={helperId}>
          {helperText}
        </p>
      ) : null}
      {errorText ? (
        <p className="raina-field__error" id={errorId}>
          {errorText}
        </p>
      ) : null}
    </div>
  );
});

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, ...inputProps },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? `raina-checkbox-${generatedId}`;

  return (
    <label className={cx("raina-choice", className)} htmlFor={inputId}>
      <input
        {...inputProps}
        ref={ref}
        id={inputId}
        type="checkbox"
        className="raina-choice__input"
      />
      <span className="raina-choice__control" aria-hidden="true" />
      <span className="raina-choice__text">
        <span>{label}</span>
        {description ? <small>{description}</small> : null}
      </span>
    </label>
  );
});

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, className, id, ...inputProps },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? `raina-radio-${generatedId}`;

  return (
    <label className={cx("raina-choice raina-choice--radio", className)} htmlFor={inputId}>
      <input {...inputProps} ref={ref} id={inputId} type="radio" className="raina-choice__input" />
      <span className="raina-choice__control" aria-hidden="true" />
      <span className="raina-choice__text">
        <span>{label}</span>
        {description ? <small>{description}</small> : null}
      </span>
    </label>
  );
});

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, className, id, ...inputProps },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? `raina-switch-${generatedId}`;

  return (
    <label className={cx("raina-switch", className)} htmlFor={inputId}>
      <input
        {...inputProps}
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        className="raina-switch__input"
      />
      <span className="raina-switch__track" aria-hidden="true">
        <span className="raina-switch__thumb" />
      </span>
      <span className="raina-choice__text">
        <span>{label}</span>
        {description ? <small>{description}</small> : null}
      </span>
    </label>
  );
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Tone;
}

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return <span {...props} className={cx("raina-badge", `raina-badge--${variant}`, className)} />;
}

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
  removable?: boolean;
  disabled?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
}

export function Chip({
  selected = false,
  removable = false,
  disabled = false,
  onRemove,
  removeLabel,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      {...props}
      className={cx(
        "raina-chip",
        selected && "raina-chip--selected",
        disabled && "raina-chip--disabled",
        className
      )}
      aria-disabled={disabled || undefined}
    >
      <span>{children}</span>
      {removable ? (
        <button
          type="button"
          className="raina-chip__remove"
          onClick={onRemove}
          disabled={disabled}
          aria-label={removeLabel ?? `إزالة ${typeof children === "string" ? children : "العنصر"}`}
        >
          ×
        </button>
      ) : null}
    </span>
  );
}

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  imageUrl?: string | undefined;
  imageAlt?: string | undefined;
  size?: AvatarSize;
  status?: "online" | "offline";
}

export function Avatar({
  name,
  imageUrl,
  imageAlt,
  size = "md",
  status,
  className,
  ...props
}: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span {...props} className={cx("raina-avatar", `raina-avatar--${size}`, className)}>
      {imageUrl ? (
        <img src={imageUrl} alt={imageAlt ?? name} />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
      {status ? (
        <span
          className={cx("raina-avatar__status", `raina-avatar__status--${status}`)}
          aria-label={status}
        />
      ) : null}
    </span>
  );
}

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "outlined" | "elevated" | "interactive";
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { title, description, variant = "default", footer, className, children, ...props },
  ref
) {
  return (
    <section {...props} ref={ref} className={cx("raina-card", `raina-card--${variant}`, className)}>
      {title || description ? (
        <header className="raina-card__header">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </header>
      ) : null}
      {children ? <div className="raina-card__body">{children}</div> : null}
      {footer ? <footer className="raina-card__footer">{footer}</footer> : null}
    </section>
  );
});

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({ orientation = "horizontal", className, ...props }: SeparatorProps) {
  return (
    <hr
      {...props}
      aria-orientation={orientation}
      className={cx("raina-separator", `raina-separator--${orientation}`, className)}
    />
  );
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultActiveId?: string;
  ariaLabel: string;
  className?: string;
}

export function Tabs({ tabs, defaultActiveId, ariaLabel, className }: TabsProps) {
  const firstEnabledId = tabs.find((tab) => !tab.disabled)?.id ?? tabs[0]?.id ?? "";
  const [activeId, setActiveId] = React.useState(defaultActiveId ?? firstEnabledId);
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeId)
  );
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const generatedId = React.useId();

  const move = (direction: 1 | -1) => {
    if (tabs.length === 0) return;
    for (let step = 1; step <= tabs.length; step += 1) {
      const index = (activeIndex + direction * step + tabs.length) % tabs.length;
      const tab = tabs[index];
      if (tab && !tab.disabled) {
        setActiveId(tab.id);
        break;
      }
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveId(firstEnabledId);
    }
    if (event.key === "End") {
      event.preventDefault();
      const lastEnabled = [...tabs].reverse().find((tab) => !tab.disabled);
      if (lastEnabled) setActiveId(lastEnabled.id);
    }
  };

  if (!activeTab) return null;

  return (
    <div className={cx("raina-tabs", className)}>
      <div className="raina-tabs__list" role="tablist" aria-label={ariaLabel} onKeyDown={onKeyDown}>
        {tabs.map((tab) => {
          const tabId = `raina-tab-${generatedId}-${tab.id}`;
          const panelId = `raina-panel-${generatedId}-${tab.id}`;
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              disabled={tab.disabled}
              aria-selected={tab.id === activeId}
              aria-controls={panelId}
              tabIndex={tab.id === activeId ? 0 : -1}
              className="raina-tabs__trigger"
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        id={`raina-panel-${generatedId}-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`raina-tab-${generatedId}-${activeTab.id}`}
        className="raina-tabs__panel"
      >
        {activeTab.content}
      </div>
    </div>
  );
}

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = React.useState(defaultOpenId ?? items[0]?.id ?? "");
  const generatedId = React.useId();

  return (
    <div className={cx("raina-accordion", className)}>
      {items.map((item) => {
        const isOpen = item.id === openId;
        const panelId = `raina-accordion-panel-${generatedId}-${item.id}`;
        return (
          <section key={item.id} className="raina-accordion__item">
            <button
              type="button"
              className="raina-accordion__trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? "" : item.id)}
            >
              <span>{item.title}</span>
              <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? (
              <div id={panelId} className="raina-accordion__panel">
                {item.content}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

export interface DialogProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  triggerLabel?: string;
  closeLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  destructive?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

export function Dialog({
  title,
  description,
  children,
  footer,
  triggerLabel,
  closeLabel = "إغلاق",
  open,
  defaultOpen,
  destructive = false,
  onOpenChange,
  className
}: DialogProps) {
  const [isOpen, setIsOpen] = useOpenState(open, defaultOpen, onOpenChange);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = description ? `${titleId}-description` : undefined;
  useLayerFocus(isOpen, layerRef, setIsOpen);

  return (
    <>
      {triggerLabel ? <Button onClick={() => setIsOpen(true)}>{triggerLabel}</Button> : null}
      {isOpen ? (
        <div className="raina-layer" role="presentation">
          <div className="raina-layer__backdrop" onClick={() => setIsOpen(false)} />
          <div
            ref={layerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className={cx("raina-dialog", destructive && "raina-dialog--destructive", className)}
            onKeyDown={(event) => trapLayerFocus(event, layerRef.current)}
          >
            <header className="raina-dialog__header">
              <div>
                <h2 id={titleId}>{title}</h2>
                {description ? <p id={descriptionId}>{description}</p> : null}
              </div>
              <IconButton
                label={closeLabel}
                icon="×"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              />
            </header>
            {children ? <div className="raina-dialog__body">{children}</div> : null}
            {footer ? <footer className="raina-dialog__footer">{footer}</footer> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

export interface SheetProps extends DialogProps {
  side?: "bottom" | "inline";
}

export function Sheet({
  title,
  description,
  children,
  footer,
  triggerLabel,
  closeLabel = "إغلاق",
  open,
  defaultOpen,
  onOpenChange,
  className,
  side = "bottom"
}: SheetProps) {
  const [isOpen, setIsOpen] = useOpenState(open, defaultOpen, onOpenChange);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = description ? `${titleId}-description` : undefined;
  useLayerFocus(isOpen, layerRef, setIsOpen);

  return (
    <>
      {triggerLabel ? (
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          {triggerLabel}
        </Button>
      ) : null}
      {isOpen ? (
        <div className="raina-layer raina-layer--sheet" role="presentation">
          <div className="raina-layer__backdrop" onClick={() => setIsOpen(false)} />
          <div
            ref={layerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className={cx("raina-sheet", `raina-sheet--${side}`, className)}
            onKeyDown={(event) => trapLayerFocus(event, layerRef.current)}
          >
            <span className="raina-sheet__handle" aria-hidden="true" />
            <header className="raina-sheet__header">
              <div>
                <h2 id={titleId}>{title}</h2>
                {description ? <p id={descriptionId}>{description}</p> : null}
              </div>
              <IconButton
                label={closeLabel}
                icon="×"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              />
            </header>
            {children ? <div className="raina-sheet__body">{children}</div> : null}
            {footer ? <footer className="raina-sheet__footer">{footer}</footer> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

export const BottomSheet = Sheet;

export interface DropdownMenuItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  tone?: "normal" | "danger";
  onSelect?: () => void;
}

export interface DropdownMenuProps {
  label: string;
  items: DropdownMenuItem[];
  className?: string;
}

export function DropdownMenu({ label, items, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuId = React.useId();

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className={cx("raina-dropdown", className)}>
      <Button
        variant="outline"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        trailingIcon="⌄"
        onClick={() => setIsOpen((current) => !current)}
      >
        {label}
      </Button>
      {isOpen ? (
        <div id={menuId} className="raina-dropdown__menu" role="menu">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cx(
                "raina-dropdown__item",
                item.tone === "danger" && "raina-dropdown__item--danger"
              )}
              onClick={() => {
                item.onSelect?.();
                setIsOpen(false);
              }}
            >
              <span>{item.label}</span>
              {item.description ? <small>{item.description}</small> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Exclude<Tone, "primary" | "purple">;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function Toast({
  variant = "info",
  title,
  description,
  action,
  onDismiss,
  dismissLabel = "إغلاق التنبيه",
  className,
  ...props
}: ToastProps) {
  const urgent = variant === "error" || variant === "warning";

  return (
    <div
      {...props}
      role={urgent ? "alert" : "status"}
      aria-live={urgent ? "assertive" : "polite"}
      className={cx("raina-toast", `raina-toast--${variant}`, className)}
    >
      <div className="raina-toast__content">
        <strong>{title}</strong>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="raina-toast__action">{action}</div> : null}
      {onDismiss ? (
        <IconButton label={dismissLabel} icon="×" variant="ghost" onClick={onDismiss} />
      ) : null}
    </div>
  );
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Exclude<Tone, "primary" | "purple">;
  title: string;
  description?: string;
}

export function Alert({ variant = "info", title, description, className, ...props }: AlertProps) {
  return (
    <div
      {...props}
      role={variant === "error" ? "alert" : "status"}
      className={cx("raina-alert", `raina-alert--${variant}`, className)}
    >
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "avatar" | "card" | "image";
}

export function Skeleton({ variant = "text", className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx("raina-skeleton", `raina-skeleton--${variant}`, className)}
    />
  );
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  className
}: EmptyStateProps) {
  return (
    <section className={cx("raina-state", className)} aria-labelledby="raina-empty-title">
      {icon ? (
        <div className="raina-state__icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h2 id="raina-empty-title">{title}</h2>
      {description ? <p>{description}</p> : null}
      {primaryAction || secondaryAction ? (
        <div className="raina-state__actions">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </section>
  );
}

export interface ErrorStateProps {
  title: string;
  description?: string;
  retryAction?: React.ReactNode;
  supportAction?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title,
  description,
  retryAction,
  supportAction,
  className
}: ErrorStateProps) {
  return (
    <section
      className={cx("raina-state raina-state--error", className)}
      aria-labelledby="raina-error-title"
    >
      <div className="raina-state__icon" aria-hidden="true">
        !
      </div>
      <h2 id="raina-error-title">{title}</h2>
      {description ? <p>{description}</p> : null}
      {retryAction || supportAction ? (
        <div className="raina-state__actions">
          {retryAction}
          {supportAction}
        </div>
      ) : null}
    </section>
  );
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({
  size = "md",
  label = "جاري التحميل",
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      {...props}
      role="status"
      aria-label={label}
      className={cx("raina-spinner", `raina-spinner--${size}`, className)}
    >
      <span aria-hidden="true" />
    </span>
  );
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
}

export function Progress({ value, max = 100, label, className, ...props }: ProgressProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div {...props} className={cx("raina-progress", className)}>
      {label ? <span className="raina-progress__label">{label}</span> : null}
      <div
        className="raina-progress__track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <span className="raina-progress__bar" style={{ inlineSize: `${percentage}%` }} />
      </div>
    </div>
  );
}

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cx("raina-tooltip", className)}>
      {children}
      <span role="tooltip" className="raina-tooltip__content">
        {content}
      </span>
    </span>
  );
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "full";
}

export function Container({ size = "md", className, ...props }: ContainerProps) {
  return (
    <div {...props} className={cx("raina-container", `raina-container--${size}`, className)} />
  );
}

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: Space;
  align?: "stretch" | "start" | "center" | "end";
}

export function Stack({ gap = "16", align = "stretch", className, ...props }: StackProps) {
  return (
    <div
      {...props}
      className={cx("raina-stack", `raina-gap-${gap}`, `raina-align-${align}`, className)}
    />
  );
}

export interface InlineProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: Space;
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end" | "between";
}

export function Inline({
  gap = "8",
  align = "center",
  justify = "start",
  className,
  ...props
}: InlineProps) {
  return (
    <div
      {...props}
      className={cx(
        "raina-inline",
        `raina-gap-${gap}`,
        `raina-align-${align}`,
        `raina-justify-${justify}`,
        className
      )}
    />
  );
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: Space;
  columns?: "1" | "2" | "3" | "4" | "auto";
}

export function Grid({ gap = "16", columns = "auto", className, ...props }: GridProps) {
  return (
    <div
      {...props}
      className={cx("raina-grid", `raina-grid--${columns}`, `raina-gap-${gap}`, className)}
    />
  );
}

export interface AppShellProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ header, sidebar, footer, children, className }: AppShellProps) {
  return (
    <div className={cx("raina-app-shell", className)}>
      {header ? <header className="raina-app-shell__header">{header}</header> : null}
      <div
        className={cx(
          "raina-app-shell__content",
          Boolean(sidebar) && "raina-app-shell__content--with-sidebar"
        )}
      >
        {sidebar ? <aside className="raina-app-shell__sidebar">{sidebar}</aside> : null}
        <main className="raina-app-shell__main">{children}</main>
      </div>
      {footer ? <footer className="raina-app-shell__footer">{footer}</footer> : null}
    </div>
  );
}

export interface DataTableColumn {
  id: string;
  header: React.ReactNode;
  align?: "start" | "center" | "end";
}

export interface DataTableRow {
  id: string;
  cells: Record<string, React.ReactNode>;
  actions?: React.ReactNode;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  caption: string;
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export function DataTable({
  columns,
  rows,
  caption,
  loading = false,
  emptyText = "لا توجد بيانات",
  className
}: DataTableProps) {
  const columnCount = columns.length + 1;

  return (
    <div className={cx("raina-table-wrap", className)}>
      <table className="raina-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} className={cx(column.align && `raina-text-${column.align}`)}>
                {column.header}
              </th>
            ))}
            <th className="raina-text-end">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columnCount}>
                <Skeleton variant="text" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount}>{emptyText}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.id} className={cx(column.align && `raina-text-${column.align}`)}>
                    {row.cells[column.id]}
                  </td>
                ))}
                <td className="raina-text-end">{row.actions}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={cx("raina-pagination", className)} aria-label="ترقيم الصفحات">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
      >
        السابق
      </Button>
      <div className="raina-pagination__pages">
        {pages.map((item) => (
          <button
            key={item}
            type="button"
            className="raina-pagination__page"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange?.(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
      >
        التالي
      </Button>
    </nav>
  );
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cx("raina-breadcrumb", className)} aria-label="مسار الصفحة">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  trend?: React.ReactNode;
}

export function StatCard({ label, value, hint, icon, trend, className, ...props }: StatCardProps) {
  return (
    <div {...props} className={cx("raina-stat", className)}>
      {icon ? (
        <span className="raina-stat__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="raina-stat__label">{label}</span>
      <strong className="raina-stat__value">{value}</strong>
      {hint ? <span className="raina-stat__hint">{hint}</span> : null}
      {trend ? <span className="raina-stat__trend">{trend}</span> : null}
    </div>
  );
}
