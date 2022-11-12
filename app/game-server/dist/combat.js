"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CombatStat;
(function (CombatStat) {
    CombatStat[CombatStat["None"] = 0] = "None";
    CombatStat[CombatStat["Strength"] = 1] = "Strength";
    CombatStat[CombatStat["Dexterity"] = 2] = "Dexterity";
    CombatStat[CombatStat["Constitution"] = 3] = "Constitution";
    CombatStat[CombatStat["Intelligence"] = 4] = "Intelligence";
    CombatStat[CombatStat["Wisdom"] = 5] = "Wisdom";
    CombatStat[CombatStat["Armor"] = 6] = "Armor";
    CombatStat[CombatStat["DodgeRating"] = 7] = "DodgeRating";
    CombatStat[CombatStat["ParryRating"] = 8] = "ParryRating";
    CombatStat[CombatStat["BlockRating"] = 9] = "BlockRating";
    CombatStat[CombatStat["HitRating"] = 10] = "HitRating";
    CombatStat[CombatStat["CritRating"] = 11] = "CritRating";
    CombatStat[CombatStat["MagicRating"] = 12] = "MagicRating";
    CombatStat[CombatStat["SpellBlock"] = 13] = "SpellBlock";
})(CombatStat || (CombatStat = {}));
var DamageType;
(function (DamageType) {
    DamageType[DamageType["Physical"] = 0] = "Physical";
    DamageType[DamageType["Magic"] = 1] = "Magic";
})(DamageType || (DamageType = {}));
var CombatResult;
(function (CombatResult) {
    CombatResult[CombatResult["Dodge"] = 0] = "Dodge";
    CombatResult[CombatResult["Parry"] = 1] = "Parry";
    CombatResult[CombatResult["Block"] = 2] = "Block";
    CombatResult[CombatResult["Armor"] = 3] = "Armor";
    CombatResult[CombatResult["Hit"] = 4] = "Hit";
    CombatResult[CombatResult["Crit"] = 5] = "Crit";
    CombatResult[CombatResult["SpellBlock"] = 6] = "SpellBlock";
})(CombatResult || (CombatResult = {}));
class StatModifier {
    stat = CombatStat.None;
    value = 0;
}
function get_combat_result_text(r) {
    switch (r) {
        case CombatResult.Armor:
            return "armor";
        case CombatResult.Block:
            return "block";
        case CombatResult.Dodge:
            return "dodge";
        case CombatResult.Crit:
            return "crit";
        case CombatResult.Hit:
            return "hit";
        case CombatResult.Parry:
            return "parry";
        case CombatResult.SpellBlock:
            return "spellblock";
        default:
            return "unknown";
    }
}
function get_effective_stat(base, stat, modifiers) {
    let r = base;
    modifiers.forEach((modifier) => {
        if (modifier.stat === stat)
            r = r + modifier.value;
    });
    return r;
}
class FighterStats {
    hp = 15;
    max_hp = 15;
    _strength = 15;
    _dexterity = 15;
    _constitution = 12;
    _intelligence = 8;
    _wisdom = 13;
    _armor = 10;
    modifiers = [];
    get strength() {
        return get_effective_stat(this._strength, CombatStat.Strength, this.modifiers);
    }
    get dexterity() {
        return get_effective_stat(this._dexterity, CombatStat.Dexterity, this.modifiers);
    }
    get constitution() {
        return get_effective_stat(this._constitution, CombatStat.Constitution, this.modifiers);
    }
    get intelligence() {
        return get_effective_stat(this._intelligence, CombatStat.Intelligence, this.modifiers);
    }
    get wisdom() {
        return get_effective_stat(this._wisdom, CombatStat.Wisdom, this.modifiers);
    }
    get armor() {
        return get_effective_stat(this._armor, CombatStat.Armor, this.modifiers);
    }
    get dodge_rating() {
        let base = this.dexterity * 0.5;
        return get_effective_stat(base, CombatStat.DodgeRating, this.modifiers);
    }
    get parry_rating() {
        let base = this.dexterity * 0.6 + this.strength * 0.4;
        return get_effective_stat(base, CombatStat.ParryRating, this.modifiers);
    }
    get hit_rating() {
        let base = this.dexterity;
        return get_effective_stat(base, CombatStat.HitRating, this.modifiers);
    }
    get crit_rating() {
        let base = this.dexterity * 0.1;
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
class CombatTable {
    combat_outcomes = [];
    weight_total = 0;
    add_outcome(outcome, weight) {
        this.weight_total += weight;
        this.combat_outcomes.push({
            result: outcome,
            weight: weight,
            upper_bound: this.weight_total,
        });
    }
    constructor(attack_type, attacker, defender) {
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
    get_random_outcome() {
        let roll = Math.random();
        for (let i = 0; i < this.combat_outcomes.length; i++) {
            if (roll <= this.combat_outcomes[i].upper_bound)
                return this.combat_outcomes[i].result;
        }
        return this.combat_outcomes[this.combat_outcomes.length].result;
    }
}
function get_combat_result(attack_type, attacker, defender) {
    const combat_table = new CombatTable(attack_type, attacker, defender);
    // normalize hit table
    return combat_table.get_random_outcome();
}
let mob1 = new FighterStats();
let mob2 = new FighterStats();
let attack = {
    damage_type: DamageType.Physical,
    can_block: true,
    can_dodge: true,
    can_parry: true,
    can_spell_block: true,
    armor_piercing: false,
};
let result = get_combat_result(attack, mob1, mob2);
console.log(get_combat_result_text(result));
console.log(result);
const generic_ctc = {
    combat_text_messages: [
        {
            weight: 1,
            result: CombatResult.Hit,
            story_text: {
                actor_message: "You land a strike to %s% with your %a-obj%.",
                subject_message: "%a% lands a strike to you with %a-his% %a-obj%.",
                room_message: "%a% lands a strike to %s% with %a-his% %a-obj%.",
            },
        },
        {
            weight: 1,
            result: CombatResult.Hit,
            story_text: {
                actor_message: "You strike %s% with your %a-obj%.",
                subject_message: "%a% strikes you with %a-his% %a-obj%.",
                room_message: "%a% strikes %s% with %a-his% %a-obj%.",
            },
        },
        {
            weight: 1,
            result: CombatResult.Dodge,
            story_text: {
                actor_message: "%s% steps aside, dodging your %a-obj%.",
                subject_message: "You step aside, dodging %as% %a-obj%.",
                room_message: "%s% steps aside, dodging %as% %a-obj%.",
            },
        },
        {
            weight: 1,
            result: CombatResult.Parry,
            story_text: {
                actor_message: "%s% nimbly parries your %a-obj%.",
                subject_message: "You nimbly parry %as% %a-obj%.",
                room_message: "%s% nimbly parries %as% %a-obj%.",
            },
        },
        {
            weight: 1,
            result: CombatResult.Block,
            story_text: {
                actor_message: "You strike at %s%, who blocks you with %s-his% %s-obj%.",
                subject_message: "%a% strikes at you, but you block with your %s-obj%.",
                room_message: "%a% strikes at %s%, but is blocked by %ss% %s-obj%.",
            },
        },
        {
            weight: 1,
            result: CombatResult.Armor,
            story_text: {
                actor_message: "You land a strike to %s% with your %a-obj%.",
                subject_message: "%a% lands a strike to you with %a-his% %a-obj%.",
                room_message: "%a% lands a strike to %s% with %a-his% %a-obj%.",
            },
        },
        {
            weight: 1,
            result: CombatResult.Crit,
            story_text: {
                actor_message: "You land a menacing strike on %s% with your %a-obj%.",
                subject_message: "%a% lands a menacing strike on you with %a-his% %a-obj%.",
                room_message: "%a% lands a menacing strike on %s% with %a-his% %a-obj%.",
            },
        },
        {
            weight: 1,
            result: CombatResult.Crit,
            story_text: {
                actor_message: "%s% reels in pain as your %a-obj% lands soundly into %s-his% body.",
                subject_message: "You reel in pain as %as% %a-obj% lands soundly into you body.",
                room_message: "%s% reels in pain as %as% %a-obj% lands soundly into %s-his% body.",
            },
        },
        {
            weight: 1,
            result: CombatResult.SpellBlock,
            story_text: {
                actor_message: "%s% spellblocks your attack.",
                subject_message: "You spellblock %as% attack.",
                room_message: "%s% spellblocks %as% attack.",
            },
        },
    ],
};
