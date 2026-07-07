# Product Requirements Document (PRD): Digital Ledger

## 1. Problem Statement
Small-to-medium shopkeepers rely heavily on paper-based ledger books to track credits and debits given to customers. This manual process is prone to calculation errors, physical damage, and lacks a history of changes (audit trail).

Furthermore, when multiple shopkeepers or staff members manage the same shop ledger, they risk overwriting each other's updates if they edit the same transaction at the same time.

## 2. Product Objectives & Core Goals
* **Accuracy & Speed:** Provide an instant, real-time calculation of the running balance as transactions are added.
* **Performance:** Ensure the application remains fast by implementing clean pagination for long transaction histories.
* **Transparency:** Maintain a strict audit trail (version history) of all edits and deletions.
* **Data Integrity:** Prevent concurrent edit conflicts so data is never accidentally overwritten.

## 3. Target Users
* **Primary User:** Shopkeepers, store managers, or cashiers who need to log daily transactions quickly and view customer outstanding balances at a glance.

## 4. Product Scope & Features
### 🟢 In Scope (MVP)
* **Real-time Digital Ledger:** A dashboard to add transactions (Credit/Debit) with immediate, automatic updates to the running balance.
* **Paginated History:** A clean data table displaying transactions, fetching data in chunks (e.g., 10 or 20 per page) to optimize load times.
* **Audit Trail (Version History):** The ability to edit or delete any transaction, while automatically saving a permanent log of who changed what, whxen, and the previous values.
* **Concurrency Locking:** A mechanism that prevents User B from editing a transaction if User A is already in the middle of editing it.

### 🔴 Out of Scope (Future Phases)
* Multi-currency support (App will default to single currency).
* Automated SMS/WhatsApp payment reminders to customers.
* Offline mode syncing.

