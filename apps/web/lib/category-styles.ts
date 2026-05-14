import {
  BookOpen,
  Code2,
  Globe2,
  GraduationCap,
  Landmark,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_STYLES: Record<string, { icon: LucideIcon; className: string }> = {
  "online-degrees": { icon: GraduationCap, className: "bg-blue-100 text-blue-700" },
  "coding-it": { icon: Code2, className: "bg-violet-100 text-violet-700" },
  "kids-learning": { icon: Sparkles, className: "bg-orange-100 text-orange-700" },
  "govt-exams": { icon: Landmark, className: "bg-emerald-100 text-emerald-700" },
  "study-abroad": { icon: Globe2, className: "bg-cyan-100 text-cyan-700" },
  "test-series": { icon: BookOpen, className: "bg-rose-100 text-rose-700" },
};

export function getCategoryStyle(slug: string) {
  return CATEGORY_STYLES[slug] || { icon: GraduationCap, className: "bg-brand-light text-brand" };
}
