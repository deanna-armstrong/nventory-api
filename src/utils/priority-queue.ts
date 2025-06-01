// src/utils/priority-queue.ts

export class PriorityQueue<T> {
  private heap: T[] = [];

  constructor(private compare: (a: T, b: T) => number) {}

  enqueue(item: T): void {
    this.heap.push(item);
    this.heapifyUp();
  }

  dequeue(): T | undefined {
    if (this.size() <= 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return top;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  peekTopItems(n: number): T[] {
    return [...this.heap].sort(this.compare).slice(0, n);
  }

  private heapifyUp(): void {
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.heap[i], this.heap[parent]) < 0) {
        [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
        i = parent;
      } else break;
    }
  }

  private heapifyDown(): void {
    let i = 0;
    const length = this.heap.length;

    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let smallest = i;

      if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest !== i) {
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      } else break;
    }
  }
}
