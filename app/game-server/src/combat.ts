import { StoryText } from './story-text';

enum CombatStat {
  None,
  Strength,
  Dexterity,
  Constitution,
  Intelligence,
  Wisdom,
  Armor,
  DodgeRating,
  ParryRating,
  BlockRating,
  HitRating,
  CritRating,
  MagicRating,
  SpellBlock
}

enum DamageType {
  Physical,
  Magic
}

enum CombatResult {
  Dodge,
  Parry,
  Block,
  Armor,
  Hit,
  Crit,
  SpellBlock
}

class StatModifier {
  stat: CombatStat = CombatStat.None;
  value = 0;
}

type AttackType = {
  damage_type: DamageType;
  can_block: boolean;
  can_parry: boolean;
  can_dodge: boolean;
  can_spell_block: boolean;
  armor_piercing: boolean;
};

function get_combat_result_text(r: CombatResult): string {
  switch (r) {
    case CombatResult.Armor:
      return 'armor';
    case CombatResult.Block:
      return 'block';
    case CombatResult.Dodge:
      return 'dodge';
    case CombatResult.Crit:
      return 'crit';
    case CombatResult.Hit:
      return 'hit';
    case CombatResult.Parry:
      return 'parry';
    case CombatResult.SpellBlock:
      return 'spellblock';
    default:
      return 'unknown';
  }
}
function get_effective_stat(
  base: number,
  stat: CombatStat,
  modifiers: StatModifier[]
): number {
  let r: number = base;
  modifiers.forEach((modifier: StatModifier) => {
    if (modifier.stat === stat) r = r + modifier.value;
  });
  return r;
}
interface IStats {
  _strength: number;
  _dexterity: number;
  _constitution: number;
  _intelligence: number;
  _wisdom: number;
  _armor: number;
  modifiers: StatModifier[];

  get strength(): number;
  set strength(value: number);

  get dexterity(): number;
  set dexterity(value: number);

  get constitution(): number;
  set constitution(value: number);

  get intelligence(): number;
  set intelligence(value: number);

  get wisdom(): number;
  set wisdom(value: number);

  get armor(): number;
  set armor(value: number);

  get dodge_rating(): number;
  get parry_rating(): number;
  get block_rating(): number;
  get hit_rating(): number;
  get crit_rating(): number;
  get magic_rating(): number;
  get spell_block(): number;
}

class FighterStats implements IStats {
  hp = 15;
  max_hp = 15;
  _strength = 15;
  _dexterity = 15;
  _constitution = 12;
  _intelligence = 8;
  _wisdom = 13;
  _armor = 10;
  modifiers = [];
  get strength(): number {
    return get_effective_stat(
      this._strength,
      CombatStat.Strength,
      this.modifiers
    );
  }
  get dexterity(): number {
    return get_effective_stat(
      this._dexterity,
      CombatStat.Dexterity,
      this.modifiers
    );
  }
  get constitution(): number {
    return get_effective_stat(
      this._constitution,
      CombatStat.Constitution,
      this.modifiers
    );
  }
  get intelligence(): number {
    return get_effective_stat(
      this._intelligence,
      CombatStat.Intelligence,
      this.modifiers
    );
  }
  get wisdom(): number {
    return get_effective_stat(this._wisdom, CombatStat.Wisdom, this.modifiers);
  }
  get armor(): number {
    return get_effective_stat(this._armor, CombatStat.Armor, this.modifiers);
  }
  get dodge_rating() {
    const base = this.dexterity * 0.5;
    return get_effective_stat(base, CombatStat.DodgeRating, this.modifiers);
  }
  get parry_rating() {
    const base = this.dexterity * 0.6 + this.strength * 0.4;
    return get_effective_stat(base, CombatStat.ParryRating, this.modifiers);
  }
  get hit_rating() {
    const base = this.dexterity;
    return get_effective_stat(base, CombatStat.HitRating, this.modifiers);
  }
  get crit_rating() {
    const base = this.dexterity * 0.1;
    return get_effective_stat(base, CombatStat.CritRating, this.modifiers);
  }
  get block_rating() {
    return get_effective_stat(0, CombatStat.BlockRating, this.modifiers);
  }
  get magic_rating() {
    return get_effective_stat(0, CombatStat.MagicRating, this.modifiers);
  }
  get spell_block() {
    return get_effective_stat(0, CombatStat.SpellBlock, this.modifiers);
  }
}

type CombatTableOutcome = {
  result: CombatResult;
  weight: number;
  upper_bound: number;
};

