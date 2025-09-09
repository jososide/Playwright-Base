import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SidebarPage extends BasePage {
  private sidebar(): Locator {
    return this.page.locator('nav, aside, [data-testid*="sidebar"]').first();
  }

  private sectionHeading(name: string): Locator {
    const re = new RegExp(`^\\s*${escapeRegex(name)}\\s*$`, 'i');
    return this.page
      .getByRole('heading', { name: re }).first()
      .or(this.page.locator('h1,h2').filter({ hasText: re }).first());
  }

  async openSection(name: string) {
    const rail = this.sidebar();
    await rail.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const item = rail
      .getByRole('link', { name, exact: true })
      .or(rail.getByRole('button', { name, exact: true }))
      .or(rail.locator('a', { hasText: name }))
      .or(rail.getByText(name, { exact: true }))
      .first();
    await item.scrollIntoViewIfNeeded().catch(() => {});
    await item.click();

    const h = this.sectionHeading(name);
    await h.scrollIntoViewIfNeeded().catch(() => {});
    await expect(h).toBeVisible({ timeout: 8000 });
  }
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
