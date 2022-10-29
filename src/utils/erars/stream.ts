class Stream<T> {
  streamBuffer: T[] = [];

  sleepPromise?: Promise<void>;
  wakeup?: () => void;

  get lock() {
    if (!this.sleepPromise) {
      this.sleepPromise = new Promise<void>((resolve) => {
        this.wakeup = resolve;
      }).then(() => {
        this.sleepPromise = undefined;
      });
    }

    return this.sleepPromise;
  }

  async read() {
    while (true) {
      if (this.streamBuffer.length > 0) {
        return this.streamBuffer.shift()!;
      } else {
        await this.lock;
      }
    }
  }

  write(data: T) {
    this.streamBuffer.push(data);
    this.wakeup?.();
  }
}

export default Stream;
