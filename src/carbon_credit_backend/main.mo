import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Time "mo:base/Time";

persistent actor {
    // ---- Type Definitions ----
    public type Listing = {
        id : Nat;
        seller : Principal;
        amount : Nat;
        pricePerCredit : Nat; // For prototype purposes, price in an arbitrary unit (e.g., INR)
        createdAt : Int;
    };

    public type Transaction = {
        txId : Nat;
        buyer : Principal;
        seller : Principal;
        amount : Nat;
        pricePerCredit : Nat;
        timestamp : Int;
    };

    // ---- State Variables ----

    // User Balance mapping: Principal -> Nat (Amount of carbon credits)
    var balancesStore : [(Principal, Nat)] = [];
    transient var balances = HashMap.fromIter<Principal, Nat>(balancesStore.vals(), 10, Principal.equal, Principal.hash);

    // active listings: Listing ID -> Listing
    var listingsStore : [(Nat, Listing)] = [];
    transient var listings = HashMap.fromIter<Nat, Listing>(listingsStore.vals(), 10, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });
    var nextListingId : Nat = 0;

    // Transaction history mapping: txId -> Transaction
    var transactionsStore : [(Nat, Transaction)] = [];
    transient var transactions = HashMap.fromIter<Nat, Transaction>(transactionsStore.vals(), 10, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });
    var nextTxId : Nat = 0;

    // --- System Upgrades Hook ---
    // Ensure we save the HashMap states into our stable arrays before an upgrade
    system func preupgrade() {
        balancesStore := Iter.toArray(balances.entries());
        listingsStore := Iter.toArray(listings.entries());
        transactionsStore := Iter.toArray(transactions.entries());
    };

    // Restore the HashMap states after upgrade
    system func postupgrade() {
        balances := HashMap.fromIter<Principal, Nat>(balancesStore.vals(), 10, Principal.equal, Principal.hash);
        listings := HashMap.fromIter<Nat, Listing>(listingsStore.vals(), 10, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });
        transactions := HashMap.fromIter<Nat, Transaction>(transactionsStore.vals(), 10, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });
    };

    // ---- Core Methods ----

    // Utility: Returns the caller's principal identity.
    public shared ({ caller }) func getCaller() : async Principal {
        return caller;
    };

    // Mint Credits: Allocates credits to the caller (prototype purposes, anyone can mint)
    public shared ({ caller }) func mint(amount : Nat) : async () {
        let currentBalance = switch (balances.get(caller)) {
            case null 0;
            case (?b) b;
        };
        balances.put(caller, currentBalance + amount);
    };

    // Get Balance: Checks a user's balance
    public query func balanceOf(user : Principal) : async Nat {
        switch (balances.get(user)) {
            case null { return 0 };
            case (?b) { return b };
        };
    };

    // Transfer: Directly transfer credits from caller to another Principal
    public shared ({ caller }) func transfer(to : Principal, amount : Nat) : async Bool {
        let callerBalance = switch (balances.get(caller)) {
            case null 0;
            case (?b) b;
        };

        if (callerBalance < amount) {
            return false; // Insufficient balance
        };

        // Deduct from caller
        balances.put(caller, callerBalance - amount);

        // Add to receiver
        let receiverBalance = switch (balances.get(to)) {
            case null 0;
            case (?b) b;
        };
        balances.put(to, receiverBalance + amount);

        return true;
    };

    // ---- Marketplace Methods ----

    // List For Sale: Escrows credits and creates a listing
    public shared ({ caller }) func listForSale(amount : Nat, pricePerCredit : Nat) : async ?Nat {
        let callerBalance = switch (balances.get(caller)) {
            case null 0;
            case (?b) b;
        };

        if (callerBalance < amount) {
            return null; // Insufficient balance
        };

        // Escrow the credits (remove from their balance for now, they are tied to the listing)
        balances.put(caller, callerBalance - amount);

        let id = nextListingId;
        nextListingId += 1;

        let listing : Listing = {
            id = id;
            seller = caller;
            amount = amount;
            pricePerCredit = pricePerCredit;
            createdAt = Time.now();
        };

        listings.put(id, listing);
        return ?id;
    };

    // Get Active Listings: Returns an array of all current sale listings
    public query func getActiveListings() : async [Listing] {
        return Iter.toArray(listings.vals());
    };

    // Buy Credits: Buy the entire amount of credits in a listing.
    // Assumes payment mechanism is handled externally (fiat, card, or an out-of-band token)
    public shared ({ caller }) func buyCredits(listingId : Nat) : async Bool {
        switch (listings.get(listingId)) {
            case null {
                return false; // Listing not found
            };
            case (?listing) {
                // Remove listing
                listings.delete(listingId);

                // Transfer the escrowed credits to the buyer
                let buyerBalance = switch (balances.get(caller)) {
                    case null 0;
                    case (?b) b;
                };
                balances.put(caller, buyerBalance + listing.amount);

                // Record transaction history
                let tx : Transaction = {
                    txId = nextTxId;
                    buyer = caller;
                    seller = listing.seller;
                    amount = listing.amount;
                    pricePerCredit = listing.pricePerCredit;
                    timestamp = Time.now();
                };
                transactions.put(nextTxId, tx);
                nextTxId += 1;

                return true;
            };
        };
    };

    // Cancel Listing: Allows the seller to retrieve escrowed tokens and remove the listing
    public shared ({ caller }) func cancelListing(listingId : Nat) : async Bool {
        switch (listings.get(listingId)) {
            case null {
                return false; // Listing not found
            };
            case (?listing) {
                if (listing.seller != caller) {
                    return false; // Unauthorized
                };

                // Remove listing
                listings.delete(listingId);

                // Return escrowed credits to the seller
                let sellerBalance = switch (balances.get(caller)) {
                    case null 0;
                    case (?b) b;
                };
                balances.put(caller, sellerBalance + listing.amount);

                return true;
            };
        };
    };

    // Get Transaction History: Retrieves all past purchases
    public query func getTransactionHistory() : async [Transaction] {
        return Iter.toArray(transactions.vals());
    };
};
