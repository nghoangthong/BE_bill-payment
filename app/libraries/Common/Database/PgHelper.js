function bindInsertQuery(entity) {
    let fieldList = [];
    let valuesIndexList = [];
    let values = [];

    Object.keys(entity).forEach((key, index) => {
        fieldList.push(key);
        valuesIndexList.push(`$${index + 1}`);
        values.push(entity[key]);
    });

    return {text: fieldList.join(', '), valuesPattern: valuesIndexList.join(', '), values};
}

module.exports = {
    bindInsertQuery,
};
