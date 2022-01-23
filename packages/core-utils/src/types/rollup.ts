/* External Imports */
import {
  BlockWithTransactions,
  TransactionResponse,
} from '@ethersproject/abstract-provider'

/**
 * Structure of the response returned by L2Geth nodes when querying the `rollup_getInfo` endpoint.
 */
export interface RollupInfo {
  mode: 'sequencer' | 'verifier'
  syncing: boolean
  ethContext: {
    blockNumber: number
    timestamp: number
  }
  rollupContext: {
    index: number
    queueIndex: number
  }
}

/**
 * Enum used for the two transaction types (queue and direct to Sequencer).
 */
export enum QueueOrigin {
  Sequencer = 'sequencer',
  L1ToL2 = 'l1',
}

/**
 * JSON transaction representation when returned by L2Geth nodes. This is simply an extension to
 * the standard transaction response type. You do NOT need to use this type unless you care about
 * having typed access to L2-specific fields.
 */
export interface L2Transaction extends TransactionResponse {
  l1BlockNumber: number
  l1TxOrigin: string
  queueOrigin: string
  rawTransaction: string
}

/**
 * JSON block representation when returned by L2Geth nodes. Just a normal block but with
 * L2Transaction objects instead of the standard transaction response object.
 */
export interface L2Block extends BlockWithTransactions {
  stateRoot: string
  transactions: [L2Transaction]
}

/**
 * Basic contextual information that exists on all batch elements within the Optimism system. Batch
 * elements are objects submitted to either the CanonicalTransactionChain or the
 * StateCommitmentChain. All batch elements have an associated timestamp and block number.
 */
export interface BatchElementContext {
  timestamp: number
  blockNumber: number
}

/**
 * Batch element for state root batches. State root batches are published to the
 * StateCommitmentChain.
 */
export interface StateRootBatchElement extends BatchElementContext {
  stateRoot: string
}

/**
 * Batch element for transaction batches. Transaction batches are published to the
 * CanonicalTransactionChain.
 */
export interface TransactionBatchElement extends BatchElementContext {
  isSequencerTx: boolean
  rawTransaction: undefined | string
}

/**
 * Generic batch element, either a state root batch element or a transaction batch element.
 */
export type BatchElement = StateRootBatchElement | TransactionBatchElement

/**
 * List of batch elements.
 */
export type Batch = BatchElement[]
