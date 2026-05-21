const nbnService = require('../services/nbnService');

exports.checkAddress = async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        const result = await nbnService.checkServiceability(address);
        res.json(result);
    } catch (error) {
        console.error('Error checking address:', error);
        res.status(500).json({ error: 'Failed to check address serviceability' });
    }
};
