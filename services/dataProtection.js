const { KeyManagementServiceClient } = require('@google-cloud/kms');
const { toArrayBuffer } = require('../helpers/convertArray');

const client = new KeyManagementServiceClient();

class DataProtection {

    async kmsEncrypt(password) {
        const keyName = 'projects/rxhelper-352712/locations/global/keyRings/rxHelper/cryptoKeys/rxHelperDataProtectionClass/cryptoKeyVersions/1'
        
        const [encryptResponse] = await client.encrypt({
            name: keyName,
            plaintext: new TextEncoder().encode(password),
        });

        return encryptResponse.ciphertext.toString('base64');
    };

    async kmsDecrypt(password) {
        const keyName = 'projects/rxhelper-352712/locations/global/keyRings/rxHelper/cryptoKeys/rxHelperDataProtectionClass'

        const [decryptResponse] = await client.decrypt({
            name: keyName,
            ciphertext: password,
        });

        return decryptResponse.plaintext?.toString();
    }
};

const dataProtection = new DataProtection();

module.exports = {
    dataProtection
};