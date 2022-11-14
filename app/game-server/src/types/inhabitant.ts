import { Room } from 'room';

export default interface IInhabitant<> {
  location: Room;
  // the name that gets displayed to other inhabitants
  visibleName: () => string;
}