class CombatTable {
  combat_outcomes: CombatTableOutcome[] = [];
  weight_total = 0;
  add_outcome(outcome: CombatResult, weight: number): void {
    this.weight_total += weight;
    this.combat_outcomes.push({
      result: outcome,
      weight: weight,
      upper_bound: this.weight_total
    });
  }
  constructor(attack_type: AttackType, attacker: IStats, defender: IStats) {
    this.add_outcome(CombatResult.Crit, attacker.crit_rating);
    this.add_outcome(CombatResult.Hit, attacker.hit_rating);
    if (attack_type.can_block)
      this.add_outcome(CombatResult.Block, defender.block_rating);
    if (attack_type.can_parry)
      this.add_outcome(CombatResult.Parry, defender.parry_rating);
    if (attack_type.can_dodge)
      this.add_outcome(CombatResult.Dodge, defender.dodge_rating);
    if (attack_type.can_spell_block)
      this.add_outcome(CombatResult.SpellBlock, defender.spell_block);
    if (!attack_type.armor_piercing)
      this.add_outcome(CombatResult.Armor, defender.armor);
    // normalize upperbounds and weights to values between 0 and 1
    for (let i = 0; i < this.combat_outcomes.length; i++) {
      this.combat_outcomes[i].upper_bound /= this.weight_total;
      this.combat_outcomes[i].weight /= this.weight_total;
    }
  }
  get_random_outcome(): CombatResult {
    const roll = Math.random();

    for (let i = 0; i < this.combat_outcomes.length; i++) {
      if (roll <= this.combat_outcomes[i].upper_bound)
        return this.combat_outcomes[i].result;
    }
    return this.combat_outcomes[this.combat_outcomes.length].result;
  }
}
function get_combat_result(
  attack_type: AttackType,
  attacker: IStats,
  defender: IStats
): CombatResult {
  const combat_table: CombatTable = new CombatTable(
    attack_type,
    attacker,
    defender
  );

  // normalize hit table
  return combat_table.get_random_outcome();
}

const mob1 = new FighterStats();
const mob2 = new FighterStats();
const attack: AttackType = {
  damage_type: DamageType.Physical,
  can_block: true,
  can_dodge: true,
  can_parry: true,
  can_spell_block: true,
  armor_piercing: false
};

const result = get_combat_result(attack, mob1, mob2);
console.log(get_combat_result_text(result));
console.log(result);

type CombatTextMessage = {
  weight: number;
  result: CombatResult;
  story_text: StoryText;
  upper_bound?: number; //upper bound is not user-defined.  It is calculated by the combat table based on the weights.
};

type CombatTextClass = {
  combat_text_messages: CombatTextMessage[];
};

const generic_ctc: CombatTextClass = {
  combat_text_messages: [
    {
      weight: 1,
      result: CombatResult.Hit,
      story_text: {
        actor_message: 'You land a strike to %s% with your %a-obj%.',
        subject_message: '%a% lands a strike to you with %a-his% %a-obj%.',
        room_message: '%a% lands a strike to %s% with %a-his% %a-obj%.'
      }
    },
    {
      weight: 1,
      result: CombatResult.Hit,
      story_text: {
        actor_message: 'You strike %s% with your %a-obj%.',
        subject_message: '%a% strikes you with %a-his% %a-obj%.',
        room_message: '%a% strikes %s% with %a-his% %a-obj%.'
      }
    },
    {
      weight: 1,
      result: CombatResult.Dodge,
      story_text: {
        actor_message: '%s% steps aside, dodging your %a-obj%.',
        subject_message: 'You step aside, dodging %as% %a-obj%.',
        room_message: '%s% steps aside, dodging %as% %a-obj%.'
      }
    },
    {
      weight: 1,
      result: CombatResult.Parry,
      story_text: {
        actor_message: '%s% nimbly parries your %a-obj%.',
        subject_message: 'You nimbly parry %as% %a-obj%.',
        room_message: '%s% nimbly parries %as% %a-obj%.'
      }
    },
    {
      weight: 1,
      result: CombatResult.Block,
      story_text: {
        actor_message:
          'You strike at %s%, who blocks you with %s-his% %s-obj%.',
        subject_message: '%a% strikes at you, but you block with your %s-obj%.',
        room_message: '%a% strikes at %s%, but is blocked by %ss% %s-obj%.'
      }
    },
    {
      weight: 1,
      result: CombatResult.Armor,
      story_text: {
        actor_message: 'You land a strike to %s% with your %a-obj%.',
        subject_message: '%a% lands a strike to you with %a-his% %a-obj%.',
        room_message: '%a% lands a strike to %s% with %a-his% %a-obj%.'
      }
    },
    {
      weight: 1,
      result: CombatResult.Crit,
      story_text: {
        actor_message: 'You land a menacing strike on %s% with your %a-obj%.',
        subject_message:
          '%a% lands a menacing strike on you with %a-his% %a-obj%.',
        room_message: '%a% lands a menacing strike on %s% with %a-his% %a-obj%.'
      }
    },
    {
      weight: 1,
      result: CombatResult.Crit,
      story_text: {
        actor_message:
          '%s% reels in pain as your %a-obj% lands soundly into %s-his% body.',
        subject_message:
          'You reel in pain as %as% %a-obj% lands soundly into you body.',
        room_message:
          '%s% reels in pain as %as% %a-obj% lands soundly into %s-his% body.'
      }
    },
    {
      weight: 1,
      result: CombatResult.SpellBlock,
      story_text: {
        actor_message: '%s% spellblocks your attack.',
        subject_message: 'You spellblock %as% attack.',
        room_message: '%s% spellblocks %as% attack.'
      }
    }
  ]
};
