const axios = require('axios');

/**
 * Service to handle NBN Serviceability checks.
 * Utilizes RapidAPI's NBNco Address Check API if configured.
 * Otherwise, falls back to a smart mock for development.
 */
class NBNService {
    /**
     * Checks if an address is serviceable by NBN.
     * @param {string} address
     */
    async checkServiceability(address) {
        const apiKey = process.env.RAPIDAPI_KEY;

        if (apiKey) {
            try {
                console.log(`Checking real serviceability for: ${address}`);
                const response = await axios.get('https://nbnco-address-check.p.rapidapi.com/nbn_address_search', {
                    params: { address: address },
                    headers: {
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'nbnco-address-check.p.rapidapi.com'
                    }
                });

                const data = response.data;
                // Basic mapping of RapidAPI response to our app's internal format
                if (data && data.addressDetail) {
                    return {
                        serviceable: data.addressDetail.serviceStatus === 'Available',
                        techType: data.addressDetail.techType || 'FTTP',
                        maxSpeed: 'Up to 1000/400 Mbps',
                        address: data.addressDetail.formattedAddress || address,
                        csaId: data.servingArea?.csaId || 'N/A',
                        readyForService: true
                    };
                }
            } catch (error) {
                console.error('RapidAPI Error:', error.message);
                // Fall through to mock if API fails
            }
        }

        // Smart Mock Logic
        console.log(`Using mock serviceability for: ${address}`);
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (address.toLowerCase().includes('fail') || address.toLowerCase().includes('unavailable')) {
            return {
                serviceable: false,
                reason: 'NBN is not currently available at this location.',
                address: address
            };
        }

        return {
            serviceable: true,
            techType: 'FTTP',
            maxSpeed: '1000/400 Mbps',
            address: address,
            csaId: 'CSA-MOCK-999',
            readyForService: true
        };
    }
}

module.exports = new NBNService();
