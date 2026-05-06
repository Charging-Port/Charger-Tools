/**
 * Editable site text. Loaded from `content/site-text.json` and rendered on
 * public pages. Edited from the admin panel at /admin/content.
 *
 * Adding a field:
 *   1. Add it here with a descriptive label
 *   2. Add a default in `content/site-text.json`
 *   3. Read it from the page that needs it via `getSiteText()`
 *   4. Add an editor row in `app/admin/content/_client.tsx`
 */

export interface Skill {
  name: string;
  description: string;
  whereLearned: string;
}

export interface SkillGroup {
  category: string;
  items: Skill[];
}

export interface NowItem {
  title: string;
  body: string;
  href?: string;
}

export interface NowSection {
  label: string;
  items: NowItem[];
}

export interface CurrentlyItem {
  label: string;
  text: string;
  href?: string;
}

export interface SiteText {
  hero: {
    headline: string;
    intro1: string;
    intro2: string;
    currently: CurrentlyItem[];
  };
  about: {
    quote: string;
    bio: string[];
    quickFacts: { k: string; v: string }[];
    pullQuote: string;
    skills: SkillGroup[];
    cta: string;
  };
  now: {
    updatedLabel: string;
    intro: string;
    sections: NowSection[];
  };
  contact: {
    intro: string;
    openTo: string[];
  };
  homepage: {
    closerHeadline: string;
    closerBody: string;
    newsletterBody: string;
  };
  footer: {
    tagline: string;
  };
}

export const SITE_TEXT_FIELD_LIMITS = {
  shortField: 200,
  paragraph: 2000,
  list: 50,
} as const;
