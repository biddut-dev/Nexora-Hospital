// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getPriorityColor(priority: "critical" | "urgent" | "stable") {
  switch (priority) {
    case "critical":
      return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";
    case "urgent":
      return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800";
    case "stable":
      return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800";
  }
}

export function getBedStatusColor(status: string) {
  switch (status) {
    case "available":
      return "bed-available";
    case "occupied":
      return "bed-occupied";
    case "reserved":
      return "bed-reserved";
    case "cleaning":
      return "bed-cleaning";
    case "maintenance":
      return "bed-maintenance";
    default:
      return "bed-available";
  }
}

export function generatePatientId(): string {
  return `NXR-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
}

export function generateTokenNumber(): string {
  return `T-${Math.floor(Math.random() * 900 + 100)}`;
}
