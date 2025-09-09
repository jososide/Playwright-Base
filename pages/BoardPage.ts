import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BoardPage extends BasePage {
  /**
   * Find a card by its title anywhere on the board.
   * We match the visible heading element (h3 usually) and climb to the nearest card container.
   */
  cardByTitle(cardTitle: string): Locator {
    const titleRe = new RegExp(`^\\s*${escapeRegex(cardTitle)}\\s*$`, 'i');

    // Prefer accessible heading (matches your <h3> from screenshots)
    const heading = this.page.getByRole('heading', { name: titleRe }).first()
      .or(this.page.locator('h3,h4').filter({ hasText: titleRe }).first());

    // Climb to the card container (white rounded box / typical classes)
    return heading.locator(
      'xpath=ancestor::div[contains(@class,"bg-white") or contains(@class,"rounded") or contains(@class,"shadow")][1]'
    );
  }

  /**
   * Assert the card is in the expected column by reading the nearest column <h2>.
   * Columns render like "To Do (2)" etc., so we match a prefix.
   */
  async expectCardInColumn(card: Locator, expectedColumn: string) {
    const colHeading = card.locator(
      'xpath=ancestor::div[contains(@class,"flex") and contains(@class,"flex-col")][.//h2][1]//h2[1]'
    );
    await expect(colHeading).toBeVisible();
    await expect(colHeading).toHaveText(new RegExp(`^\\s*${escapeRegex(expectedColumn)}\\b`, 'i'));
  }

  /**
   * Validate tag chips by text inside the same card.
   */
  async expectCardTags(card: Locator, expectedTags: string[]) {
    for (const tag of expectedTags) {
      await expect(
        card.locator('span, .tag, [data-testid*="tag"]').filter({
          hasText: new RegExp(`\\b${escapeRegex(tag)}\\b`, 'i')
        })
      ).toBeVisible();
    }
  }
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
