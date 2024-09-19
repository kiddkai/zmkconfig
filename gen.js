const cc = {
    ht: 'hot',
    ho: 'how',
    yr: 'your',
    yu: 'you',
    if: 'if',
    fr: 'for',
    the: 'the',
    cso: 'const',
    let: 'let',
    reu: 'return',
    fom: 'from',
    whi: 'while',
    his: 'his',
    oht: 'other',
};

const genMacro = (word) => {
    const chars = word.split('');

    const keyPresses = chars.map(c => `<&kp ${c.toUpperCase()}>`).join(', ');

    return `m_gen_chord_${word}: m_gen_chord_${word} {
    compatible = "zmk,behavior-macro";
    #binding-cells = <0>;
    bindings = ${keyPresses};
};`;
};

const genCombo = ([combo, word]) => {
    const chars = combo.split('');

    const comboKeys = chars.map(c => `P_${c.toUpperCase()}`).join(' ');

    return `combo_gen_${word} {
    timeout-ms = <COMBO_TIMEOUT>;
    key-positions = <${comboKeys}>;
    bindings = <&m_gen_chord_${word}>;
};`;
};

const macros = Object.values(cc).map(genMacro).join('\n');
const combos = Object.entries(cc).map(genCombo).join('\n');

console.log(combos)
// console.log(cc)