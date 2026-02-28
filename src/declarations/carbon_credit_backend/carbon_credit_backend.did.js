export const idlFactory = ({ IDL }) => {
  const Listing = IDL.Record({
    'id' : IDL.Nat,
    'createdAt' : IDL.Int,
    'seller' : IDL.Principal,
    'pricePerCredit' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const Transaction = IDL.Record({
    'txId' : IDL.Nat,
    'seller' : IDL.Principal,
    'pricePerCredit' : IDL.Nat,
    'timestamp' : IDL.Int,
    'buyer' : IDL.Principal,
    'amount' : IDL.Nat,
  });
  return IDL.Service({
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'buyCredits' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'cancelListing' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getActiveListings' : IDL.Func([], [IDL.Vec(Listing)], ['query']),
    'getCaller' : IDL.Func([], [IDL.Principal], []),
    'getTransactionHistory' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
    'listForSale' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Opt(IDL.Nat)], []),
    'mint' : IDL.Func([IDL.Nat], [], []),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
