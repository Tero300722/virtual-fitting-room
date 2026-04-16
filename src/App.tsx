import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Search,
  Heart,
  Share2,
  Bookmark,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RefreshCcw,
  X,
  ShoppingBag,
  Star,
  Check,
  Wand2,
  ChevronRight,
  ChevronLeft,
  Shirt,
  Footprints,
  Gem,
  LayoutGrid,
  Menu,
  Eye,
  Download,
  User,
  Play,
  Plus,
  Minus,
  Layers,
  BadgeCheck,
  SunMoon,
  PanelRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "./components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

type Category = "tops" | "jackets" | "trousers" | "dresses" | "shoes" | "accessories";
type FitSize = "S" | "M" | "L";
type Occasion = "Work" | "Evening" | "Street" | "Resort" | "Formal";
type View = "landing" | "entry" | "studio" | "saved" | "wishlist" | "settings" | "dashboard";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: Category;
  colors: string[];
  sizes: FitSize[];
  material: string;
  occasion: Occasion;
  description: string;
  rating: number;
  trending?: boolean;
  image: string;
  overlay: {
    type: "top" | "bottom" | "dress" | "shoes" | "accessory" | "jacket";
    width: number;
    height: number;
    y: number;
    x: number;
    svg: string;
  };
};

type OverlayItem = {
  id: string;
  productId: string;
  size: FitSize;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  layer: number;
  opacity: number;
};

type SavedLook = {
  id: string;
  name: string;
  items: OverlayItem[];
  image: string | null;
  createdAt: string;
  fitScore: number;
};

type Filters = {
  category: Category | "all";
  color: string | "all";
  style: Occasion | "all";
  size: FitSize | "all";
  brand: string | "all";
  search: string;
};

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Silk Contour Blouse",
    brand: "Maison Noire",
    price: 320,
    category: "tops",
    colors: ["Ivory", "Black"],
    sizes: ["S", "M", "L"],
    material: "Mulberry silk blend",
    occasion: "Work",
    description: "Fluid tailoring with a refined collar and soft drape for premium day-to-evening wear.",
    rating: 4.8,
    trending: true,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    overlay: {
      type: "top",
      width: 220,
      height: 180,
      x: 0,
      y: -72,
      svg: `<svg viewBox="0 0 260 210" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fbfbfa"/><stop offset="1" stop-color="#dfddd7"/></linearGradient></defs><path d="M68 32L102 18h56l34 14 28 32-20 20-26-18v112H86V66L60 84 40 64l28-32z" fill="url(#g1)"/><path d="M104 18l26 26 26-26" fill="none" stroke="#c6c0b7" stroke-width="3"/><path d="M130 44v134" stroke="#c8c2b9" stroke-width="2" stroke-dasharray="4 6"/></svg>`,
    },
  },
  {
    id: "p2",
    name: "Tailored Edge Blazer",
    brand: "Atelier Aurelia",
    price: 590,
    category: "jackets",
    colors: ["Black", "Stone"],
    sizes: ["S", "M", "L"],
    material: "Italian wool stretch",
    occasion: "Formal",
    description: "Sharp lapels and a sculpted waist create a high-precision silhouette ideal for statement layering.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    overlay: {
      type: "jacket",
      width: 240,
      height: 210,
      x: 0,
      y: -64,
      svg: `<svg viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#16181d"/><stop offset="1" stop-color="#2b3139"/></linearGradient></defs><path d="M76 36l40-20h48l40 20 30 42-24 18-26-18v132H76V78L50 96 26 78l30-42z" fill="url(#g2)"/><path d="M116 16l24 46 24-46" fill="#232830"/><path d="M140 62v148" stroke="#7c8797" stroke-width="2"/><circle cx="140" cy="92" r="3" fill="#a2acba"/><circle cx="140" cy="118" r="3" fill="#a2acba"/><circle cx="140" cy="144" r="3" fill="#a2acba"/></svg>`,
    },
  },
  {
    id: "p3",
    name: "Precision Trousers",
    brand: "Maison Noire",
    price: 410,
    category: "trousers",
    colors: ["Charcoal", "Black"],
    sizes: ["S", "M", "L"],
    material: "Technical suiting weave",
    occasion: "Work",
    description: "A long-line tapered trouser with a fluid leg and clean break for a lengthened profile.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1506629905607-d9d4b2b9d2a0?auto=format&fit=crop&w=900&q=80",
    overlay: {
      type: "bottom",
      width: 180,
      height: 270,
      x: 0,
      y: 88,
      svg: `<svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3e434b"/><stop offset="1" stop-color="#1f2328"/></linearGradient></defs><path d="M58 22h104l10 66-26 212h-42l6-148h-12L104 300H62L48 88l10-66z" fill="url(#g3)"/><path d="M110 88v212" stroke="#687180" stroke-width="2"/></svg>`,
    },
  },
  {
    id: "p4",
    name: "Midnight Column Dress",
    brand: "Élan Studio",
    price: 760,
    category: "dresses",
    colors: ["Midnight", "Ruby"],
    sizes: ["S", "M", "L"],
    material: "Satin crepe",
    occasion: "Evening",
    description: "Clean evening glamour with a refined neckline and soft body-skimming movement.",
    rating: 4.9,
    trending: true,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    overlay: {
      type: "dress",
      width: 220,
      height: 350,
      x: 0,
      y: 26,
      svg: `<svg viewBox="0 0 260 390" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b0d14"/><stop offset="1" stop-color="#23283b"/></linearGradient></defs><path d="M94 24l36-16 36 16 18 34-18 36-10 262H104L94 94 76 58l18-34z" fill="url(#g4)"/><path d="M106 42c10 10 38 10 48 0" stroke="#4b567a" stroke-width="3" fill="none"/><path d="M130 94v258" stroke="#39415f" stroke-width="2" opacity="0.65"/></svg>`,
    },
  },
  {
    id: "p5",
    name: "Sculpt Leather Heels",
    brand: "Atelier Aurelia",
    price: 290,
    category: "shoes",
    colors: ["Black", "Nude"],
    sizes: ["S", "M", "L"],
    material: "Calf leather",
    occasion: "Formal",
    description: "Architectural heels designed to complete polished looks with understated confidence.",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
    overlay: {
      type: "shoes",
      width: 170,
      height: 70,
      x: 0,
      y: 296,
      svg: `<svg viewBox="0 0 220 90" xmlns="http://www.w3.org/2000/svg"><path d="M38 58c12 0 18 4 30 8h28c10 0 18-8 14-16-8-4-18-8-22-18l-20 2c-6 10-14 18-30 24z" fill="#101216"/><path d="M122 58c12 0 18 4 30 8h28c10 0 18-8 14-16-8-4-18-8-22-18l-20 2c-6 10-14 18-30 24z" fill="#101216"/></svg>`,
    },
  },
  {
    id: "p6",
    name: "Aurora Signature Bag",
    brand: "Élan Studio",
    price: 680,
    category: "accessories",
    colors: ["Gold", "Sand"],
    sizes: ["S", "M", "L"],
    material: "Structured leather",
    occasion: "Resort",
    description: "A sculptural handbag that adds status and warmth to any curated outfit.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    overlay: {
      type: "accessory",
      width: 90,
      height: 120,
      x: 96,
      y: 92,
      svg: `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g6" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d6b46f"/><stop offset="1" stop-color="#a9792c"/></linearGradient></defs><rect x="20" y="44" width="80" height="74" rx="12" fill="url(#g6)"/><path d="M40 44c0-14 8-24 20-24s20 10 20 24" stroke="#a8792c" stroke-width="8" fill="none"/></svg>`,
    },
  },
  {
    id: "p7",
    name: "Cityline Knit Top",
    brand: "North Atelier",
    price: 210,
    category: "tops",
    colors: ["Taupe", "Ivory"],
    sizes: ["S", "M", "L"],
    material: "Fine rib knit",
    occasion: "Street",
    description: "Soft modern knitwear with a refined close fit ideal for layering and travel.",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    overlay: {
      type: "top",
      width: 210,
      height: 170,
      x: 0,
      y: -72,
      svg: `<svg viewBox="0 0 260 210" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g7" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d2c6bd"/><stop offset="1" stop-color="#baaba0"/></linearGradient></defs><path d="M72 38l34-18h48l34 18 20 30-18 18-20-16v112H90V70L70 86 52 68l20-30z" fill="url(#g7)"/><path d="M130 44v138" stroke="#a38d7e" stroke-width="2" opacity="0.5"/></svg>`,
    },
  },
  {
    id: "p8",
    name: "Aero Frame Sunglasses",
    brand: "North Atelier",
    price: 180,
    category: "accessories",
    colors: ["Black", "Silver"],
    sizes: ["S", "M", "L"],
    material: "Titanium acetate",
    occasion: "Resort",
    description: "A slim futuristic silhouette to elevate vacation and city looks alike.",
    rating: 4.4,
    trending: true,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    overlay: {
      type: "accessory",
      width: 120,
      height: 40,
      x: 0,
      y: -122,
      svg: `<svg viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="18" rx="12" ry="12" width="52" height="24" fill="#111"/><rect x="112" y="18" rx="12" ry="12" width="52" height="24" fill="#111"/><path d="M68 30h44" stroke="#333" stroke-width="6"/><path d="M12 28h8M160 28h8" stroke="#333" stroke-width="4"/></svg>`,
    },
  },
];

