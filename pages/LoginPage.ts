import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly username = this.page.locator('#username');
  readonly password = this.page.locator('#password');
  readonly submit   = this.page.locator('button[type="submit"]');

  async open() {
    await this.goto('/');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);

    await Promise.all([
      // Let router finish navigation after submit
      this.page.waitForLoadState('networkidle'),
      this.submit.click(),
    ]);

    // Post-login sanity: either we see a sidebar or a main heading.
    const sidebar = this.page.locator('nav, aside').first();
    const heading = this.page.getByRole('heading', { level: 1 });

    await Promise.race([
      sidebar.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      heading.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
    ]);

    await expect(this.page).not.toHaveURL(/login|signin/i);
  }
}
