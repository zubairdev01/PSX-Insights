export class DataProvider {
  async getCompanies(filters = {}) {
    throw new Error("Not implemented");
  }
  async getCompany(symbol) {
    throw new Error("Not implemented");
  }
  async getSectors() {
    throw new Error("Not implemented");
  }
  async getPriceHistory(symbol, timeframe) {
    throw new Error("Not implemented");
  }
  async getIndices() {
    throw new Error("Not implemented");
  }
  async refreshCompany(symbol) {
    throw new Error("Not implemented");
  }
}
