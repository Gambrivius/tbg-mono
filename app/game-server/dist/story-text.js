"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseText = exports.genderReflexive = exports.genderPossessivePronoun = exports.genderSubject = exports.genderObject = exports.genderPossessive = exports.possessiveName = void 0;
var Gender;
(function (Gender) {
    Gender[Gender["He"] = 0] = "He";
    Gender[Gender["She"] = 1] = "She";
    Gender[Gender["They"] = 2] = "They";
    Gender[Gender["Ve"] = 3] = "Ve";
    Gender[Gender["Ze"] = 4] = "Ze";
})(Gender || (Gender = {}));
var GenderMap;
(function (GenderMap) {
    GenderMap["He"] = "he/him";
    GenderMap["She"] = "she/her";
    GenderMap["They"] = "they/them";
    GenderMap["Ve"] = "ve/ver";
    GenderMap["Ze"] = "ze/hir";
})(GenderMap || (GenderMap = {}));
function possessiveName(name) {
    if (!name)
        return "";
    if (name[name.length] === "s") {
        name = name + "'";
    }
    else {
        name = name + "'s";
    }
    return name;
}
exports.possessiveName = possessiveName;
function genderPossessive(gender) {
    switch (gender) {
        case Gender.He:
            return "his";
        case Gender.She:
            return "her";
        case Gender.They:
            return "their";
        case Gender.Ve:
            return "vis";
        case Gender.Ze:
            return "hir";
        default:
            return "";
    }
}
exports.genderPossessive = genderPossessive;
function genderObject(gender) {
    switch (gender) {
        case Gender.He:
            return "him";
        case Gender.She:
            return "her";
        case Gender.They:
            return "them";
        case Gender.Ve:
            return "ver";
        case Gender.Ze:
            return "hir";
        default:
            return "";
    }
}
exports.genderObject = genderObject;
function genderSubject(gender) {
    switch (gender) {
        case Gender.He:
            return "he";
        case Gender.She:
            return "she";
        case Gender.They:
            return "they";
        case Gender.Ve:
            return "ve";
        case Gender.Ze:
            return "ze";
        default:
            return "";
    }
}
exports.genderSubject = genderSubject;
function genderPossessivePronoun(gender) {
    switch (gender) {
        case Gender.He:
            return "his";
        case Gender.She:
            return "hers";
        case Gender.They:
            return "theirs";
        case Gender.Ve:
            return "vis";
        case Gender.Ze:
            return "hirs";
        default:
            return "";
    }
}
exports.genderPossessivePronoun = genderPossessivePronoun;
function genderReflexive(gender) {
    switch (gender) {
        case Gender.He:
            return "himself";
        case Gender.She:
            return "herself";
        case Gender.They:
            return "themself";
        case Gender.Ve:
            return "verself";
        case Gender.Ze:
            return "hirself";
        default:
            return "";
    }
}
exports.genderReflexive = genderReflexive;
function parseText(actor, subject, message) {
    if (message.length <= 1)
        return message;
    const mapText = {
        "%a%": actor.name,
        "%as%": possessiveName(actor.name),
        "%a-he%": genderSubject(actor.gender),
        "%a-him%": genderObject(actor.gender),
        "%a-his%": genderPossessive(actor.gender),
        "%a-hers%": genderPossessivePronoun(actor.gender),
        "%a-himself%": genderReflexive(actor.gender),
        "%a-obj%": actor.object,
        "%s%": subject.name,
        "%ss%": possessiveName(subject.name),
        "%s-he%": genderSubject(subject.gender),
        "%s-him%": genderObject(subject.gender),
        "%s-his%": genderPossessive(subject.gender),
        "%s-hers%": genderPossessivePronoun(subject.gender),
        "%s-himself%": genderReflexive(subject.gender),
        "%s-obj%": subject.object,
    };
    const re = new RegExp(Object.keys(mapText).join("|"), "g");
    const msg = message.replace(re, (match) => mapText[match]);
    return msg[0].toUpperCase() + msg.substring(1);
}
exports.parseText = parseText;
