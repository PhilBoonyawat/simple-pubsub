import { IPublishSubscribeService } from "./IPublishSubscribeService";
import { ISubscriber } from "../../subscribers/ISubsriber";
import { IEvent } from "../../events/IEvent";

export class PublishSubscribeService implements IPublishSubscribeService {
  // map between event type and set of subscribers
  private subscribersMap: Map<string, Set<ISubscriber>> = new Map();
  private eventsQueue: IEvent[] = [];
  private isProcessing: boolean = false;

  processEvents() : void {
    this.isProcessing = true;

    while (this.eventsQueue.length > 0) {
      const targetEvent = this.eventsQueue.shift()!;
      const eventType = targetEvent.type();
      
      if (this.subscribersMap.has(eventType)) {
        const subscribers = this.subscribersMap.get(eventType)!;
        subscribers.forEach(subscriber => {
          console.log(targetEvent.type() + ' event handled by subscriber.');
          subscriber.handle(targetEvent)
        });
      }
    }

    this.isProcessing = false;
  }

  publish(event: IEvent): void {
    this.eventsQueue.push(event);

    if (!this.isProcessing) {
      this.processEvents();
    }
  };

  subscribe(type: string, handler: ISubscriber): void {
    if (!this.subscribersMap.has(type)) {
      this.subscribersMap.set(type, new Set());
    }
    this.subscribersMap.get(type)!.add(handler);
  };

  unsubscribe(type: string, handler: ISubscriber): void {
    if (this.subscribersMap.has(type)) {
      this.subscribersMap.get(type)!.delete(handler);
    }
  };
}