const toRows = require('./server');

const col_data = [['a', 2, 'c'], ['a', 2, 'c'], ['a', 2, 'c']];
const rowCount = 3;
const toRowsResult = [['a', 'a', 'a'], ["2.0", "2.0", "2.0"]]

test('Testing toRows method', () => {
    expect(toRows(col_data, rowCount)).toStrictEqual(toRowsResult);
});

