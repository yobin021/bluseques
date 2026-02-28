import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Listing {
  'id' : bigint,
  'createdAt' : bigint,
  'seller' : Principal,
  'pricePerCredit' : bigint,
  'amount' : bigint,
}
export interface Transaction {
  'txId' : bigint,
  'seller' : Principal,
  'pricePerCredit' : bigint,
  'timestamp' : bigint,
  'buyer' : Principal,
  'amount' : bigint,
}
export interface _SERVICE {
  'balanceOf' : ActorMethod<[Principal], bigint>,
  'buyCredits' : ActorMethod<[bigint], boolean>,
  'cancelListing' : ActorMethod<[bigint], boolean>,
  'getActiveListings' : ActorMethod<[], Array<Listing>>,
  'getCaller' : ActorMethod<[], Principal>,
  'getTransactionHistory' : ActorMethod<[], Array<Transaction>>,
  'listForSale' : ActorMethod<[bigint, bigint], [] | [bigint]>,
  'mint' : ActorMethod<[bigint], undefined>,
  'transfer' : ActorMethod<[Principal, bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
