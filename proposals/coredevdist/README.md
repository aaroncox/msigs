# Development Team Account Setup

> Vaulta Core Development Team Configuration

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
- ahayrapetian@active (Areg)
- aaron@active (Aaron)

**dist.vaulta** - Distribution contract account
- Controlled by network authority
- Runs eosio.saving contract
- Distributes 100% of incoming funds to dev.vaulta

### MSIG - Development Team Setup

> Note: Accounts `dev.vaulta` and `dist.vaulta` already exist and do not need to be created.

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
