const { KeyManagementServiceClient } = require('@google-cloud/kms');
const client = new KeyManagementServiceClient();

class DataProtection {

    async kmsEncrypt(password) {
        const keyName = process.env.KMS_ENCRYPT;
        
        const [encryptResponse] = await client.encrypt({
            name: keyName,
            plaintext: new TextEncoder().encode(password),
        });

        return encryptResponse.ciphertext.toString('base64');
    };

    async kmsDecrypt(password) {
        const keyName = process.env.KMS_DECRYPT;

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