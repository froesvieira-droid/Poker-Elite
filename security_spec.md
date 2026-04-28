# Security Specification - Elite Poker

## Data Invariants
1. A user can only edit their own profile.
2. A room can only be created by an authenticated user.
3. Only the creator of a room (or eventually an admin) can update room metadata (like name).
4. Players can only update their own seat/bet within the `gameState` of a room, and only when it's their turn.
5. `chips` in a user profile are protected and can only be updated by the system (or through specific verified actions). For this MVP, we'll allow users to update their own chips when joining/leaving rooms if they own the chips, but with limits.
6. The `gameState` is the core of the game. Transitions in `gameState` must be valid.

## The "Dirty Dozen" Payloads

1. **Identity Theft**: User A tries to update User B's profile.
2. **Infinite Chips**: User tries to set their chips to 1,000,000,000.
3. **Ghost Room**: User tries to create a room with no name.
4. **Room Hijack**: Non-creator tries to change the small blind in a room.
5. **Double Acting**: Player A tries to act when it is Player B's turn.
6. **Card Peek**: (Generic read fail) Non-player tries to read a private hand (if we stored hands separately).
7. **Phantom Bet**: Player tries to bet more chips than they have in the room.
8. **Malicious ID**: Room ID with 1MB of text.
9. **Role Escalation**: User tries to set `isAdmin: true` on themselves.
10. **State Shortcut**: Player tries to jump from PreFlop to Showdown manually.
11. **Negative Blinds**: Creator sets Small Blind to -100.
12. **Zombie Player**: Player tries to act in a room they haven't joined.

## The Test Plan
I will use `firestore.rules.test.ts` to verify:
- Users can only write to `/users/$(request.auth.uid)`.
- Users can't change their own chips without joining/leaving a room.
- Users can only join a room that isn't full.
- Only the acting player can update the `gameState`.

*(Detailed test code will be written in the next step)*
