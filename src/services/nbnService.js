const axios = require('axios');
const config = require('../config/env');

/**
 * Service to handle NBN Serviceability checks.
 * Utilizes RapidAPI's NBNco Address Check API if configured.
 */
class NBNService {
    /**
     * Checks if an address is serviceable by NBN.
     * @param {string} address
     */
    async checkServiceability(address) {
        const apiKey = config.RAPIDAPI_KEY;
        const isProduction = config.NODE_ENV === 'production';
        const allowMock = config.ALLOW_MOCK_SERVICEABILITY;

        if (apiKey) {
            try {
                console.log(`Checking real serviceability for: ${address}`);
                const response = await axios.get('https://nbnco-address-check.p.rapidapi.com/nbn_address_search', {
                    params: { address: address },
                    headers: {
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'nbnco-address-check.p.rapidapi.com'
                    },
                    timeout: 10000 // 10 second timeout
                });

                const data = response.data;
                if (data && data.addressDetail) {
                    return {
                        serviceable: data.addressDetail.serviceStatus === 'Available',
                        techType: data.addressDetail.techType || 'FTTP',
                        maxSpeed: 'Up to 1000/400 Mbps',
                        address: data.addressDetail.formattedAddress || address,
                        csaId: data.servingArea?.csaId || 'N/A',
                        readyForService: true,
                        source: 'REAL_API'
                    };
                } else {
                    throw new Error('Invalid response format from NBN API');
                }
            } catch (error) {
                console.error('NBN API Error:', error.message);

                // In production, we don't fall back to mock unless explicitly allowed
                if (isProduction && !allowMock) {
                    return {
                        serviceable: false,
                        error: 'Serviceability check failed. Please contact support.',
                        address: address
                    };
                }
            }
        }

        // If we reach here, either API key is missing or API failed.
        // Check if we are allowed to use mock.
        if (isProduction && !allowMock) {
             throw new Error('NBN Serviceability check is not available (Missing API key or API failure)');
        }

        // Mock Logic (Development or explicitly enabled)
        console.log(`Using mock serviceability for: ${address}`);
        await new Promise(resolve => setTimeout(resolve, 800));

        if (address.toLowerCase().includes('fail') || address.toLowerCase().includes('unavailable')) {
            return {
                serviceable: false,
                reason: 'NBN is not currently available at this location.',
                address: address,
                source: 'MOCK'
            };
        }

        return {
            serviceable: true,
            techType: 'FTTP',
            maxSpeed: '1000/400 Mbps',
            address: address,
            csaId: 'CSA-MOCK-999',
            readyForService: true,
            source: 'MOCK'
        };
    }
}

module.exports = new NBNService();
