import { IStats, DefaultStats } from '../combat';
import IInhabitant from './inhabitant';

class Mob implements IInhabitant {
  stats: IStats = new DefaultStats();
  location: Room;
  name: string;
  
  visibleName(): string {{
    return this.name;
  }
}
