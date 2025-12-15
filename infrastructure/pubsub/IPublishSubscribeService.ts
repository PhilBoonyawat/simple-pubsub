import { IEvent } from "../../events/IEvent";
import { ISubscriber } from "../../subscribers/ISubsriber";

export interface IPublishSubscribeService {
  publish (event: IEvent): void;
  subscribe (type: string, handler: ISubscriber): void;
  unsubscribe (type: string, handler: ISubscriber): void;
}