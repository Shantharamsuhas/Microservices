const toRows = require('./server');

const data = [['a', 2, 'c'], ['a', 2, 'c'], ['a', 2, 'c']];
const rowCount = 3;
const result = [['a', 'a', 'a'], ["2.0", "2.0", "2.0"]]

test('Testing toRows method', () => {
    expect(toRows(data, rowCount)).toStrictEqual(result);
});
