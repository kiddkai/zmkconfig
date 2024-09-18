let words = `object return function var const import include interface struct the of to and a in is it you that he was for on are with as I his they be at one have this from or had by hot but some what there we can out other were all your when up use word how said an each she which do their time if will way about many then them would write like so these her long make thing see him two has look more day could go come did my sound no most number who over know water than call first people may down side been now find any new work part take get place made live where after back little only round man year came show every good me give our under name very through just form much great think say help low line before turn cause same mean differ move right boy old too does tell sentence set want air well also play small end put home read hand port large spell add even land here must big high such follow act why ask men change went light kind off need house picture try us again animal point mother world near build self earth father head stand own page should found answer school grow study still learn plant cover food sun four thought let keep eye never last door between city tree cross since hard start might story saw far sea draw left late run don't while press close night real life few stop open seem together next white children begin got walk example ease paper often always music those both mark book letter until mile river car feet care second group carry took rain eat room friend began idea fish mountain north once base hear horse cut sure watch color face wood main enough plain girl usual young ready above ever red list though feel talk bird soon body dog family direct pose leave song measure state product black short numeral class wind question happen complete ship area half rock order fire south problem piece told knew pass farm top whole king size heard best hour better TRUE during hundred am remember step early hold west ground interest reach fast five sing listen six table travel less morning ten simple several vowel toward war lay against pattern slow center love person money serve appear road map science rule govern pull cold notice voice fall power town fine certain fly unit lead cry dark machine note wait plan figure star box noun field rest correct able pound done beauty drive stood contain front teach week final gave green oh quick develop sleep warm free minute strong special mind behind clear tail produce fact street lot nothing course stay wheel full force blue object decide surface deep moon foot yet busy test record common possible plane age dry wonder thousand ago ran check game shape yes hot miss brought heat snow bed bring sit perhaps fill east weight language among`;

words = words.split(' ').filter(s => s.length > 2);

const left_hand_keys = 'asdfgqwertzxcvb'.split('')
const right_hand_keys = 'hjklyuiopnm'.split('')

const used_combo = {};

const collectCombo = (word) => {
    let maxLength = 2;
    const combo = new Set()

    // first char aways same as word
    combo.add(word[0]);

    const lKeysInWord = word.slice(1).split('').filter(c => left_hand_keys.includes(c));
    const rKeysInWord = word.slice(1).split('').filter(c => right_hand_keys.includes(c));

    // the word can only be typed in one hand, likely not chordable
    if (lKeysInWord.length === 0 || rKeysInWord.length === 0) {
        return '';
    }

    let idx = 0;
    while (combo.size <= maxLength) {
        if (rKeysInWord.length === 0 && lKeysInWord.length === 0) break;

        if (idx++ % 2 === 1) {
            if (lKeysInWord.length === 0) {
                combo.add(rKeysInWord.shift());
            } else {
                combo.add(lKeysInWord.shift());
            }
        } else {
            if (rKeysInWord.length === 0) {
                combo.add(lKeysInWord.shift());
            } else {
                combo.add(rKeysInWord.shift());
            }
        }
    }

    let comboArr = Array.from(combo.values())
    comboArr.sort();

    let comboStr = comboArr.join('')

    if (!used_combo[comboStr]) {
        used_combo[comboStr] = word;

        positions = comboArr.map(c => `P_${c.toUpperCase()}`).join(' ')
        return;
    }

    if (idx++ % 2 === 1) {
        if (lKeysInWord.length === 0) {
            combo.add(rKeysInWord.shift());
        } else {
            combo.add(lKeysInWord.shift());
        }
    } else {
        if (rKeysInWord.length === 0) {
            combo.add(lKeysInWord.shift());
        } else {
            combo.add(rKeysInWord.shift());
        }
    }

    comboArr = Array.from(combo.values());
    comboArr.sort();
    comboStr = comboArr.join('')
    if (!used_combo[comboStr]) {
        used_combo[comboStr] = word;

        positions = comboArr.map(c => `P_${c.toUpperCase()}`).join(' ')
        return;
    }

    if (idx++ % 2 === 1) {
        if (lKeysInWord.length === 0) {
            combo.add(rKeysInWord.shift());
        } else {
            combo.add(lKeysInWord.shift());
        }
    } else {
        if (rKeysInWord.length === 0) {
            combo.add(lKeysInWord.shift());
        } else {
            combo.add(rKeysInWord.shift());
        }
    }

    comboArr = Array.from(combo.values())
    comboArr.sort();
    comboStr = comboArr.join('')
    if (!used_combo[comboStr]) {
        used_combo[comboStr] = word;
    }
};

words.forEach(collectCombo);

const cc = Object.fromEntries(
    Object.entries(used_combo).map(([combo, word]) => {
        let comboFixed = combo.split('');
        comboFixed = comboFixed.sort((a, b) => {
            return word.indexOf(a) - word.indexOf(b);
        });
        return [comboFixed.join(''), word];
    })
)


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

console.log(macros)