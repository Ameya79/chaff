export type RuleCategory =
  | 'ui'
  | 'copy'
  | 'code'
  | 'perf'
  | 'mobile'
  | 'a11y'
  | 'motion'
  | 'three';

export type RuleSeverity = 'high' | 'medium' | 'low';
export type RuleDetect = 'static' | 'rendered' | 'heuristic' | 'manual';
export type RuleLevel = 1 | 2 | 3;

export interface RuleFrontmatter {
  id: string;
  title: string;
  severity: RuleSeverity;
  levels: RuleLevel[];
  detect: RuleDetect;
  fix_class: string;
  bad: string;
  good: string;
  why: string;
  exceptions: string;
}

export interface Rule extends RuleFrontmatter {
  filePath: string;
  category: RuleCategory;
  rawContent: string;
  contextProblem: string;
  detectionLogic: string;
  remediationSteps: string;
  verification: string;
}

export type FindingStatus = 'open' | 'fixed' | 'waived';

export interface Finding {
  id: string;
  ruleId: string;
  category: RuleCategory;
  severity: RuleSeverity;
  message: string;
  file: string;
  line: number;
  column?: number;
  evidence: string;
  fixClass: string;
  status: FindingStatus;
  waiverReason?: string;
}

export interface IdentityToken {
  name: string;
  value: string | number | Record<string, any>;
  confidence: number;
  locked: boolean;
  source: string;
}

export interface WaiverEntry {
  ruleId: string;
  token?: string;
  reason: string;
  approvedBy?: string;
}

export interface IdentityLock {
  $schema?: string;
  version: string;
  generatedAt: string;
  framework: string;
  router:
    | 'app'
    | 'pages'
    | 'vite'
    | 'astro'
    | 'remix'
    | 'solid-start'
    | 'sveltekit'
    | 'angular'
    | 'nuxt'
    | 'vue'
    | 'qwik'
    | 'unknown';
  styling: string;
  fonts: string[];
  colors: Record<string, string>;
  spacingRhythm: string[];
  tokens: IdentityToken[];
  locked: string[];
  waivers: WaiverEntry[];
  copyVoiceSample?: string;
}

export interface ChaffConfig {
  version: string;
  level: RuleLevel;
  agents: string[];
  rulesDir?: string;
  ignore?: string[];
  thresholds?: {
    visual?: number;
    copy?: number;
    code?: number;
    performance?: number;
  };
}

export interface CategoryScore {
  score: number;
  openCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export interface ReportSummary {
  totalScore: number;
  scores: {
    visual: number;
    copy: number;
    code: number;
    performance: number;
  };
  findingsCount: {
    open: number;
    waived: number;
    fixed: number;
    total: number;
  };
  levelUsed: RuleLevel;
}

export interface BudgetStatus {
  metric: string;
  budget: number | string;
  measured: number | string;
  status: 'pass' | 'fail';
}

export interface ChaffReport {
  schemaVersion: string;
  timestamp: string;
  projectRoot: string;
  summary: ReportSummary;
  findings: Finding[];
  identitySummary: {
    framework: string;
    lockedCount: number;
    waiversCount: number;
  };
  budgets?: Record<string, BudgetStatus>;
}
