import type { Action } from '@wharfkit/antelope'
import * as DistributionContract from '$lib/contracts/eosio.saving'
import { logProposalLink } from '$lib/utils'
import {
    client,
    getContractAbi,
    getContractWasm,
    makeSession,
    savingContract,
    systemContract,
} from '$lib/wharf'
import { NETWORK_AUTHORITY, SYSTEM_ACCOUNT } from '../../lib/constants'

const DEV_ACCOUNT = 'dev.vaulta'
const DIST_ACCOUNT = 'dist.vaulta'

export const distContract = new DistributionContract.Contract({ client, account: DIST_ACCOUNT })

// 2-of-2 permission of development team
export const DEV_AUTHORITY = {
    threshold: 2,
    keys: [],
    accounts: [
        {
            weight: 1,
            permission: {
                actor: 'ahayrapetian', // Areg
                permission: 'active',
            },
        },
        {
            weight: 1,
            permission: {
                actor: 'aaron', // Aaron
                permission: 'active',
            },
        },
    ],
    waits: [],
}

const actions: Action[] = [
    // 1. Set the code and ABI for the distribution contract
    systemContract.action('setcode', {
        account: DIST_ACCOUNT,
        code: await getContractWasm('build/contracts/eosio.saving/eosio.saving.wasm'),
        vmtype: 0,
        vmversion: 0,
    }),
    systemContract.action('setabi', {
        account: DIST_ACCOUNT,
        abi: await getContractAbi('build/contracts/eosio.saving/eosio.saving.abi'),
    }),
    // 2. Initialize the distribution contract
    distContract.action('setdistrib', {
        accounts: [
            {
                account: DEV_ACCOUNT,
                percent: 10000,
            },
        ],
    }),
    // 3. Update eosio.saving parameters
    savingContract.action('setdistrib', {
        accounts: [
            {
                account: 'eosio.reward',
                percent: 5371,
            },
            {
                account: DIST_ACCOUNT,
                percent: 2955,
            },
            {
                account: 'eoslabs.io',
                percent: 1674,
            },
        ],
    }),
    // 4. Update fund.wram active permission, replace active permission with eosio@active
    systemContract.action(
        'updateauth',
        {
            account: 'fund.wram',
            auth: NETWORK_AUTHORITY,
            permission: 'active',
            parent: 'owner',
        },
        {
            authorization: [{ actor: 'fund.wram', permission: 'owner' }],
        },
    ),
    // 5. Update eosio.mware active permission, replace active permission with dev.vaulta account
    systemContract.action(
        'updateauth',
        {
            account: 'eosio.mware',
            auth: {
                threshold: 1,
                keys: [],
                accounts: [
                    {
                        weight: 1,
                        permission: {
                            actor: DEV_ACCOUNT,
                            permission: 'active',
                        },
                    },
                ],
                waits: [],
            },
            permission: 'active',
            parent: 'owner',
        },
        {
            authorization: [{ actor: 'eosio.mware', permission: 'owner' }],
        },
    ),
]

const session = makeSession('eosio@active')
const result = await session.transact({ actions }, { broadcast: false })
logProposalLink(result, session)
