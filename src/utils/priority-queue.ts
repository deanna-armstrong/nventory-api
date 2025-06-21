// src/utils/priority-queue.ts

/**
 * A generic min-heap-based priority queue.
 * 
 * Elements are ordered according to the provided compare function:
 *   compare(a, b) < 0 => a has higher priority than b
 *   compare(a, b) > 0 => b has higher priority than a
 * 
 * Internally stores items in an array-based binary heap.
 */
export class PriorityQueue<T> {
  /** Underlying array to hold heap elements */
  private heap: T[] = [];

  /**
   * @param compare Function to compare two elements; returns negative if a < b.
   */
  constructor(private compare: (a: T, b: T) => number) {}

  /**
   * Adds an item to the queue and restores heap invariant by sifting up.
   */
  enqueue(item: T): void {
    this.heap.push(item);
    this.heapifyUp();
  }

  /**
   * Removes and returns the item with highest priority (root of the heap).
   * Returns `undefined` if the queue is empty.
   */
  dequeue(): T | undefined {
    if (this.size() === 0) {
      return undefined;
    }
    if (this.size() === 1) {
      return this.heap.pop();
    }
    const top = this.heap[0];
    // Move last element to root and sift down
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return top;
  }

  /**
   * Peeks at the highest-priority item without removing it.
   */
  peek(): T | undefined {
    return this.heap[0];
  }

  /**
   * Returns the number of items currently in the queue.
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Returns the top `n` items sorted by priority without modifying the heap.
   * Useful for sampling or inspection.
   */
  peekTopItems(n: number): T[] {
    // Clone the heap, sort by priority, and take first n
    return [...this.heap].sort(this.compare).slice(0, n);
  }

  /**
   * Moves the last element up until the heap property is restored.
   */
  private heapifyUp(): void {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      // If current has higher priority than its parent, swap them
      if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
        [this.heap[index], this.heap[parentIndex]] =
          [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * Moves the root element down until the heap property is restored.
   */
  private heapifyDown(): void {
    let index = 0;
    const length = this.heap.length;

    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      // If left child has higher priority, mark it
      if (
        left < length &&
        this.compare(this.heap[left], this.heap[smallest]) < 0
      ) {
        smallest = left;
      }
      // If right child has higher priority, mark it
      if (
        right < length &&
        this.compare(this.heap[right], this.heap[smallest]) < 0
      ) {
        smallest = right;
      }
      // If no child is higher priority, heap is valid
      if (smallest === index) {
        break;
      }
      // Swap with the higher-priority child and continue
      [this.heap[index], this.heap[smallest]] =
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
