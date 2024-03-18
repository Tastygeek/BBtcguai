
const crypto = require('crypto');
const bs58 = require('bs58');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

function generateBitcoinWallet() {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate().toString('hex');
    const publicKey = keyPair.getPublic().encode('hex');
    
    const sha256 = crypto.createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
    const ripemd160 = crypto.createHash('ripemd160').update(sha256).digest();
    
    const networkByte = Buffer.from([0x00]);
    const networkBitcoinPublicKey = Buffer.concat([networkByte, ripemd160]);
    const checksum = crypto.createHash('sha256').update(crypto.createHash('sha256').update(networkBitcoinPublicKey).digest()).digest().slice(0, 4);
    
    const binaryBitcoinAddress = Buffer.concat([networkBitcoinPublicKey, checksum]);
    const walletAddress = bs58.encode(binaryBitcoinAddress);
    
    return {
        privateKey,
        publicKey: publicKey.toString(),
        walletAddress: walletAddress.toString()
    };
}

module.exports = { generateBitcoinWallet };
