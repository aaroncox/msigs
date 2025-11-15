import type { Action } from '@wharfkit/antelope'
import { Chains, Session } from '@wharfkit/session'
import { WalletPluginPrivateKey } from '@wharfkit/wallet-plugin-privatekey'
import { NETWORK_AUTHORITY, PROPOSER_PERMISSION, PROPOSER_PRIVATE_KEY } from '$lib/constants'
import * as SystemContract from '$lib/contracts/eosio'
import { WalletPluginMultiSig } from '$lib/plugins/multisig'
import { client } from '$lib/wharf'

const systemContract = new SystemContract.Contract({ client })

const actions: Action[] = [
    // 1   Update admin.grants permissions
    // 1.1 Unlink rams.eos permission from rams.eos::mint
    systemContract.action('unlinkauth', {
        account: 'eosio.grants',
        code: 'rams.eos',
        type: 'mint',
    }),
    // 1.2 Remove rams.eos permission
    systemContract.action('deleteauth', {
        account: 'eosio.grants',
        permission: 'rams.eos',
    }),
    // 1.3 Update active permission and set to eosio@active
    systemContract.action('updateauth', {
        account: 'eosio.grants',
        auth: NETWORK_AUTHORITY,
        permission: 'active',
        parent: 'owner',
    }),
    // 1.4 Update owner permission and set to eosio@active
    systemContract.action('updateauth', {
        account: 'eosio.grants',
        auth: NETWORK_AUTHORITY,
        permission: 'owner',
        parent: '',
    }),

    // 2   Update eosio.grants permissions
    // 2.1 Unlink claim permission from eosio.saving::claim
    systemContract.action('unlinkauth', {
        account: 'eosio.grants',
        code: 'eosio.saving',
        type: 'claim',
    }),
    // 2.2 Remove claim permission
    systemContract.action('deleteauth', {
        account: 'eosio.grants',
        permission: 'claim',
    }),
    // 2.3 Unlink buyram permission from eosio::buyram
    systemContract.action('unlinkauth', {
        account: 'eosio.grants',
        code: 'eosio',
        type: 'buyram',
    }),
    // 2.4 Remove buyram permission
    systemContract.action('deleteauth', {
        account: 'eosio.grants',
        permission: 'buyram',
    }),
    // 2.5 Update active permission and set to eosio@active
    systemContract.action('updateauth', {
        account: 'eosio.grants',
        auth: NETWORK_AUTHORITY,
        permission: 'active',
        parent: 'owner',
    }),
]

const walletPlugin = new WalletPluginPrivateKey(PROPOSER_PRIVATE_KEY)

const proposerSession = new Session({
    chain: Chains.Vaulta,
    permissionLevel: PROPOSER_PERMISSION,
    walletPlugin: walletPlugin,
})

const actorSession = new Session({
    chain: Chains.Vaulta,
    permissionLevel: 'eosio.grants@active',
    walletPlugin: new WalletPluginMultiSig({
        walletPlugins: [walletPlugin],
    }),
})

actorSession.walletPlugin.data.session = proposerSession

const result = await actorSession.transact({ actions }, { broadcast: false })
console.log('Proposed foundation update transaction:', JSON.stringify(result.transaction, null, 2))