const DEMO_MODELS = [
  {
    id: "m1",
    name: "Editorial Pose",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "m2",
    name: "Minimal Studio",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "m3",
    name: "Modern Street",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
];

const brandStats = [
  { label: "Fit Match Accuracy", value: "94%" },
  { label: "Avg. Session Lift", value: "+31%" },
  { label: "Conversion Signal", value: "2.4x" },
];

const colorTokens = ["Black", "Ivory", "Stone", "Charcoal", "Midnight", "Ruby", "Gold", "Sand", "Taupe", "Nude", "Silver"];
const categories: Array<Filters["category"]> = ["all", "tops", "jackets", "trousers", "dresses", "shoes", "accessories"];
const occasions: Array<Filters["style"]> = ["all", "Work", "Evening", "Street", "Resort", "Formal"];
const brands = ["all", ...Array.from(new Set(initialProducts.map((p) => p.brand)))];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function baseScaleBySize(size: FitSize) {
  if (size === "S") return 0.93;
  if (size === "L") return 1.08;
  return 1;
}

function overlayLayerForCategory(category: Category) {
  if (category === "trousers" || category === "shoes") return 2;
  if (category === "accessories") return 4;
  if (category === "jackets") return 5;
  return 3;
}

function useLocalStorageState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore write failures
    }
  }, [key, state]);

  return [state, setState] as const;
}

function AppShellBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[#07080d]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(132,99,255,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,214,102,0.12),transparent_26%),radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_35%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:92px_92px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
    </>
  );
}

