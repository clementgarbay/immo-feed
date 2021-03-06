import * as puppeteer from 'puppeteer'

export default class Puppeteer {
    page: puppeteer.Page
    browser: puppeteer.Browser

    public async launch(): Promise<puppeteer.Browser> {
        return puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        })
    }

    public async setup(url: string): Promise<puppeteer.Response> {
        this.browser = await this.launch()
        this.page = await this.browser.newPage()
        this.page.setViewport({ width: 1280, height: 1000 })
        return this.page.goto(url)
    }

     public async scrapePage(goNext: boolean, nextSelector: string, waitForSelector: string) {
        await this.scrollDown()
        const nextLink = this.getElement(nextSelector)

        if (goNext && nextLink) {
            await this.click(nextSelector)
            await this.waitForSelector(waitForSelector)
        }

        await this.scrollDown()
        return this.getPageContent()
    }

    public async scrollDown() {
        await this.page.evaluate(() => { window.scrollBy(0, window.innerHeight) })
    }

    public async getPageContent() {
        return this.page.content()
    }

    public async shutdown() {
        return this.browser.close()
    }

    public async getElement(selector: string) {
        return this.page.$(selector)
    }

    public async click(selector: string) {
        return this.page.click(selector)
    }

    public async waitForSelector(selector: string) {
        return this.page.waitForSelector(selector)
    }

    public async url() {
        return this.page.url()
    }
}
