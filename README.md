# Solana Liquidity Pool

A webhook-based automated liquidity pool system for Solana that automatically mints SPL tokens in response to native SOL deposits. This service acts as a bridge between SOL transfers and SPL token distribution, perfect for building decentralized exchanges, reward systems, or liquidity pools.

## Features

- **Automated Token Minting**: Automatically mint SPL tokens when SOL is received
- **Webhook Integration**: Seamless integration with Helius blockchain indexer
- **Real-time Processing**: Instant detection and processing of SOL transfers
- **Solana Devnet Support**: Built for Solana devnet with easy migration to mainnet
- **Express.js Backend**: Lightweight and scalable REST API
- **Secure Transaction Handling**: Utilizes Solana's SPL Token program for secure token operations

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Solana CLI**: (Optional) For wallet management and testing
- **Helius Account**: For webhook configuration (sign up at [helius.dev](https://helius.dev))

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahulhanje/solana-liquidity-Pool.git
   cd solana-liquidity-Pool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PUBLIC_ADDRESS=your_solana_public_address
   PRIVATE_ADDRESS=your_solana_private_key_base58_encoded
   ```

   - `PUBLIC_ADDRESS`: Your Solana wallet's public address
   - `PRIVATE_ADDRESS`: Your Solana wallet's private key (base58 encoded)
   
   ⚠️ **Security Note**: Never commit your `.env` file or share your private keys. The `.gitignore` file is configured to exclude `.env` automatically.

4. **Configure the token mint address**
   
   Edit `src/address.js` to set your SPL token mint address:
   ```javascript
   export const TOKEN_MINT_ADDRESS = 'your_token_mint_address_here'
   ```

## Usage

### Starting the Server

Run the application:
```bash
node index.js
```

The server will start on port `3000` and listen for incoming webhook requests.

### Webhook Endpoint

**POST** `/helius`

This endpoint receives webhook notifications from Helius when transactions occur on the Solana blockchain.

**Expected Payload Format:**
```json
{
  "nativeTransfers": [
    {
      "amount": 10000000,
      "fromUserAccount": "7qE3FJYpsH4LbYWLSohxY4WxKW2XVgJ5yZ4GNfLwFKvE",
      "toUserAccount": "8pyAjXonZuD2zjj1Wt6VUYUNgfisdzhrFJZDoF7WkmAC"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Transation succesfull"
}
```

### How It Works

1. **SOL Transfer**: A user sends SOL to the configured vault address
2. **Webhook Trigger**: Helius detects the transaction and sends a webhook to your server
3. **Validation**: The server validates the transfer to the vault address
4. **Token Minting**: SPL tokens are automatically minted to the sender's address
5. **Confirmation**: A success response is returned

### Example Flow

```
User Wallet (SOL) → Vault Address
                        ↓
                  Helius Webhook
                        ↓
                  Your Server
                        ↓
              Mint SPL Tokens → User Wallet
```

## Project Structure

```
solana-liquidity-Pool/
├── index.js              # Main Express server and webhook handler
├── src/
│   ├── mintTokens.js     # Token minting logic
│   └── address.js        # Address and key configuration
├── package.json          # Project dependencies
├── .env                  # Environment variables (create this)
└── .gitignore           # Git ignore rules
```

## Configuration

### Vault Address

The vault address is hardcoded in `index.js`. To change it, update the `VAULT` constant:
```javascript
const VAULT = "your_vault_address_here";
```

### Token Mint Address

Update the token mint address in `src/address.js`:
```javascript
export const TOKEN_MINT_ADDRESS = 'your_token_mint_address_here'
```

### Solana Network

By default, the project connects to Solana devnet. To change networks, edit the connection URL in `src/mintTokens.js`:
```javascript
const connection = new Connection("https://api.mainnet-beta.solana.com"); // For mainnet
```

## Setting Up Helius Webhook

1. Sign up for a Helius account at [helius.dev](https://helius.dev)
2. Navigate to the Webhooks section
3. Create a new webhook with the following settings:
   - **Webhook URL**: `https://your-domain.com/helius`
   - **Webhook Type**: Account Change / Transaction
   - **Accounts to Watch**: Add your vault address
4. Save and test the webhook

## Development

### Running in Development Mode

For development, you might want to use a tool like `nodemon` for auto-reloading:

```bash
npm install -g nodemon
nodemon index.js
```

### Testing

Currently, the project uses a mock response for development:
```javascript
const HELIUS_RESPONSE = {
  "nativeTransfers": [ { 
     "amount": 10000000, 
     "fromUserAccount": "7qE3FJYpsH4LbYWLSohxY4WxKW2XVgJ5yZ4GNfLwFKvE", 
     "toUserAccount": "8pyAjXonZuD2zjj1Wt6VUYUNgfisdzhrFJZDoF7WkmAC" 
 } ] }
```

For production, replace this with the actual request body from Helius:
```javascript
app.post('/helius', async (req, res) => {
  const heliustxn = req.body.nativeTransfers.find(x => x.toUserAccount == VAULT)
  // ... rest of the logic
});
```

## Security Considerations

⚠️ **Important Security Notes:**

- **Never commit private keys**: Ensure `.env` is in `.gitignore`
- **Use environment variables**: Store all sensitive data in environment variables
- **Validate webhooks**: In production, verify webhook signatures from Helius
- **Rate limiting**: Implement rate limiting to prevent abuse
- **HTTPS only**: Use HTTPS in production to secure data in transit
- **Monitor transactions**: Set up monitoring and alerts for unusual activity

## Troubleshooting

### Common Issues

**Issue: "Cannot find module" errors**
- Solution: Run `npm install` to ensure all dependencies are installed

**Issue: Token minting fails**
- Solution: Verify your private key has authority to mint tokens
- Check that the token mint address is correct
- Ensure sufficient SOL for transaction fees

**Issue: Webhook not receiving requests**
- Solution: Ensure your server is publicly accessible
- Check Helius webhook configuration
- Verify the vault address is correct

**Issue: Connection errors to Solana**
- Solution: Check network connectivity
- Try using a different RPC endpoint
- Verify the Solana network status

## Dependencies

- **@solana/web3.js**: Solana JavaScript API
- **@solana/spl-token**: SPL Token program integration
- **express**: Web framework for the webhook server
- **dotenv**: Environment variable management
- **bs58**: Base58 encoding/decoding for Solana keys

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines

- Write clear, descriptive commit messages
- Follow existing code style and conventions
- Test your changes thoroughly
- Update documentation as needed
- Add comments for complex logic

## Support

If you need help or have questions:

- **Open an issue**: [GitHub Issues](https://github.com/Rahulhanje/solana-liquidity-Pool/issues)
- **Solana Documentation**: [docs.solana.com](https://docs.solana.com)
- **Helius Documentation**: [docs.helius.dev](https://docs.helius.dev)

## License

This project is licensed under the ISC License.

## Maintainer

Maintained by [Rahulhanje](https://github.com/Rahulhanje)

---

**Note**: This project is currently configured for Solana devnet. Before deploying to mainnet, thoroughly test all functionality and implement additional security measures.
