import { get } from 'lodash';

export const capitalize = string => string.slice(0, 1).toUpperCase().concat(string.slice(1));

export const spliceLabels = (selection, labels) => {
    for (let i = labels.length - 1; i >= 0; i--) {
        const label = labels[i];
        selection.splice(label.position, 0, { name: label.text });
    }
};

export const addLabelsToSelection = (selection, property) => {
    let lastInsert = 0;
    let lastSeen = get(selection[0], property);
    const labels = [];

    for (let i = 0; i < selection.length; i++) {
        const member = selection[i];
        if (lastSeen !== member[property]) {
            labels.push({
                position: lastInsert,
                text: capitalize(lastSeen),
            });
            lastInsert = i;
        }
        lastSeen = get(member, property);
    }

    labels.push({
        position: lastInsert,
        text: capitalize(lastSeen),
    });

    spliceLabels(selection, labels);
};
