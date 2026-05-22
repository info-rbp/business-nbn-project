const { validateAbn } = require('../utils/validateAbn');

describe('ABN Validator', () => {
    test('valid ABNs', () => {
        expect(validateAbn('51 824 753 556')).toBe(true);
        expect(validateAbn('51824753556')).toBe(true);
        expect(validateAbn(51824753556)).toBe(true);
    });

    test('invalid ABNs', () => {
        expect(validateAbn('51 824 753 557')).toBe(false); // Wrong checksum
        expect(validateAbn('12345678901')).toBe(false);
        expect(validateAbn('123')).toBe(false);
        expect(validateAbn('')).toBe(false);
        expect(validateAbn(null)).toBe(false);
        expect(validateAbn('ABC12345678')).toBe(false);
    });
});
