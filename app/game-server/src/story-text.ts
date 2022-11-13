enum Gender {
  He,
  She,
  They,
  Ve,
  Ze
}

enum GenderMap {
  He = 'he/him',
  She = 'she/her',
  They = 'they/them',
  Ve = 've/ver',
  Ze = 'ze/hir'
}

export function possessiveName(name: string): string {
  if (!name) return '';

  if (name[name.length] === 's') {
    name = name + "'";
  } else {
    name = name + "'s";
  }

  return name;
}

export function genderPossessive(gender: Gender): string {
  switch (gender) {
    case Gender.He:
      return 'his';
    case Gender.She:
      return 'her';
    case Gender.They:
      return 'their';
    case Gender.Ve:
      return 'vis';
    case Gender.Ze:
      return 'hir';
    default:
      return '';
  }
}

export function genderObject(gender: Gender): string {
  switch (gender) {
    case Gender.He:
      return 'him';
    case Gender.She:
      return 'her';
    case Gender.They:
      return 'them';
    case Gender.Ve:
      return 'ver';
    case Gender.Ze:
      return 'hir';
    default:
      return '';
  }
}

export function genderSubject(gender: Gender): string {
  switch (gender) {
    case Gender.He:
      return 'he';
    case Gender.She:
      return 'she';
    case Gender.They:
      return 'they';
    case Gender.Ve:
      return 've';
    case Gender.Ze:
      return 'ze';
    default:
      return '';
  }
}

export function genderPossessivePronoun(gender: Gender): string {
  switch (gender) {
    case Gender.He:
      return 'his';
    case Gender.She:
      return 'hers';
    case Gender.They:
      return 'theirs';
    case Gender.Ve:
      return 'vis';
    case Gender.Ze:
      return 'hirs';
    default:
      return '';
  }
}

export function genderReflexive(gender: Gender): string {
  switch (gender) {
    case Gender.He:
      return 'himself';
    case Gender.She:
      return 'herself';
    case Gender.They:
      return 'themself';
    case Gender.Ve:
      return 'verself';
    case Gender.Ze:
      return 'hirself';
    default:
      return '';
  }
}

type MessageContext = {
  name: string;
  gender: Gender;
  object: string;
};

export type StoryText = {
  actor_message: string;
  subject_message: string;
  room_message: string;
};

export function parseText(
  actor: MessageContext,
  subject: MessageContext,
  message: string
) {
  if (message.length <= 1) return message;
  const mapText: { [id: string]: string } = {
    '%a%': actor.name,
    '%as%': possessiveName(actor.name),
    '%a-he%': genderSubject(actor.gender),
    '%a-him%': genderObject(actor.gender),
    '%a-his%': genderPossessive(actor.gender),
    '%a-hers%': genderPossessivePronoun(actor.gender),
    '%a-himself%': genderReflexive(actor.gender),
    '%a-obj%': actor.object,
    '%s%': subject.name,
    '%ss%': possessiveName(subject.name),
    '%s-he%': genderSubject(subject.gender),
    '%s-him%': genderObject(subject.gender),
    '%s-his%': genderPossessive(subject.gender),
    '%s-hers%': genderPossessivePronoun(subject.gender),
    '%s-himself%': genderReflexive(subject.gender),
    '%s-obj%': subject.object
  };

  const re = new RegExp(Object.keys(mapText).join('|'), 'g');
  const msg = message.replace(re, (match) => mapText[match]);

  return msg[0].toUpperCase() + msg.substring(1);
}
