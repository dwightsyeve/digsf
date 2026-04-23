# Security Specification - PrimeInvest

## 1. Data Invariants
- **Users**: Users can only manage their own profile. Admin can manage all.
- **Investments**: Immutable principal upon creation. Status changes restricted to Admin (approvals) or System (maturity).
- **Deposits/Withdrawals**: Created by users as 'pending'. Only Admin can transition to 'approved' or 'rejected'.
- **Notifications**: Users can read their own or public ones.
- **System Settings**: Admin control over global platform parameters.

## 2. Dirty Dozen Payloads (Rejection Targets)
1. **The Ghost Field**: `deposits.add({ amount: 5000, status: 'approved' })` as a User. (Status must be 'pending').
2. **The Identity Thief**: `investments.add({ userId: 'OTHER_USER_ID', ... })`.
3. **The ROI Exploit**: `investments.add({ roiPercent: 9999, ... })`.
4. **The Bank Hijack**: `users.update({ bankDetails: { ... }, role: 'admin' })`. (Role must be immutable by non-admin).
5. **The Query Scrape**: `collection('investments').get()` as a User without filters.
6. **The Negative Withdrawal**: `withdrawals.add({ amount: -100, ... })`.
7. **The Terminal State Override**: `investments.doc('MATURED_ID').update({ status: 'active' })`.
8. **The PII Breach**: `users.doc('OTHER_ID').get()` by a non-owner.
9. **The Admin Impersonator**: `system.doc('settings').update({ ... })` as a non-admin.
10. **The ID Poisoning**: Using a 2MB string as a document ID for `deposits`.
11. **The Email Verification Bypass**: Performing writes with `email_verified: false`.
12. **The Orphaned Record**: Creating a deposit for a `userId` that doesn't exist.

## 3. Test Runner Plan
- Verify `allow create` on `deposits` forces `pending` status.
- Verify `allow list` on `investments` fails without `where('userId', '==', uid)`.
- Verify `isAdmin()` gate works for `/admins/$(uid)`.
