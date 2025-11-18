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
    // 1. Buy the RAM for the distribution contract
    systemContract.action('buyrambytes', {
        bytes: 200000,
        payer: SYSTEM_ACCOUNT,
        receiver: DIST_ACCOUNT,
    }),
    // 2. Set the code and ABI for the distribution contract
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
    // 3. Initialize the distribution contract
    distContract.action('setdistrib', {
        accounts: [
            {
                account: DEV_ACCOUNT,
                percent: 10000,
            },
        ],
    }),
    // 4. Update eosio.saving parameters
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
    // 5. Update fund.wram active permission, replace active permission with eosio@active
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
    // 6. Update eosio.mware active permission, replace active permission with eosio@active
    systemContract.action(
        'updateauth',
        {
            account: 'eosio.mware',
            auth: NETWORK_AUTHORITY,
            permission: 'active',
            parent: 'owner',
        },
        {
            authorization: [{ actor: 'eosio.mware', permission: 'owner' }],
        },
    ),
    // 7. Update the dist.vaulta contract to add a new permission for the development team
    systemContract.action(
        'updateauth',
        {
            account: DIST_ACCOUNT,
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
            permission: 'devclaim',
            parent: 'active',
        },
        {
            authorization: [{ actor: DIST_ACCOUNT, permission: 'active' }],
        },
    ),
    // 8. Update the devclaim permission with a eosio::linkauth call so it can only call eosio.saving::claim
    systemContract.action(
        'linkauth',
        {
            account: DIST_ACCOUNT,
            code: 'eosio.saving',
            type: 'claim',
            requirement: 'devclaim',
        },
        {
            authorization: [{ actor: DIST_ACCOUNT, permission: 'active' }],
        },
    ),
]

const session = makeSession('eosio@active')
const result = await session.transact({ actions }, { broadcast: false })
logProposalLink(result, session)
