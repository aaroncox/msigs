# Vaulta Development - Multisig Proposals

> Infrastructure and governance proposals for the Vaulta network

This repository contains multisig proposals for the Vaulta network. Each proposal is self-contained with its own documentation. 

## Proposals

This repository contains the following proposals for the Vaulta network:

### 1. Development Accounts Creation (`dev.accounts`)

**Purpose**: Creates accounts for Vaulta development team

**Dependencies**: None

**Signers**: 15/21 BPs

**Documentation**: [proposals/dev.accounts/README.md](proposals/dev.accounts/README.md)

---

### 2. Development Team Account Setup (`coredevdist`)

**Purpose**: Unlocks funding mechanism for core development team and removes Foundation account access

**Dependencies**: Requires `dev.accounts` proposal to be executed first

**Signers**: 15/21 BPs

**Documentation**: [proposals/coredevdist/README.md](proposals/coredevdist/README.md)

---

### 3. Miscellaneous Vaulta Accounts Setup (`miscaccounts`)

**Purpose**: Creates accounts for new Vaulta Contracts

**Dependencies**: Requires `dev.accounts` proposal to be executed first

**Signers**: 15/21 BPs

**Documentation**: [proposals/miscaccounts/README.md](proposals/miscaccounts/README.md)

---

### 4. Unwind VF1 Account Permission Reset (`unwindvf1`)

**Purpose**: Resets permissions for admin.grants and eosio.grants accounts

**Dependencies**: None

**Signers**: 2/3 Foundation

**Documentation**: [proposals/unwindvf1/README.md](proposals/unwindvf1/README.md)

## Installation

```bash
# Install dependencies
bun install
```

## Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to set local configuration values.

## Running Proposals

Each proposal can be executed from its directory:

```bash
# Navigate to a proposal directory
cd proposals/<proposal-name>

# Execute the proposal
bun run index.ts
```

This will generate a multisig proposal that can be reviewed and approved by the appropriate signers.

## Contributing

When creating new proposals:

1. Create a new directory in `proposals/`
2. Add an `index.ts` file with the proposal logic
3. Create a `README.md` describing the proposal
4. Document all actions, permissions, and security considerations
5. Include contract verification steps if deploying contracts
