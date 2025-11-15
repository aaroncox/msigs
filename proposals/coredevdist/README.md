# Development Team Account Setup

> Vaulta Core Development Team Configuration

## Overview

This proposal seeks to:

1. Unlock a funding mechanism for the core development team
2. Transfers control of fund.wram to the network authority
3. Transfers control of eosio.mware to the development team

### 1. Development Team Funding

All of the accounts listed below are owned by the network.

- `eosio.saving` retains its current distribution ratios
- `dist.vaulta` receives partial distribution and can redistribute
- `dev.vaulta` claims and allocates to development team accounts

The `dev.vaulta` while being owned by the network is accessible by representatives of the development team. This will start as a 2-of-2 msig permission between Areg and Aaron. Additional signers can be added over time as required.

This configuration can be temporary. At the time of this proposal it is undecided on how this configuration operates long term. This initial configuration is designed to provide a bucket to bootstrap the core development team.

Once the team is established, further review of the configuration can take place.

### 2. The fund.wram account

This is a 2-of-2 msig between the Foundation and Labs in stalemate.

Without a solution on how to use this account, this proposal will simply replace the active permission with `eosio@active`. 

This step is being taken to remove control from the Foundation account, without needing to decide on the fate of the account.

### 3. The eosio.mware account

This is a 2-of-2 msig between the Foundation and Labs in stalemate.

Labs has indicated in discussions it is willing to surrender control of this account to the development team. For that reason, the permissions of this account will be updated to the new `dev.vaulta` account.

If Labs reverses this opinion, this proposal can be modified to simply replace the active permission with `eosio@active` similar to the fund.wram account. 

### Fund Distribution Flow

```mermaid
graph TD
    eosio(eosio 75.8M EOS/year)
    eosio --> |16.45% pay factor| producer(Block Producer Pay 12.4M EOS/year)
    eosio --> |100% system fees| eosio.fees
    eosio.fees --> weights_fees{% weights}
    weights_fees -.-> |100% Distribute to eosio.bpay| bpay(21 producers)
    eosio --> |83.55% unallocated bucket| eosio.saving(eosio.saving 63.3M EOS/year)
    eosio.saving --> percent{% percent}
    percent --> |53.71%| eosio.reward(eosio.reward 34M EOS/year)
    percent --> |29.55%| dist.vaulta(dist.vaulta 18.7M EOS/year)
    percent --> |16.74%| eoslabs.io(eoslabs.io 10.6M EOS/year)
    eosio.reward --> weights_rewards{% weights}
    weights_rewards --> |100% Donate To REX 2.0| eosio.rex(eosio.rex)
    dist.vaulta --> |100%| dev.vaulta(dev.vaulta 18.7M EOS/year)
```

### Allocations

| Sender | Receiver | Allocation (%)| 
|--------|----------|---------------|
| eosio | eosio.saving | 83.55% |
| eosio | producer pay | 16.45% |
| eosio.saving | eosio.reward | 53.71% |
| eosio.saving | dist.vaulta | 29.55% |
| eosio.saving | eoslabs.io | 16.74% |
| dist.vaulta | dev.vaulta | 100% |

### Account Structure

**dev.vaulta** - Development team multi-sig account (2-of-2)
- Owned by the network (eosio@active)
- Accessible by development team representatives 
    - ahayrapetian@active (Areg)
    - aaron@active (Aaron)

**dist.vaulta** - Distribution contract account
- Owned by the network (eosio@active)
- Runs eosio.saving contract
- Distributes 100% of incoming funds to dev.vaulta

### MSIG - Development Team Setup

> Note: Accounts `dev.vaulta` and `dist.vaulta` should already exist and before this proposal is made.

#### Deploy Distribution Contract

- [x] 1.1 Deploy `eosio.saving` contract to `dist.vaulta`
- [x] 1.2 Set contract ABI for `dist.vaulta`

**setcode**
```json
{
    "account": "dist.vaulta",
    "code": "build/contracts/eosio.saving/eosio.saving.wasm",
    "vmtype": 0,
    "vmversion": 0
}
```

**setabi**
```json
{
    "account": "dist.vaulta",
    "abi": "build/contracts/eosio.saving/eosio.saving.abi"
}
```

#### Configure Distribution Strategies

- [x] 2.1 Configure `dist.vaulta` to distribute 100% to `dev.vaulta`

**dist.vaulta::setdistrib**
```json
{
    "accounts": [
        {
            "account": "dev.vaulta",
            "percent": 10000
        }
    ]
}
```

- [x] 2.2 Update `eosio.saving` distribution to include `dist.vaulta` (29.55%)

**eosio.saving::setdistrib**
```json
{
    "accounts": [
        {
            "account": "eosio.reward",
            "percent": 5371
        },
        {
            "account": "dist.vaulta",
            "percent": 2955
        },
        {
            "account": "eoslabs.io",
            "percent": 1674
        }
    ]
}
```

#### Update Permissions

- [x] 3.1 Update `fund.wram` active permission to network authority (replace eosio.grants@active with eosio@active)

**updateauth**
```json
{
    "account": "fund.wram",
    "auth": {
        "threshold": 1,
        "keys": [],
        "accounts": [
            {
                "weight": 1,
                "permission": {
                    "actor": "eosio",
                    "permission": "active"
                }
            }
        ],
        "waits": []
    },
    "permission": "active",
    "parent": "owner"
}
```

- [x] 3.2 Update `eosio.mware` active permission to dev.vaulta@active

**updateauth**
```json
{
    "account": "eosio.mware",
    "auth": {
        "threshold": 1,
        "keys": [],
        "accounts": [
            {
                "weight": 1,
                "permission": {
                    "actor": "dev.vaulta",
                    "permission": "active"
                }
            }
        ],
        "waits": []
    },
    "permission": "active",
    "parent": "owner"
}
```
