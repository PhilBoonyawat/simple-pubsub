export class Machine {
  private stockLevel : number;
  public readonly id: string;
  static readonly LOW_STOCK_THRESHOLD : number = 3;
  private isStockLow : boolean = false;

  constructor (id: string, stockLevel: number) {
    this.id = id;
    this.stockLevel = stockLevel;;
  }

  public refillStock(amount: number) : { passedLowThreshold : boolean } {
    if (amount <= 0) {
      throw new Error('Invalid amount to refill');
    } 

    const wasLow = this.isStockLow;
    this.stockLevel += amount;
    this.isStockLow = this.checkIsStockLow();
    return { passedLowThreshold : wasLow && !this.isStockLow };
  }

  public sellStock(amount: number) : { crossedLowThreshold : boolean } {
    if (amount <= 0) {
      throw new Error("Invalid sell amount");
    }
    if (amount > this.stockLevel) {
      throw new Error("Insufficient stock");
    }

    const wasLow = this.isStockLow;
    this.stockLevel -= amount;
    this.isStockLow = this.checkIsStockLow();
    return { crossedLowThreshold : !wasLow && this.isStockLow }
  }

  public getStockLevel() : number {
    return this.stockLevel;
  }

  public checkIsStockLow() : boolean {
    return this.stockLevel < Machine.LOW_STOCK_THRESHOLD;
  }
}