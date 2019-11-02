export const errorCreater = (msg) => {
    return Object.assign(
        new Error(msg),
        { code: 405 }
    );
}