function NavBar({ currentView, onNavigate, onOpenEntry }: { currentView: View; onNavigate: (view: View) => void; onOpenEntry: () => void }) {
  const [open, setOpen] = useState(false);
  const navItems: Array<{ view: View; label: string }> = [
    { view: "studio", label: "Studio" },
    { view: "saved", label: "Saved Looks" },
    { view: "wishlist", label: "Wishlist" },
    { view: "dashboard", label: "Pitch Mode" },
    { view: "settings", label: "Settings" },
  ];

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/25 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button className="flex items-center gap-3" onClick={() => onNavigate("landing")}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium uppercase tracking-[0.28em] text-white/60">Auréve Mirror</div>
            <div className="text-lg font-semibold text-white">Virtual Fitting Room</div>
          </div>
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Button
              key={item.view}
              variant="ghost"
              className={cn(
                "rounded-full px-5 text-white/75 hover:bg-white/10 hover:text-white",
                currentView === item.view && "bg-white/12 text-white"
              )}
              onClick={() => onNavigate(item.view)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="outline" className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={onOpenEntry}>
            <User className="mr-2 h-4 w-4" />
            Guest Demo
          </Button>
          <Button className="rounded-full bg-white text-black hover:bg-white/90" onClick={() => onNavigate("studio")}>
            Start Fitting
          </Button>
        </div>

        <Button variant="ghost" className="rounded-full text-white lg:hidden" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="border-white/10 bg-[#0b0d12] text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Navigate</SheetTitle>
          </SheetHeader>
          <div className="mt-8 flex flex-col gap-3">
            {navItems.map((item) => (
              <Button
                key={item.view}
                variant="ghost"
                className="justify-start rounded-2xl text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => {
                  onNavigate(item.view);
                  setOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button className="mt-4 rounded-2xl bg-white text-black hover:bg-white/90" onClick={() => { onNavigate("studio"); setOpen(false); }}>
              Start Fitting
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function HeroLanding({ onStart, onTryDemo, onEntry }: { onStart: () => void; onTryDemo: () => void; onEntry: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pb-32 lg:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <Badge className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-white/80 backdrop-blur-xl">
            <BadgeCheck className="mr-2 h-4 w-4" />
            Built for luxury retail pitches, investors, and customer demos
          </Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
            The premium <span className="bg-gradient-to-r from-white via-[#ece7ff] to-[#ccb7ff] bg-clip-text text-transparent">virtual fitting room</span> for fashion brands.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
            Elevate ecommerce with a photoreal-inspired try-on studio, style intelligence, upsell flows, and a polished customer journey that feels ready for market.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="rounded-full bg-white px-7 text-black hover:bg-white/90" onClick={onStart}>
              Start Fitting
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10" onClick={onEntry}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
            <Button size="lg" variant="ghost" className="rounded-full bg-transparent px-7 text-white hover:bg-white/10" onClick={onTryDemo}>
              <Play className="mr-2 h-4 w-4" />
              Try Demo
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {brandStats.map((stat) => (
              <Card key={stat.label} className="border-white/10 bg-white/5 text-white backdrop-blur-2xl">
                <CardContent className="p-5">
                  <div className="text-3xl font-semibold">{stat.value}</div>
                  <div className="mt-2 text-sm text-white/60">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75 }} className="relative">
          <div className="absolute -inset-8 rounded-[36px] bg-gradient-to-br from-[#8c6bff]/20 via-transparent to-[#f0b95e]/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/7 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="grid gap-4 md:grid-cols-[0.64fr_0.36fr]">
              <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[#121520]">
                <img
                  alt="Virtual fitting room preview"
                  src={DEMO_MODELS[0].image}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-black/10" />
                <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/75 backdrop-blur-xl">
                  Live style preview
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-[24px] border border-white/10 bg-black/30 p-4 text-white backdrop-blur-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.2em] text-white/60">AI Style Assistant</div>
                      <div className="mt-1 text-lg font-medium">Evening edit with tailored depth</div>
                    </div>
                    <Badge className="bg-emerald-400/15 text-emerald-200">Fit Score 92</Badge>
                  </div>
                  <Progress value={92} className="mt-4 h-2 bg-white/10" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Card className="border-white/10 bg-white/5 text-white backdrop-blur-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">How it works</CardTitle>
                    <CardDescription className="text-white/60">Designed for elegant, guided retail experiences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-white/70">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">1. Upload a photo or launch camera preview</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">2. Browse premium catalog, filter by style and occasion</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">3. Adjust fit, layer garments, compare looks, and share</div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-white backdrop-blur-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Trending looks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {initialProducts.filter((p) => p.trending).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2">
                        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium text-white">{item.name}</div>
                          <div className="text-sm text-white/55">{item.brand}</div>
                        </div>
                        <div className="text-sm text-white/85">{formatPrice(item.price)}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function EntryExperience({
  onBack,
  onContinue,
  onUseDemo,
  onUpload,
  hasCamera,
  videoRef,
  photoGuidance,
}: {
  onBack: () => void;
  onContinue: () => void;
  onUseDemo: (image: string) => void;
  onUpload: (file: File) => void;
  hasCamera: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  photoGuidance: string[];
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" className="rounded-full text-white hover:bg-white/10" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Badge className="rounded-full border border-white/10 bg-white/10 text-white/80">Onboarding</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="overflow-hidden border-white/10 bg-white/5 text-white backdrop-blur-2xl">
          <CardContent className="grid gap-4 p-4 md:grid-cols-2">
            <button
              className="group relative min-h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-left"
              onClick={() => fileRef.current?.click()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_55%)]" />
              <div className="relative flex h-full flex-col justify-between p-6">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl w-fit">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">Upload a full-body photo</div>
                  <p className="mt-3 max-w-md text-white/65">
                    For the most accurate preview, choose a front-facing image with good lighting and visible torso and legs.
                  </p>
                  <Button className="mt-6 rounded-full bg-white text-black hover:bg-white/90">Choose image</Button>
                </div>
              </div>
            </button>

            <div className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#11141d]">
              <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 h-full w-full object-cover" />
              {!hasCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center text-white/70">
                  <Camera className="mb-4 h-8 w-8" />
                  Camera preview unavailable in this environment.
                  <span className="mt-2 text-sm text-white/45">Use Upload or Demo mode for the full experience.</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="text-xs uppercase tracking-[0.24em] text-white/50">Live capture preview</div>
                <div className="mt-2 text-xl font-semibold text-white">Frame shoulders to shoes</div>
                <div className="mt-1 text-sm text-white/60">Ideal for presenter-led demo walkthroughs.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/5 text-white backdrop-blur-2xl">
            <CardHeader>
              <CardTitle>Capture guidance</CardTitle>
              <CardDescription className="text-white/60">Premium presentation starts with a clean subject frame</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {photoGuidance.map((tip) => (
                <div key={tip} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-300" />
                  {tip}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white backdrop-blur-2xl">
            <CardHeader>
              <CardTitle>Demo models</CardTitle>
              <CardDescription className="text-white/60">Built-in assets for instant pitch-ready flow</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
              {DEMO_MODELS.map((model) => (
                <button key={model.id} onClick={() => onUseDemo(model.image)} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:scale-[1.02] hover:bg-white/10">
                  <img src={model.image} alt={model.name} className="h-36 w-full object-cover" />
                  <div className="p-3 text-sm text-white/80">{model.name}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button onClick={onContinue} className="rounded-full bg-white px-7 text-black hover:bg-white/90">
              Continue to Studio
            </Button>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => onUseDemo(DEMO_MODELS[0].image)}>
              <Play className="mr-2 h-4 w-4" />
              Instant Demo
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
  onFavorite,
  isFavorite,
  onDetails,
}: {
  product: Product;
  onAdd: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
  onDetails: () => void;
}) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
      <Card className="group h-full overflow-hidden rounded-[28px] border-white/10 bg-white/5 text-white backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
        <div className="relative aspect-[0.9] overflow-hidden">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="rounded-full bg-black/35 text-white backdrop-blur-xl">{product.brand}</Badge>
            {product.trending && <Badge className="rounded-full bg-amber-400/20 text-amber-100">Trending</Badge>}
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <button onClick={onFavorite} className="rounded-full border border-white/10 bg-black/30 p-2 text-white backdrop-blur-xl transition hover:bg-black/45">
              <Heart className={cn("h-4 w-4", isFavorite && "fill-white")} />
            </button>
            <button onClick={onDetails} className="rounded-full border border-white/10 bg-black/30 p-2 text-white backdrop-blur-xl transition hover:bg-black/45">
              <Eye className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-white">{product.name}</div>
              <div className="mt-1 text-sm text-white/65">{product.material}</div>
            </div>
            <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90" onClick={onAdd}>
              Add
            </Button>
          </div>
        </div>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <div className="text-sm text-white/55">{product.occasion}</div>
            <div className="mt-1 text-base font-medium">{formatPrice(product.price)}</div>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
            <Star className="h-4 w-4 fill-current" />
            {product.rating}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StudioCanvas({
  image,
  overlays,
  productsById,
  selectedOverlayId,
  onSelectOverlay,
  zoom,
  beforeAfter,
}: {
  image: string | null;
  overlays: OverlayItem[];
  productsById: Record<string, Product>;
  selectedOverlayId: string | null;
  onSelectOverlay: (id: string | null) => void;
  zoom: number;
  beforeAfter: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#11151d] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
        <Badge className="rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-xl">Interactive fit studio</Badge>
        <Badge className="rounded-full border border-white/10 bg-black/30 text-white/80 backdrop-blur-xl">Zoom {zoom}%</Badge>
        <Badge className="rounded-full border border-white/10 bg-black/30 text-white/80 backdrop-blur-xl">Layers {overlays.length}</Badge>
      </div>
      <div className="relative aspect-[0.75] min-h-[560px] w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%)]">
        {image ? (
          <motion.div
            key={image + zoom + beforeAfter}
            initial={{ opacity: 0.65, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <img src={image} alt="Model preview" className="h-full w-full object-cover" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white/55">
            <Upload className="mb-4 h-10 w-10" />
            Upload a photo or use Demo mode to begin styling.
          </div>
        )}

        {beforeAfter ? (
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm text-white backdrop-blur-xl">
            Before / After comparison enabled
          </div>
        ) : null}

        <div className="absolute inset-0">
          {overlays
            .slice()
            .sort((a, b) => a.layer - b.layer)
            .map((item) => {
              const product = productsById[item.productId];
              if (!product) return null;
              const isSelected = selectedOverlayId === item.id;
              const width = product.overlay.width * item.scale * baseScaleBySize(item.size);
              const height = product.overlay.height * item.scale * baseScaleBySize(item.size);
              return (
                <button
                  key={item.id}
                  className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-2xl transition",
                    isSelected && "ring-2 ring-white/60"
                  )}
                  style={{
                    width,
                    height,
                    transform: `translate(calc(-50% + ${item.x}px), calc(-50% + ${item.y}px)) rotate(${item.rotation}deg)`,
                    opacity: item.opacity,
                    zIndex: item.layer,
                  }}
                  onClick={() => onSelectOverlay(item.id)}
                >
                  <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: product.overlay.svg }} />
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function ControlPill({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">
      {icon}
      {label}
    </button>
  );
}

function ProductDetailsModal({ product, open, onOpenChange, onAdd }: { product: Product | null; open: boolean; onOpenChange: (open: boolean) => void; onAdd: () => void }) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-white/10 bg-[#0e1118] text-white">
        <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-[28px] border border-white/10">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <DialogHeader>
              <DialogTitle className="text-3xl">{product.name}</DialogTitle>
              <DialogDescription className="text-white/60">{product.brand}</DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge className="rounded-full bg-white/10 text-white">{product.category}</Badge>
              <Badge className="rounded-full bg-white/10 text-white">{product.material}</Badge>
              <Badge className="rounded-full bg-white/10 text-white">{product.occasion}</Badge>
            </div>
            <div className="mt-6 text-4xl font-semibold">{formatPrice(product.price)}</div>
            <p className="mt-5 text-white/72">{product.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card className="border-white/10 bg-white/5 text-white">
                <CardContent className="p-4">
                  <div className="text-sm text-white/55">Available sizes</div>
                  <div className="mt-3 flex gap-2">{product.sizes.map((s) => <Badge key={s} className="rounded-full bg-white/10 text-white">{s}</Badge>)}</div>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-white">
                <CardContent className="p-4">
                  <div className="text-sm text-white/55">Colorways</div>
                  <div className="mt-3 flex flex-wrap gap-2">{product.colors.map((c) => <Badge key={c} className="rounded-full bg-white/10 text-white">{c}</Badge>)}</div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-full bg-white text-black hover:bg-white/90" onClick={onAdd}>Add to fitting room</Button>
              <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">View materials</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SidebarSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="border-white/10 bg-white/5 text-white backdrop-blur-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? <CardDescription className="text-white/60">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function App() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [filters, setFilters] = useState<Filters>({ category: "all", color: "all", style: "all", size: "all", brand: "all", search: "" });
  const [products] = useState<Product[]>(initialProducts);
  const productsById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);

  const [selectedImage, setSelectedImage] = useState<string | null>(DEMO_MODELS[0].image);
  const [overlays, setOverlays] = useLocalStorageState<OverlayItem[]>("vf_overlays", []);
  const [savedLooks, setSavedLooks] = useLocalStorageState<SavedLook[]>("vf_saved_looks", []);
  const [wishlist, setWishlist] = useLocalStorageState<string[]>("vf_wishlist", []);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<FitSize>("M");
  const [zoom, setZoom] = useState<number>(100);
  const [beforeAfter, setBeforeAfter] = useState(false);
  const [lookName, setLookName] = useState("");
  const [compareQueue, setCompareQueue] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [styleAssistantOpen, setStyleAssistantOpen] = useState(true);
  const [brandMessage, setBrandMessage] = useState("Luxury virtual try-on experiences that elevate conversion, confidence, and brand perception.");
  const [logoText, setLogoText] = useState("YOUR BRAND");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [loadingStudio, setLoadingStudio] = useState(true);
  const [presenterMode, setPresenterMode] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingStudio(false), 950);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices?.getUserMedia?.({ video: { facingMode: "user" } });
        if (mounted && videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          setCameraEnabled(true);
        }
      } catch {
        setCameraEnabled(false);
      }
    }
    setupCamera();
    return () => {
      mounted = false;
      const src = videoRef.current?.srcObject;
      if (src && src instanceof MediaStream) src.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const selectedOverlay = overlays.find((item) => item.id === selectedOverlayId) || null;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = filters.category === "all" || product.category === filters.category;
      const matchColor = filters.color === "all" || product.colors.includes(filters.color);
      const matchStyle = filters.style === "all" || product.occasion === filters.style;
      const matchSize = filters.size === "all" || product.sizes.includes(filters.size);
      const matchBrand = filters.brand === "all" || product.brand === filters.brand;
      const q = filters.search.trim().toLowerCase();
      const matchSearch = !q || [product.name, product.brand, product.material, product.description, product.occasion].join(" ").toLowerCase().includes(q);
      return matchCategory && matchColor && matchStyle && matchSize && matchBrand && matchSearch;
    });
  }, [products, filters]);

  const recommendedProducts = useMemo(() => {
    const selectedCategories = overlays.map((o) => productsById[o.productId]?.category).filter(Boolean);
    const currentOccasion = overlays.length ? productsById[overlays[0].productId]?.occasion : undefined;
    return products
      .filter((p) => !overlays.some((o) => o.productId === p.id))
      .sort((a, b) => {
        const aScore = (selectedCategories.includes(a.category) ? -1 : 0) + (currentOccasion === a.occasion ? -2 : 0) + (a.trending ? -1 : 0);
        const bScore = (selectedCategories.includes(b.category) ? -1 : 0) + (currentOccasion === b.occasion ? -2 : 0) + (b.trending ? -1 : 0);
        return aScore - bScore;
      })
      .slice(0, 4);
  }, [products, overlays, productsById]);

  const fitScore = useMemo(() => {
    let score = 74;
    if (selectedImage) score += 7;
    if (overlays.length >= 2) score += 6;
    if (overlays.length >= 3) score += 4;
    if (overlays.some((o) => productsById[o.productId]?.category === "accessories")) score += 2;
    if (overlays.some((o) => productsById[o.productId]?.category === "shoes")) score += 2;
    return Math.min(96, score);
  }, [selectedImage, overlays, productsById]);

  const currentOutfitTotal = useMemo(() => overlays.reduce((sum, item) => sum + (productsById[item.productId]?.price || 0), 0), [overlays, productsById]);

  function handleUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(typeof reader.result === "string" ? reader.result : null);
      setCurrentView("studio");
    };
    reader.readAsDataURL(file);
  }

  function addProductToOverlay(product: Product) {
    const item: OverlayItem = {
      id: uid("overlay"),
      productId: product.id,
      size: selectedSize,
      x: product.overlay.x,
      y: product.overlay.y,
      scale: 1,
      rotation: 0,
      layer: overlayLayerForCategory(product.category),
      opacity: 1,
    };
    setOverlays((prev) => [...prev.filter((o) => {
      const existing = productsById[o.productId];
      return !(existing && existing.category === product.category && product.category !== "accessories");
    }), item]);
    setSelectedOverlayId(item.id);
    setCurrentView("studio");
    setRecentlyViewed((prev) => [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 8));
  }

  function updateSelectedOverlay(updater: (item: OverlayItem) => OverlayItem) {
    if (!selectedOverlayId) return;
    setOverlays((prev) => prev.map((item) => (item.id === selectedOverlayId ? updater(item) : item)));
  }

  function removeSelectedOverlay() {
    if (!selectedOverlayId) return;
    setOverlays((prev) => prev.filter((item) => item.id !== selectedOverlayId));
    setSelectedOverlayId(null);
  }

  function resetOutfit() {
    setOverlays([]);
    setSelectedOverlayId(null);
    setZoom(100);
    setBeforeAfter(false);
  }

  function saveCurrentLook() {
    const name = lookName.trim() || `Look ${savedLooks.length + 1}`;
    const look: SavedLook = {
      id: uid("look"),
      name,
      items: overlays,
      image: selectedImage,
      createdAt: new Date().toLocaleString(),
      fitScore,
    };
    setSavedLooks((prev) => [look, ...prev]);
    setLookName("");
    setCurrentView("saved");
  }

  function loadLook(look: SavedLook) {
    setSelectedImage(look.image);
    setOverlays(look.items);
    setSelectedOverlayId(look.items[0]?.id || null);
    setCurrentView("studio");
  }

  function toggleWishlist(productId: string) {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }

  function exportOutfitSummary() {
    const summaryLines = [
      `${logoText} — Virtual Fitting Room Outfit Summary`,
      `Pitch Message: ${brandMessage}`,
      `Fit Match Score: ${fitScore}`,
      `Items:`,
      ...overlays.map((item, idx) => {
        const product = productsById[item.productId];
        return `${idx + 1}. ${product?.name} (${product?.brand}) — ${formatPrice(product?.price || 0)} — Size ${item.size}`;
      }),
      `Total: ${formatPrice(currentOutfitTotal)}`,
    ].join("\n");

    const blob = new Blob([summaryLines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "virtual-fitting-room-outfit-summary.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function shareLook() {
    const summary = overlays.map((item) => productsById[item.productId]?.name).filter(Boolean).join(", ");
    const payload = {
      title: `${logoText} Look Share`,
      text: `Explore this curated outfit: ${summary}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(`${payload.title}\n${payload.text}\n${payload.url}`);
        alert("Look summary copied to clipboard.");
      }
    } catch {
      // No-op
    }
  }

  const photoGuidance = [
    "Use a front-facing full-body photo with neutral posture.",
    "Keep arms slightly away from the torso for clearer garment placement.",
    "Choose soft lighting and a clean background for better contrast.",
    "Avoid extreme angles to improve fit realism and presenter confidence.",
  ];

  const iconForCategory = (category: Category) => {
    if (category === "tops") return <Shirt className="h-4 w-4" />;
    if (category === "shoes") return <Footprints className="h-4 w-4" />;
    if (category === "accessories") return <Gem className="h-4 w-4" />;
    return <LayoutGrid className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen text-white">
      <AppShellBackground />
      <NavBar currentView={currentView} onNavigate={setCurrentView} onOpenEntry={() => setCurrentView("entry")} />

      <AnimatePresence mode="wait">
        {currentView === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HeroLanding
              onStart={() => setCurrentView("studio")}
              onTryDemo={() => {
                setSelectedImage(DEMO_MODELS[0].image);
                setCurrentView("studio");
              }}
              onEntry={() => setCurrentView("entry")}
            />
          </motion.div>
        )}

        {currentView === "entry" && (
          <motion.div key="entry" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <EntryExperience
              onBack={() => setCurrentView("landing")}
              onContinue={() => setCurrentView("studio")}
              onUseDemo={(image) => {
                setSelectedImage(image);
                setCurrentView("studio");
              }}
              onUpload={handleUpload}
              hasCamera={cameraEnabled}
              videoRef={videoRef}
              photoGuidance={photoGuidance}
            />
          </motion.div>
        )}

        {currentView === "studio" && (
          <motion.div key="studio" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-white/45">Fitting Room Studio</div>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Luxury virtual try-on, built for conversion and confidence.</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={shareLook}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Look
                  </Button>
                  <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={exportOutfitSummary}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Summary
                  </Button>
                  <Button className="rounded-full bg-white text-black hover:bg-white/90" onClick={saveCurrentLook} disabled={!overlays.length}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save Look
                  </Button>
                </div>
              </div>

              {loadingStudio ? (
                <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
                  <div className="h-[740px] animate-pulse rounded-[32px] border border-white/10 bg-white/5" />
                  <div className="space-y-6">
                    <div className="h-40 animate-pulse rounded-[32px] border border-white/10 bg-white/5" />
                    <div className="h-72 animate-pulse rounded-[32px] border border-white/10 bg-white/5" />
                    <div className="h-80 animate-pulse rounded-[32px] border border-white/10 bg-white/5" />
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                  <div className="space-y-6">
                    <StudioCanvas
                      image={beforeAfter ? null : selectedImage}
                      overlays={beforeAfter ? [] : overlays}
                      productsById={productsById}
                      selectedOverlayId={selectedOverlayId}
                      onSelectOverlay={setSelectedOverlayId}
                      zoom={zoom}
                      beforeAfter={beforeAfter}
                    />

                    <Card className="border-white/10 bg-white/5 text-white backdrop-blur-2xl">
                      <CardContent className="flex flex-wrap gap-3 p-4">
                        <ControlPill icon={<ZoomIn className="h-4 w-4" />} label="Zoom In" onClick={() => setZoom((z) => Math.min(130, z + 5))} />
                        <ControlPill icon={<ZoomOut className="h-4 w-4" />} label="Zoom Out" onClick={() => setZoom((z) => Math.max(85, z - 5))} />
                        <ControlPill icon={<RefreshCcw className="h-4 w-4" />} label="Reset Outfit" onClick={resetOutfit} />
                        <ControlPill icon={<SunMoon className="h-4 w-4" />} label={beforeAfter ? "Back to Styled" : "Before / After"} onClick={() => setBeforeAfter((v) => !v)} />
                        <ControlPill icon={<PanelRight className="h-4 w-4" />} label={styleAssistantOpen ? "Hide Assistant" : "Show Assistant"} onClick={() => setStyleAssistantOpen((v) => !v)} />
                      </CardContent>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-[0.63fr_0.37fr]">
                      <SidebarSection title="Catalog" description="Search, filter, preview, and add garments instantly">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                            <Search className="h-4 w-4 text-white/55" />
                            <Input
                              value={filters.search}
                              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                              placeholder="Search luxury essentials, occasion, material..."
                              className="border-0 bg-transparent p-0 text-white placeholder:text-white/35 focus-visible:ring-0"
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                              <Button
                                key={cat}
                                variant="ghost"
                                className={cn("rounded-full border border-white/10 bg-white/5 capitalize text-white/70 hover:bg-white/10 hover:text-white", filters.category === cat && "bg-white text-black hover:bg-white/90 hover:text-black")}
                                onClick={() => setFilters((f) => ({ ...f, category: cat }))}
                              >
                                {cat === "all" ? <LayoutGrid className="mr-2 h-4 w-4" /> : <span className="mr-2">{iconForCategory(cat as Category)}</span>}
                                {cat}
                              </Button>
                            ))}
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <select className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none" value={filters.color} onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value as Filters["color"] }))}>
                              <option value="all">All colors</option>
                              {colorTokens.map((color) => <option key={color} value={color}>{color}</option>)}
                            </select>
                            <select className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none" value={filters.style} onChange={(e) => setFilters((f) => ({ ...f, style: e.target.value as Filters["style"] }))}>
                              {occasions.map((style) => <option key={style} value={style}>{style === "all" ? "All occasions" : style}</option>)}
                            </select>
                            <select className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none" value={filters.size} onChange={(e) => setFilters((f) => ({ ...f, size: e.target.value as Filters["size"] }))}>
                              <option value="all">All sizes</option>
                              <option value="S">Small</option>
                              <option value="M">Medium</option>
                              <option value="L">Large</option>
                            </select>
                            <select className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none" value={filters.brand} onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value as Filters["brand"] }))}>
                              {brands.map((brand) => <option key={brand} value={brand}>{brand === "all" ? "All brands" : brand}</option>)}
                            </select>
                          </div>

                          <AnimatePresence>
                            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                              {filteredProducts.map((product) => (
                                <ProductCard
                                  key={product.id}
                                  product={product}
                                  onAdd={() => addProductToOverlay(product)}
                                  onFavorite={() => toggleWishlist(product.id)}
                                  isFavorite={wishlist.includes(product.id)}
                                  onDetails={() => {
                                    setDetailProduct(product);
                                    setShowDetails(true);
                                    setRecentlyViewed((prev) => [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 8));
                                  }}
                                />
                              ))}
                            </div>
                          </AnimatePresence>

                          {!filteredProducts.length && (
                            <div className="rounded-[28px] border border-dashed border-white/15 bg-white/5 p-10 text-center text-white/55">
                              No products match these filters. Try a broader occasion, color, or brand selection.
                            </div>
                          )}
                        </div>
                      </SidebarSection>

                      <div className="space-y-6">
                        <SidebarSection title="Fit Controls" description="Fine-tune placement, scale, sizing, and layering">
                          <div className="space-y-5">
                            <div>
                              <div className="mb-3 text-sm text-white/55">Default size</div>
                              <Tabs value={selectedSize} onValueChange={(value) => setSelectedSize(value as FitSize)}>
                                <TabsList className="grid grid-cols-3 rounded-2xl bg-white/5">
                                  <TabsTrigger value="S" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-black">S</TabsTrigger>
                                  <TabsTrigger value="M" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-black">M</TabsTrigger>
                                  <TabsTrigger value="L" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-black">L</TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => updateSelectedOverlay((o) => ({ ...o, x: o.x - 8 }))}><ChevronLeft className="mr-2 h-4 w-4" />Move left</Button>
                              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => updateSelectedOverlay((o) => ({ ...o, x: o.x + 8 }))}>Move right<ChevronRight className="ml-2 h-4 w-4" /></Button>
                              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => updateSelectedOverlay((o) => ({ ...o, y: o.y - 8 }))}><Plus className="mr-2 h-4 w-4" />Move up</Button>
                              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => updateSelectedOverlay((o) => ({ ...o, y: o.y + 8 }))}><Minus className="mr-2 h-4 w-4" />Move down</Button>
                            </div>

                            <div>
                              <div className="mb-3 flex items-center justify-between text-sm text-white/55"><span>Scale</span><span>{Math.round((selectedOverlay?.scale || 1) * 100)}%</span></div>
                              <Slider value={[Math.round((selectedOverlay?.scale || 1) * 100)]} min={70} max={130} step={1} onValueChange={([value]) => updateSelectedOverlay((o) => ({ ...o, scale: value / 100 }))} />
                            </div>
                            <div>
                              <div className="mb-3 flex items-center justify-between text-sm text-white/55"><span>Rotation</span><span>{selectedOverlay?.rotation || 0}°</span></div>
                              <Slider value={[selectedOverlay?.rotation || 0]} min={-20} max={20} step={1} onValueChange={([value]) => updateSelectedOverlay((o) => ({ ...o, rotation: value }))} />
                            </div>
                            <div>
                              <div className="mb-3 flex items-center justify-between text-sm text-white/55"><span>Opacity</span><span>{Math.round((selectedOverlay?.opacity || 1) * 100)}%</span></div>
                              <Slider value={[Math.round((selectedOverlay?.opacity || 1) * 100)]} min={35} max={100} step={1} onValueChange={([value]) => updateSelectedOverlay((o) => ({ ...o, opacity: value / 100 }))} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => updateSelectedOverlay((o) => ({ ...o, layer: o.layer + 1 }))}><Layers className="mr-2 h-4 w-4" />Bring forward</Button>
                              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => updateSelectedOverlay((o) => ({ ...o, layer: Math.max(1, o.layer - 1) }))}><Layers className="mr-2 h-4 w-4" />Send backward</Button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => updateSelectedOverlay((o) => ({ ...o, size: "S" }))}>Size S</Button>
                              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => updateSelectedOverlay((o) => ({ ...o, size: "M" }))}>Size M</Button>
                              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => updateSelectedOverlay((o) => ({ ...o, size: "L" }))}>Size L</Button>
                              <Button variant="destructive" className="rounded-2xl" onClick={removeSelectedOverlay}><X className="mr-2 h-4 w-4" />Remove</Button>
                            </div>
                          </div>
                        </SidebarSection>

                        <SidebarSection title="Look Summary" description="Presentation-ready metrics and outfit economics">
                          <div className="space-y-4">
                            <div className="rounded-[24px] border border-white/10 bg-black/25 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm text-white/55">Fit Match Score</div>
                                  <div className="mt-1 text-4xl font-semibold">{fitScore}</div>
                                </div>
                                <Sparkles className="h-8 w-8 text-[#d6c0ff]" />
                              </div>
                              <Progress value={fitScore} className="mt-4 h-2 bg-white/10" />
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                              <div className="text-sm text-white/55">Selected garments</div>
                              <div className="mt-3 space-y-2">
                                {overlays.length ? overlays.map((item) => {
                                  const product = productsById[item.productId];
                                  return (
                                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                                      <span>{product?.name}</span>
                                      <span className="text-white/55">{item.size}</span>
                                    </div>
                                  );
                                }) : <div className="text-sm text-white/45">No items added yet.</div>}
                              </div>
                              <Separator className="my-4 bg-white/10" />
                              <div className="flex items-center justify-between text-base font-medium">
                                <span>Total</span>
                                <span>{formatPrice(currentOutfitTotal)}</span>
                              </div>
                            </div>
                            <Input value={lookName} onChange={(e) => setLookName(e.target.value)} placeholder="Name this look" className="rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/35" />
                          </div>
                        </SidebarSection>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {styleAssistantOpen && (
                      <SidebarSection title="AI Style Assistant" description="Occasion-aware suggestions and pitch-friendly recommendations">
                        <div className="space-y-4">
                          <div className="rounded-[24px] border border-[#d4c0ff]/20 bg-[linear-gradient(135deg,rgba(120,84,255,0.18),rgba(255,255,255,0.04))] p-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-2xl border border-white/10 bg-white/10 p-2"><Wand2 className="h-5 w-5" /></div>
                              <div>
                                <div className="font-medium">Recommended for You</div>
                                <div className="text-sm text-white/65">{fitScore > 88 ? "Your current look is strong. Add one accessory to finish the silhouette." : "Add a structured layer and shoes for a more complete luxury presentation."}</div>
                              </div>
                            </div>
                          </div>
                          <div className="grid gap-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="text-sm text-white/55">Occasion match</div>
                              <div className="mt-2 font-medium">{overlays[0] ? productsById[overlays[0].productId]?.occasion : "Work"} Edit</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="text-sm text-white/55">Color harmony</div>
                              <div className="mt-2 font-medium">Neutral base with elevated contrast accents</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="text-sm text-white/55">Confidence cue</div>
                              <div className="mt-2 font-medium">High polish, retail-ready presentation</div>
                            </div>
                          </div>
                          <div>
                            <div className="mb-3 text-sm font-medium text-white">Complete the Look</div>
                            <div className="space-y-3">
                              {recommendedProducts.map((item) => (
                                <button key={item.id} onClick={() => addProductToOverlay(item)} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10">
                                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate font-medium">{item.name}</div>
                                    <div className="text-sm text-white/55">{item.brand}</div>
                                  </div>
                                  <div className="text-sm">{formatPrice(item.price)}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </SidebarSection>
                    )}

                    <SidebarSection title="Branding & Pitch Messaging" description="Customize the story for clients and retail partners">
                      <div className="space-y-4">
                        <Input value={logoText} onChange={(e) => setLogoText(e.target.value)} className="rounded-2xl border-white/10 bg-white/5 text-white" placeholder="Company logo text" />
                        <textarea value={brandMessage} onChange={(e) => setBrandMessage(e.target.value)} className="min-h-[120px] w-full rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-white/35" placeholder="Pitch message or client value proposition" />
                        <div className="rounded-[24px] border border-white/10 bg-black/25 p-5">
                          <div className="text-xs uppercase tracking-[0.22em] text-white/45">Preview</div>
                          <div className="mt-2 text-2xl font-semibold">{logoText}</div>
                          <div className="mt-3 text-white/70">{brandMessage}</div>
                        </div>
                      </div>
                    </SidebarSection>

                    <SidebarSection title="Compare Looks" description="Queue items and saved looks for side-by-side storytelling">
                      <div className="space-y-3">
                        <Button className="w-full rounded-2xl bg-white text-black hover:bg-white/90" onClick={() => setCompareQueue(overlays.map((o) => o.productId))} disabled={!overlays.length}>Compare Current Outfit</Button>
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                          <div className="text-sm text-white/55">Queued comparison</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {compareQueue.length ? compareQueue.map((id) => <Badge key={id} className="rounded-full bg-white/10 text-white">{productsById[id]?.name}</Badge>) : <div className="text-sm text-white/45">Nothing queued yet.</div>}
                          </div>
                        </div>
                      </div>
                    </SidebarSection>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentView === "saved" && (
          <motion.div key="saved" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="text-sm uppercase tracking-[0.28em] text-white/45">Saved Looks</div>
                <h2 className="mt-2 text-4xl font-semibold">Reopen curated outfits instantly.</h2>
              </div>
              {savedLooks.length ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {savedLooks.map((look) => (
                    <Card key={look.id} className="overflow-hidden rounded-[28px] border-white/10 bg-white/5 text-white backdrop-blur-2xl">
                      <div className="relative aspect-[0.85] overflow-hidden">
                        <img src={look.image || DEMO_MODELS[0].image} alt={look.name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                          <div>
                            <div className="text-2xl font-semibold">{look.name}</div>
                            <div className="text-sm text-white/60">{look.createdAt}</div>
                          </div>
                          <Badge className="bg-emerald-300/15 text-emerald-100">Fit {look.fitScore}</Badge>
                        </div>
                      </div>
                      <CardContent className="space-y-4 p-5">
                        <div className="flex flex-wrap gap-2">
                          {look.items.map((item) => <Badge key={item.id} className="rounded-full bg-white/10 text-white">{productsById[item.productId]?.name}</Badge>)}
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1 rounded-full bg-white text-black hover:bg-white/90" onClick={() => loadLook(look)}>Open Look</Button>
                          <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => setCompareQueue(look.items.map((i) => i.productId))}>Compare</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-[32px] border border-dashed border-white/15 bg-white/5 p-14 text-center text-white/55">
                  No saved looks yet. Build an outfit in the studio and save it for demo-ready storytelling.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentView === "wishlist" && (
          <motion.div key="wishlist" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="text-sm uppercase tracking-[0.28em] text-white/45">Wishlist</div>
                <h2 className="mt-2 text-4xl font-semibold">Favorites and high-intent products.</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.filter((p) => wishlist.includes(p.id)).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={() => addProductToOverlay(product)}
                    onFavorite={() => toggleWishlist(product.id)}
                    isFavorite={wishlist.includes(product.id)}
                    onDetails={() => { setDetailProduct(product); setShowDetails(true); }}
                  />
                ))}
              </div>
              {!wishlist.length && (
                <div className="rounded-[32px] border border-dashed border-white/15 bg-white/5 p-14 text-center text-white/55">
                  Your wishlist is empty. Tap the heart icon in the catalog to save premium favorites.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentView === "settings" && (
          <motion.div key="settings" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="text-sm uppercase tracking-[0.28em] text-white/45">Preferences</div>
                <h2 className="mt-2 text-4xl font-semibold">Experience settings and presenter controls.</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <SidebarSection title="Studio Preferences" description="Make the demo feel tailored to your audience">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div>
                        <div className="font-medium">Presenter mode</div>
                        <div className="text-sm text-white/55">Highlights sales-pitch metrics and storytelling panels</div>
                      </div>
                      <Switch checked={presenterMode} onCheckedChange={setPresenterMode} />
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div>
                        <div className="font-medium">Reduced motion</div>
                        <div className="text-sm text-white/55">Use gentler transitions for accessibility-sensitive demos</div>
                      </div>
                      <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
                      Camera access is {cameraEnabled ? "enabled" : "unavailable"} in this session.
                    </div>
                  </div>
                </SidebarSection>
                <SidebarSection title="Trust & Conversion Signals" description="Pitch-ready proof points for stakeholders">
                  <div className="space-y-4 text-white/70">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Fit scoring communicates confidence and reduces hesitation during checkout.</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Complete-the-look recommendations increase basket size with contextual upsell.</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Saved looks and wishlists encourage return sessions and clienteling opportunities.</div>
                  </div>
                </SidebarSection>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-white/45">Pitch Mode Dashboard</div>
                  <h2 className="mt-2 text-4xl font-semibold">Client-facing analytics and narrative support.</h2>
                </div>
                <Badge className="rounded-full bg-white/10 px-4 py-2 text-white">Presenter-ready</Badge>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {brandStats.map((stat) => (
                  <Card key={stat.label} className="rounded-[28px] border-white/10 bg-white/5 text-white backdrop-blur-2xl">
                    <CardContent className="p-6">
                      <div className="text-sm text-white/55">{stat.label}</div>
                      <div className="mt-3 text-5xl font-semibold">{stat.value}</div>
                      <div className="mt-4 text-sm text-white/55">Simulated performance metric for sales storytelling and investor demos.</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <SidebarSection title="Trending Looks" description="Use these to guide the live walkthrough">
                  <div className="grid gap-4 md:grid-cols-2">
                    {products.filter((p) => p.trending).map((product) => (
                      <div key={product.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
                        <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
                        <div className="p-4">
                          <div className="font-medium">{product.name}</div>
                          <div className="mt-1 text-sm text-white/55">{product.brand} • {product.occasion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SidebarSection>
                <SidebarSection title="Presenter Notes" description="Suggested narrative for client meetings">
                  <div className="space-y-4 text-white/70">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Lead with speed to first wow: launch demo model, add blazer, add dress, show Fit Match Score.</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Show filters, occasion recommendations, and wishlist to demonstrate merchandising intelligence.</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Close with saved looks, sharing, and exported summary to reinforce business value.</div>
                  </div>
                </SidebarSection>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDetailsModal
        product={detailProduct}
        open={showDetails}
        onOpenChange={setShowDetails}
        onAdd={() => {
          if (detailProduct) addProductToOverlay(detailProduct);
          setShowDetails(false);
        }}
      />

      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <div className="rounded-full border border-white/10 bg-black/30 p-2 shadow-2xl backdrop-blur-2xl">
          <Button className="rounded-full bg-white text-black hover:bg-white/90" onClick={() => setCurrentView("studio")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Open Studio
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;