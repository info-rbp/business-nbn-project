/**
 * Validates an Australian Business Number (ABN).
 * Logic:
 * 1. Strip spaces.
 * 2. Must be 11 digits.
 * 3. Subtract 1 from the first digit.
 * 4. Multiply digits by weights: [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
 * 5. Sum products.
 * 6. Valid if sum % 89 === 0.
 *
 * @param {string|number} abn
 * @returns {boolean}
 */
function validateAbn(abn) {
    if (!abn) return false;

    const abnStr = abn.toString().replace(/\s/g, '');

    if (abnStr.length !== 11 || !/^\d+$/.test(abnStr)) {
        return false;
    }

    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    let sum = 0;

    for (let i = 0; i < 11; i++) {
        let digit = parseInt(abnStr[i], 10);
        if (i === 0) {
            digit -= 1;
        }
        sum += digit * weights[i];
    }

    return sum % 89 === 0;
}

module.exports = { validateAbn };
