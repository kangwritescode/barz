export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};
export const getOrdinal = (i) => {
    let j = i % 10
    let k = i % 100
    if (j == 1 && k != 11) { return "st" }
    if (j == 2 && k != 12) { return "nd" }
    if (j == 3 && k != 13) { return "rd" }
    else { return "th" }
}
export const errorCreater = (msg) => {
    return Object.assign(
        new Error(msg),
        { code: 405 }
    );
}
export const GenID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
