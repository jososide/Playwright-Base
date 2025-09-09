import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SidebarPage } from '../pages/SidebarPage';
import { BoardPage } from '../pages/BoardPage';
import scenarios from '../data/kanban.json';

const DEMO_EMAIL = 'admin';
const DEMO_PASSWORD = 'password123';

test.describe('Kanban validations (POM + data-driven)', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(DEMO_EMAIL, DEMO_PASSWORD);
  });

  for (const s of scenarios) {
    test(`${s.section} → "${s.title}" is in "${s.column}" with tags [${s.tags.join(', ')}]`, async ({ page }) => {
      const sidebar = new SidebarPage(page);
      const board   = new BoardPage(page);

      await test.step('Open section', async () => {
        await sidebar.openSection(s.section);
      });

      const card = await test.step('Find card by title', async () => {
        const c = board.cardByTitle(s.title);
        await c.scrollIntoViewIfNeeded().catch(() => {});
        await expect(c).toBeVisible();
        return c;
      });

      await test.step('Verify column', async () => {
        await board.expectCardInColumn(card, s.column);
      });

      await test.step('Verify tags', async () => {
        await board.expectCardTags(card, s.tags);
      });
    });
  }
});
