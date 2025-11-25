# Vaulta Development - Multisig Proposals

> Infrastructure and governance proposals for the Vaulta network

This repository contains multisig proposals for the Vaulta network. Each proposal is self-contained with its own documentation.

## Stage 1: Foundation Transition

### Written Proposal

**Document**: [Stage 1 Proposal](documents/stage-1.md)  
**Purpose**: Describes the transition from Vaulta Foundation to new entities (VDT & VNT)  
**Status**: 📝 Draft v6

This document provides the full context and rationale for the Stage 1 transition, including:
- Creation of Vaulta Development Team (VDT) and Vaulta Network Trust (VNT)
- New funding distribution mechanism
- Resolution of Foundation account access issues

### Technical Proposals

#### 1. ⏳ Account Creation (`dev.accounts`)

**Purpose**: Creates accounts for Vaulta development infrastructure  
**Dependencies**: None  
**Signers**: 15/21 BPs  
**Proposal**: https://unicove.com/msig/aaron/fwmpntxlmfhz  
**Links**: [Documentation](proposals/dev.accounts) | [Code](proposals/dev.accounts/index.ts)

---

#### 2. ⏳ Contracts & Configuration (`coredevdist`)

**Purpose**: Deploys distribution contracts and configures funding  
**Dependencies**: Requires `dev.accounts` to be executed first  
**Signers**: 15/21 BPs  
**Links**: [Documentation](proposals/coredevdist) | [Code](proposals/coredevdist/index.ts)

---

## Foundation Cleanup

#### 3. ✅ Unwind VF1 - Permission Reset (`unwindvf1`)

**Purpose**: Resets permissions for admin.grants and eosio.grants accounts  
**Status**: Completed  
**Dependencies**: None  
**Signers**: 2/3 Foundation  
**Links**: [Documentation](proposals/unwindvf1) | [Code](proposals/unwindvf1/index.ts)

**Transactions**:
- Created: [4daa332d...](https://unicove.com/transaction/4daa332db95d2451d9a424897a4a05ac3dc1c7c268f9811f5321dcda84865ba8)
- Executed: [efb12b90...](https://unicove.com/transaction/efb12b9070065cf6f2f9440a4ac030e5155ca17e62efd0e8fb67ae73ff230443)

---

## Platform Infrastructure

#### 4. ⏳ Miscellaneous Accounts (`miscaccounts`)

**Purpose**: Creates accounts for new Vaulta platform contracts  
**Dependencies**: Requires `dev.accounts` to be executed first  
**Signers**: 15/21 BPs  
**Links**: [Documentation](proposals/miscaccounts) | [Code](proposals/miscaccounts/index.ts)

---

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

Each proposal can be executed by targetting the directory:

```bash
bun run proposals/<proposal-name>
```

This will create and submit a multisig proposal to Vaulta, which can then be reviewed and approved by the appropriate signers.

## Document Hashing

Calculate SHA-256 hashes of documentation files for on-chain proposal references:

```bash
./scripts/hash-docs.sh                   # Hash all markdown files in subfolders
./scripts/hash-docs.sh documents/*.md    # Hash specific files
```

Output format:
```
documents/stage-1.md
fe708b714a4fb976b2f291269f18bed17427f0121da62c6ad1c71583d47de157
```

Document hashes can be included in multisig proposals (via token transfer memo) to create a permanent on-chain reference to the approved document version.

## Contributing

When creating new proposals:

1. Create a new directory in `proposals/`
2. Add an `index.ts` file with the proposal logic
3. Create a `README.md` describing the proposal
4. Document all actions, permissions, and security considerations
5. Include contract verification steps if deploying contracts
