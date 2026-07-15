"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  Briefcase,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Crown,
  Crosshair,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  Gamepad2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Lightbulb,
  LineChart,
  Megaphone,
  MessageCircle,
  Package,
  Sparkles,
  Star,
  Sword,
  Swords,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// Tier badge styles driven by the global nav-theme tokens (no hardcoded colors)
function tierClasses(tier: string): string {
  switch (tier) {
    case "S":
      return "bg-[hsl(var(--nav-theme)/0.25)] border-[hsl(var(--nav-theme)/0.6)] text-[hsl(var(--nav-theme-light))]";
    case "A":
      return "bg-[hsl(var(--nav-theme)/0.18)] border-[hsl(var(--nav-theme)/0.45)] text-[hsl(var(--nav-theme-light))]";
    case "B":
      return "bg-[hsl(var(--nav-theme)/0.12)] border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]";
    default:
      return "bg-white/5 border-border text-muted-foreground";
  }
}

// Priority badge styles driven by the global nav-theme tokens
function priorityClasses(priority: string): string {
  switch (priority) {
    case "Critical":
      return "bg-[hsl(var(--nav-theme)/0.25)] border-[hsl(var(--nav-theme)/0.6)] text-[hsl(var(--nav-theme-light))]";
    case "High":
      return "bg-[hsl(var(--nav-theme)/0.18)] border-[hsl(var(--nav-theme)/0.45)] text-[hsl(var(--nav-theme-light))]";
    case "Medium":
      return "bg-[hsl(var(--nav-theme)/0.12)] border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]";
    default:
      return "bg-white/5 border-border text-muted-foreground";
  }
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.esportsmanager2026.online";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Esports Manager 2026 Wiki",
        description:
          "Complete Esports Manager 2026 Wiki covering players, teams, scouting, transfers, training, tactics, finances, tournaments, and updates for the esports management sim on Steam.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Esports Manager 2026 - Esports Management Simulation",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Esports Manager 2026 Wiki",
        alternateName: "Esports Manager 2026",
        url: siteUrl,
        description:
          "Complete Esports Manager 2026 Wiki resource hub for players, teams, scouting, transfers, training, tactics, finances, and tournament guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Esports Manager 2026 Wiki - Esports Management Simulation",
        },
        sameAs: [
          "https://store.steampowered.com/app/2749950/Esports_Manager_2026/",
          "https://discord.gg/esportsmanager",
          "https://www.reddit.com/r/esportmanager/",
          "https://x.com/esportsmanager",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Esports Manager 2026",
        gamePlatform: ["PC", "Steam"],
        applicationCategory: "Game",
        genre: ["Simulation", "Strategy", "Sports", "Management"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/2749950/Esports_Manager_2026/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Esports Manager 2026 | Launch Trailer",
        description:
          "Official Esports Manager 2026 launch trailer showcasing scouting, transfers, training, tactics, and tournament management.",
        uploadDate: "2026-07-06",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/gxlDTRtBvOk",
        url: "https://www.youtube.com/watch?v=gxlDTRtBvOk",
      },
    ],
  };

  // Accordion states
  const [tacticsExpanded, setTacticsExpanded] = useState<number | null>(0);
  const [updatesExpanded, setUpdatesExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Module decoration icons (fixed order, all distinct)
  const roleIcons = [Crown, Crosshair, Swords, Handshake, Eye, Sword];
  const trainingIcons = [
    TrendingUp,
    HeartHandshake,
    Brain,
    MessageCircle,
    CalendarClock,
    GraduationCap,
    LineChart,
    Briefcase,
    Megaphone,
  ];

  // Tools Grid anchors must map 1:1 to the 8 module sections below
  const sectionIds = [
    "beginner-guide",
    "players-roles-tier-list",
    "scouting-transfers-contracts",
    "tactics-match-simulation",
    "training-morale-staff-guide",
    "sponsors-finance-organization-growth",
    "download-demo-system-requirements",
    "updates-patch-notes",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <a
                href="https://store.steampowered.com/app/4006000/Esports_Manager_2026_Demo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://store.steampowered.com/app/2749950/Esports_Manager_2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="gxlDTRtBvOk"
              title="Esports Manager 2026 | Launch Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["beginnerGuide"]}
                locale={locale}
              >
                {t.modules.beginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.beginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Lightbulb className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.beginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 2: Players and Roles Tier List */}
      <section
        id="players-roles-tier-list"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["playersTierList"]}
                locale={locale}
              >
                {t.modules.playersTierList.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.playersTierList.intro}
            </p>
          </div>

          {/* Tier grid */}
          <div className="scroll-reveal grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
            {t.modules.playersTierList.tiers.map((tier: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                  <span
                    className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg border text-lg md:text-2xl font-bold ${tierClasses(
                      tier.tier,
                    )}`}
                  >
                    {tier.tier}
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-foreground">
                    {tier.label}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-2">
                  {tier.meaning}
                </p>
                <p className="text-xs md:text-sm text-foreground/80">
                  {tier.bestUse}
                </p>
              </div>
            ))}
          </div>

          {/* Role cards */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.playersTierList.roles.map((role: any, index: number) => {
              const RoleIcon = roleIcons[index] || Users;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                      <RoleIcon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </span>
                    <div>
                      <h3 className="font-bold">{role.role}</h3>
                      <p className="text-xs text-muted-foreground">
                        {role.fullName}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    <span className="text-[hsl(var(--nav-theme-light))] font-semibold">
                      Key attributes:
                    </span>{" "}
                    {role.attributes}
                  </p>
                  <p className="text-sm text-foreground/80">{role.function}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 3: Scouting, Transfers and Contracts */}
      <section
        id="scouting-transfers-contracts"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["scoutingTransfers"]}
                locale={locale}
              >
                {t.modules.scoutingTransfers.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.scoutingTransfers.intro}
            </p>
          </div>

          {/* Comparison table */}
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-foreground">
                  <th className="p-3 md:p-4 font-semibold">Route</th>
                  <th className="p-3 md:p-4 font-semibold">Upfront Cost</th>
                  <th className="p-3 md:p-4 font-semibold">Commitment</th>
                  <th className="p-3 md:p-4 font-semibold">Best Use</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.scoutingTransfers.routes.map(
                  (route: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t border-border align-top hover:bg-white/5 transition-colors"
                    >
                      <td className="p-3 md:p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                        {route.route}
                      </td>
                      <td className="p-3 md:p-4 text-muted-foreground">
                        {route.upfront}
                      </td>
                      <td className="p-3 md:p-4 text-muted-foreground">
                        {route.commitment}
                      </td>
                      <td className="p-3 md:p-4 text-foreground/80">
                        {route.bestUse}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <div className="scroll-reveal mt-6 p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                {t.modules.scoutingTransfers.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 4: Tactics and Match Simulation */}
      <section
        id="tactics-match-simulation"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Gamepad2 className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["tacticsSimulation"]}
                  locale={locale}
                >
                  {t.modules.tacticsSimulation.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.tacticsSimulation.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2">
            {t.modules.tacticsSimulation.entries.map(
              (entry: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() =>
                      setTacticsExpanded(tacticsExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-sm md:text-base">
                      {entry.heading}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform ${tacticsExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {tacticsExpanded === index && (
                    <div className="px-4 md:px-5 pb-5">
                      <p className="text-sm text-muted-foreground mb-3">
                        {entry.content}
                      </p>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                        <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                        <p className="text-xs md:text-sm text-foreground/90">
                          <span className="font-semibold">Template:</span>{" "}
                          {entry.template}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Training, Morale and Staff */}
      <section
        id="training-morale-staff-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["trainingStaff"]}
                  locale={locale}
                >
                  {t.modules.trainingStaff.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.trainingStaff.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.trainingStaff.cards.map((card: any, index: number) => {
              const CardIcon = trainingIcons[index] || TrendingUp;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                      <CardIcon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {card.category}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {card.description}
                  </p>
                  <p className="text-xs text-foreground/80 mt-auto pt-3 border-t border-border">
                    <span className="text-[hsl(var(--nav-theme-light))] font-semibold">
                      Manager action:
                    </span>{" "}
                    {card.action}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 5: 阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 6: Sponsors, Finance and Organization Growth */}
      <section
        id="sponsors-finance-organization-growth"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Package className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["sponsorsFinance"]}
                  locale={locale}
                >
                  {t.modules.sponsorsFinance.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.sponsorsFinance.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.sponsorsFinance.stages.map((stage: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                  <h3 className="font-bold text-base md:text-lg">
                    {stage.stage}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${priorityClasses(
                      stage.priority,
                    )}`}
                  >
                    {stage.priority}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
                    {stage.focus}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {stage.actions}
                </p>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/80">
                      Risk to avoid:
                    </span>{" "}
                    {stage.risk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Download, Demo and System Requirements */}
      <section
        id="download-demo-system-requirements"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Download className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["downloadDemo"]}
                  locale={locale}
                >
                  {t.modules.downloadDemo.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.downloadDemo.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {t.modules.downloadDemo.specs.map((spec: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Cpu className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {spec.label}
                  </p>
                </div>
                <p className="font-semibold text-[hsl(var(--nav-theme-light))] mb-1.5">
                  {spec.value}
                </p>
                <p className="text-xs text-muted-foreground">{spec.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Updates and Patch Notes */}
      <section
        id="updates-patch-notes"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Clock className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["updatesPatchNotes"]}
                  locale={locale}
                >
                  {t.modules.updatesPatchNotes.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.updatesPatchNotes.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.updatesPatchNotes.entries.map(
              (entry: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="bg-white/5 border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        setUpdatesExpanded(updatesExpanded === index ? null : index)
                      }
                      className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                            {entry.version}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {entry.date}
                          </span>
                        </div>
                        <span className="font-semibold text-sm md:text-base">
                          {entry.summary}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform ${updatesExpanded === index ? "rotate-180" : ""}`}
                      />
                    </button>
                    {updatesExpanded === index && (
                      <div className="px-4 md:px-5 pb-5">
                        <ul className="space-y-2 mb-4">
                          {entry.changes.map((change: string, ci: number) => (
                            <li
                              key={ci}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                          <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                          <p className="text-xs md:text-sm text-foreground/90">
                            <span className="font-semibold">Save impact:</span>{" "}
                            {entry.impact}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner before footer */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/esportsmanager"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/esportsmanager"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/2749950"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/2749950/Esports_Manager_2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
