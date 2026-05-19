<img src="./public/images/logo.png" alt="Logo" width="149">

Web frontend for chatapp, a real-time chat application. Built with Next.js 16 and React 19, communicating with the chatapp server over HTTP REST and WebSocket.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Pages and routes](#pages-and-routes)
- [WebSocket events](#websocket-events)
- [Providers](#providers)
- [Auth flow](#auth-flow)
- [Site roles](#site-roles)
- [Rooms](#rooms)
- [Friends and invites](#friends-and-invites)
- [Admin panel](#admin-panel)
- [Encryption](#encryption)
- [Error handling](#error-handling)
- [Styling and theming](#styling-and-theming)
- [Hooks and utilities](#hooks-and-utilities)
- [REST API reference](#rest-api-reference)

---

## Features

- **Rooms** — create, join, and manage chat rooms with a full role hierarchy (Member, Moderator, Admin, Owner)
- **Direct messages** — one-on-one DM rooms opened directly from the friends list
- **Friends** — send and respond to friend requests, view friend profiles, remove friends
- **Real-time presence** — live online/offline status for friends and room members over WebSocket
- **Invite toasts** — incoming friend and room invites appear as dismissible toasts with inline Accept/Decline
- **Accepted notifications** — toast confirmation when someone accepts your friend request
- **Message notifications** — toast when a message arrives in a room you are not currently viewing; shows sender, room name, and a 40-character preview; clicking navigates to that room
- **Open invites** — shareable invite codes with configurable usage limits, manageable from the room management page
- **Encrypted rooms** — rooms can be flagged as encrypted at creation time
- **Pagination** — chat history loads in pages of 25 with a "Load older messages" button
- **Typing indicator** — animated three-dot bubble appears when another user is typing; auto-clears after 4 seconds of inactivity or immediately when the message is sent; guarded against cross-room bleed during room transitions
- **Loading overlay** — full-screen animated overlay shown during data fetches on friends, rooms, chat, login, profile, and friend detail pages
- **Offline handling** — automatic WebSocket reconnect with exponential back-off; dedicated server-offline page with auto-polling
- **Site info** — live server statistics available to TRUSTED+ users; ADMIN+ users can additionally load JVM and HTTP endpoint metrics
- **Admin panel** — MODERATOR+ users can look up any account, manage site-wide roles, ban/unban users, and view the global ban list

---

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, static export)
- React 19
- TypeScript
- CSS Modules + global CSS custom properties

---

## Getting started

### Prerequisites

- Node.js 18+
- The [chatapp server](../chatapp-server) running locally or accessible remotely

### Install

```bash
npm install
```

### Environment

The app needs two environment variables pointing at the chatapp server. Edit `.env.development` for local development or `.env.production` for production builds, or create `.env.local` to override:

```env
NEXT_PUBLIC_SERVER_API_URL=http://localhost:5050
NEXT_PUBLIC_WS_API_URL=ws://localhost:5050
```

The WebSocket client appends `/ws` to `NEXT_PUBLIC_WS_API_URL` automatically.

### Run

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Serve production build (static files from out/)
npm start

# Build and start in one step
npm run br
```

The app runs on [http://localhost:3000](http://localhost:3000) by default.

---

## Project structure

```
src/
  app/
    (public)/          # Unauthenticated routes — no header, no socket
    (protected)/       # Authenticated routes — header, socket, providers
  features/
    admin/             # Site info, user lookup, ban list, elevated users
    auth/              # Login, register, home check
    chat/              # Chat page, message history, room session hook
    friends/           # Friends list, friend info, add friend
    invites/           # Invite panel, invite types, respond API
    rooms/             # Room list, create, join, edit, manage
    user/              # Profile page, password change
  shared/
    components/        # Reusable UI (ConfirmPopup, ConnectionIndicator, InviteToast, …)
    hooks/             # useLoading
    lib/               # fetchJSON, formatTimestamp, userRole
    providers/         # AppSocketProvider, AuthProvider, FriendPresenceProvider, InviteProvider
    types/             # WS event types, shared types
  style/
    globals.css        # Design tokens, resets, global utility classes
    modules/           # Feature-scoped CSS Modules
```

---

## Pages and routes

### Public routes

These are accessible without a session and render without the app header or WebSocket connection.

| Route             | Description                                                                                                                                                                                                           |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/`               | Entry point. Checks session via `GET /api/auth`. Redirects to `/rooms` (authenticated), `/login` (not authenticated), or `/server-offline` (server unreachable). Shows "Waking server…" while the check is in flight. |
| `/login`          | Username + password form. On success redirects to `/rooms`. Shows "Credentials not found." on 401.                                                                                                                    |
| `/register`       | Registration form with inline validation (username ≥ 3 chars, password ≥ 8 chars) and a password strength bar. On success, redirects to `/` to re-check session. Shows "Username is taken." on 409.                   |
| `/server-offline` | Shown when the server is unreachable. Polls `GET /api/auth` every 10 seconds. Has a manual "Try again" button. Redirects to `/` automatically once the server responds.                                               |

### Protected routes

All protected routes enforce authentication via 401 redirect — any API call returning 401 sends the user to `/login`.

| Route                     | Min role    | Description                                                                                                                                                                                                                                                                                        |
|---------------------------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/rooms`                  | —           | Room list in three sections: **Managed** (roles OWNER/ADMIN/MODERATOR), **Joined** (MEMBER), **Private** (DM rooms). Removes rooms in real time on `ROOM_DELETED` WS event.                                                                                                                        |
| `/rooms/make`             | —           | Create a new room. Supports an encryption toggle.                                                                                                                                                                                                                                                  |
| `/rooms/join`             | —           | Join a room using an open invite code.                                                                                                                                                                                                                                                             |
| `/rooms/edit`             | —           | Rename a room or delete it. OWNER-only in practice.                                                                                                                                                                                                                                                |
| `/rooms/manage`           | —           | Full room management page. Sections are role-gated — see [Rooms](#rooms).                                                                                                                                                                                                                          |
| `/chat`                   | —           | Chat view. Query param `?id=`. Joins the room over WebSocket, loads paginated history, renders live messages, shows a typing indicator when another member is typing, and shows a member sidebar with avatars and online dots. |
| `/friends`                | —           | Friends list. Shows online status from `FriendPresenceProvider`. Refreshes automatically on `INVITE_ACCEPTED`, `FRIEND_ADDED`, `FRIEND_REMOVED` WS events.                                                                                                                                         |
| `/friends/add`            | —           | Send a friend request by username.                                                                                                                                                                                                                                                                 |
| `/friends/info`           | —           | Friend profile view. Query param `?userId=`. Shows avatar (with online/offline dot), username, full name, bio, email, birthday, and "Friends since" date. Has "Remove friend" with a confirmation popup. Redirects to `/friends` automatically if a `FRIEND_REMOVED` WS event fires for that user. |
| `/user`                   | —           | Own profile. Edit bio, email, full name, avatar URL inline. Also log out and delete account (with confirmation).                                                                                                                                                                                   |
| `/user/password`          | —           | Change password form (old + new password).                                                                                                                                                                                                                                                         |
| `/site-info`              | `TRUSTED`   | Live server statistics: connected users, total sessions, active rooms, total users, total rooms, banned users count. ADMIN+ can additionally load advanced metrics — see [Admin panel](#admin-panel).                                                                                               |
| `/admin`                  | `MODERATOR` | Admin hub with links to the three administrative sub-pages.                                                                                                                                                                                                                                        |
| `/admin/elevated-users`   | `MODERATOR` | Paginated list of all accounts with a role above USER. Supports promote and demote actions (only on users with a lower site role than your own). Page size toggle: 25 / 50 / 100.                                                                                                                   |
| `/admin/find-user`        | `MODERATOR` | Look up any account by username. Displays profile details, role, joined date, and room count. Supports inline promote and ban (with optional reason) — restricted to users with a lower role than your own.                                                                                         |
| `/admin/ban-list`         | `MODERATOR` | Paginated global ban list. Shows banned username, banned-by username, timestamp, and optional reason. Supports unban. Requires confirmation for the unban action.                                                                                                                                   |

The header renders `ElevatedNav` links to `/site-info` (TRUSTED+) and `/admin` (MODERATOR+) automatically. Users below the required role are redirected to `/rooms` on page load.

---

## WebSocket events

All WebSocket traffic goes through a single persistent connection managed by `AppSocketProvider`. It connects to `${NEXT_PUBLIC_WS_API_URL}/ws` and fans out messages to all active subscribers.

### Outbound (client → server)

| Type      | When sent                         | Payload                                        |
|-----------|-----------------------------------|------------------------------------------------|
| `PING`    | Every 25 seconds (keepalive)      | `{ type: "PING" }`                             |
| `JOIN`    | On chat page mount when connected | `{ type: "JOIN", roomId }`                     |
| `LEAVE`   | On chat page unmount              | `{ type: "LEAVE", roomId }`                    |
| `MESSAGE` | On message submit                 | `{ type: "MESSAGE", roomId, message: string }` |
| `TYPING`  | On text input change, throttled to once per 2 seconds | `{ type: "TYPING", roomId }` |

### Inbound (server → client)

| Type                                                  | Handler                  | Effect                                                                      |
|-------------------------------------------------------|--------------------------|-----------------------------------------------------------------------------|
| `ERROR` (401)                                         | `AppSocketProvider`      | Redirect to `/login`                                                        |
| `ERROR` (403)                                         | `AppSocketProvider`      | Redirect to `/rooms`                                                        |
| `ERROR` (429)                                         | `useChatRoomSession`     | Disable send for 3s, show rate-limit message                                |
| `ERROR` (other)                                       | `useChatRoomSession`     | Show `"code: message"` in chat status                                       |
| `MESSAGE` / `JOIN` / `LEAVE`                          | `useChatRoomSession`     | Append message to chat                                                      |
| `ROOM_JOINED`                                         | `useChatRoomSession`     | Set room name, role, members, encryption flag; load initial message history |
| `ROOM_PRESENCE`                                       | `useChatRoomSession`     | Update a member's online status in the sidebar                              |
| `ROOM_ACTION` (KICK/BAN)                              | `useChatRoomSession`     | Redirect to `/rooms`                                                        |
| `ROOM_DELETED`                                        | `ChatClient`             | Redirect to `/rooms` if current room                                        |
| `ROOM_DELETED`                                        | `/rooms` page            | Remove the room from the list in-place                                      |
| `FRIEND_SNAPSHOT`                                     | `FriendPresenceProvider` | Replace entire presence map                                                 |
| `FRIEND_PRESENCE`                                     | `FriendPresenceProvider` | Update a single friend's online status                                      |
| `FRIEND_ADDED`                                        | `FriendPresenceProvider` | Insert new friend into presence map                                         |
| `FRIEND_REMOVED`                                      | `FriendPresenceProvider` | Remove friend from presence map                                             |
| `FRIEND_ADDED` / `FRIEND_REMOVED` / `INVITE_ACCEPTED` | `/friends` page          | Reload friends list                                                         |
| `FRIEND_REMOVED`                                      | `FriendInfoClient`       | Redirect to `/friends` if viewing that friend's profile                     |
| `PENDING_INVITES`                                     | `InviteProvider`         | Replace full pending invite list (sent by server on connect)                |
| `INVITE_RECEIVED`                                     | `InviteProvider`         | Show incoming invite toast for 4 seconds                                    |
| `INVITE_ACCEPTED`                                     | `InviteProvider`         | Show accepted confirmation toast for 4 seconds                              |
| `MESSAGE_NOTIFICATION`                                | `MessageNotificationToast` | Show a clickable toast for 4 seconds when a message arrives in a room the user is not currently viewing; clicking navigates to that room |
| `TYPING`                                              | `useTypingIndicator`     | Show typing indicator bubble in chat; filtered by `roomId` to prevent cross-room bleed |

---

## Providers

Four providers are mounted in the protected layout, nested in this order:
`AppSocketProvider` → `AuthProvider` → `FriendPresenceProvider` → `InviteProvider`.

### AppSocketProvider

Manages the single shared WebSocket connection. On disconnect it reconnects with exponential back-off starting at 2 seconds, doubling each attempt, capped at 30 seconds. The `ConnectionIndicator` component (rendered between header and page content) displays the connection state.

**Context:** `{ connected, error, sendJson, subscribe }`

`subscribe(listener)` registers a callback that receives every inbound WS message and returns an unsubscribe function — used as a `useEffect` cleanup. All other WS consumers (providers, hooks, pages) use this pattern.

### AuthProvider

Fetches and caches the authenticated user's profile (including their `userRole`) from `GET /api/user` on mount. Exposes the user object and a reload function.

**Context:** `{ user, reloadUser }`

`user` is `undefined` while loading and `null` if the request fails. The `userRole` field drives all site-role permission checks via `isAtLeastSiteRole`.

### FriendPresenceProvider

Maintains a `Map<userId, OnlineFriend>` updated by `FRIEND_SNAPSHOT`, `FRIEND_ADDED`, `FRIEND_REMOVED`, and `FRIEND_PRESENCE` events.

**Context:** `{ onlineFriends, allFriendsPresence, isOnline(userId) }`

`onlineFriends` is filtered to online-only and drives the `OnlineFriendsRail` sidebar. `isOnline` is used for the status dots on friend cards.

### InviteProvider

Manages pending invites, the incoming invite toast, and the accepted invite toast.

**Context:** `{ pendingCount, pendingInvites, inviteToast, acceptedToast, setPendingInvites, clearInviteToast, clearAcceptedToast }`

The `pendingCount` drives the badge on the Invites header button. Both toasts are `InviteToast` instances rendered in the protected layout above the page content, with a 4-second auto-dismiss.

---

## Auth flow

1. **Session check:** `/` calls `GET /api/auth`. On 200 → `/rooms`, on 401 → `/login`, on network error → `/server-offline`.
2. **Login:** `POST /api/login` with `{ username, password }`. The server sets an HTTP-only session cookie. No tokens stored client-side.
3. **Register:** `POST /api/register`. On 201 → redirects to `/` which re-runs the session check.
4. **Session persistence:** All API calls use `credentials: "include"` — the browser handles the cookie automatically.
5. **401 handling:** Two paths — REST responses (per-page checks) and WebSocket `ERROR` code 401 (global, in `AppSocketProvider`). Both redirect to `/login`.
6. **Logout:** `POST /api/logout`, then redirect to `/login`. Found in the user profile page.

There is no Next.js middleware. Auth protection relies entirely on API responses — a direct navigation to a protected URL will show loading UI briefly before the first 401 redirects.

---

## Site roles

Site roles are a server-side, account-level hierarchy that gates access to administrative features. The client reads the role from `AuthProvider`'s `user.userRole` and uses `isAtLeastSiteRole` (`src/shared/lib/userRole.ts`) for all checks.

`USER` < `TRUSTED` < `MODERATOR` < `ADMIN` < `SUPERUSER`

| Role        | Access granted                                                                              |
|-------------|---------------------------------------------------------------------------------------------|
| `USER`      | All standard features (chat, friends, rooms, profile)                                       |
| `TRUSTED`   | `/site-info` — basic live server statistics                                                 |
| `MODERATOR` | `/admin` hub — elevated user list, user lookup with promote/ban, global ban list           |
| `ADMIN`     | Advanced site info (JVM metrics, HTTP endpoint table) on `/site-info`; can promote up to ADMIN |
| `SUPERUSER` | Can promote/demote any role below SUPERUSER                                                 |

All site role checks are purely client-side guards that hide UI and redirect on load. The server enforces the same rules independently.

---

## Rooms

### Room types

- **Regular rooms** — standard group chat. Can have many members, roles, and optional encryption.
- **Private/DM rooms** (`type: "PRIVATE"`) — created by clicking "Send message" on a friend card. No leave button, no role management. Listed separately in the "Private Rooms" section.

### Role hierarchy

`MEMBER` < `MODERATOR` < `ADMIN` < `OWNER`

| Capability                 | MEMBER          | MODERATOR | ADMIN | OWNER |
|----------------------------|-----------------|-----------|-------|-------|
| Chat                       | yes             | yes       | yes   | yes   |
| Leave room                 | yes             | yes       | —     | —     |
| Access manage page         | yes (view only) | yes       | yes   | yes   |
| Invite users by username   | —               | yes       | yes   | yes   |
| View member list           | —               | yes       | yes   | yes   |
| Kick members               | —               | yes*      | yes*  | yes   |
| Ban members                | —               | —         | yes*  | yes   |
| View/create open invites   | —               | —         | yes   | yes   |
| View ban list / Unban      | —               | —         | yes   | yes   |
| Rename room                | —               | —         | yes   | yes   |
| Promote Member → Moderator | —               | —         | yes   | yes   |
| Promote Moderator → Admin  | —               | —         | —     | yes   |
| Demote Admin → Moderator   | —               | —         | —     | yes   |
| Demote Moderator → Member  | —               | —         | yes   | yes   |
| Delete room                | —               | —         | —     | yes   |

\* Cannot target a member whose role is equal or higher.

### Open invites

Open invites are room-join links that anyone can use without being targeted specifically. Created from the manage page by ADMIN+. The invite ID is displayed for copying. Each invite tracks `usages / maxUsages`.

---

## Friends and invites

### Invite types

| Type               | Sent via                                     | Description                                                                         |
|--------------------|----------------------------------------------|-------------------------------------------------------------------------------------|
| `FRIEND_REQUEST`   | `/friends/add`                               | Sent to a specific username. Becomes a friendship on acceptance.                    |
| `ROOM_INVITE`      | Room manage page                             | Sent to a specific username by MODERATOR+. Adds the user to the room on acceptance. |
| `OPEN_ROOM_INVITE` | Room manage page, redeemed via `/rooms/join` | Not targeted. Redeemed by entering the invite ID. No decline option.                |

### Invite flow

1. Sender submits the invite.
2. Recipient receives an `INVITE_RECEIVED` WS event → a toast slides in from the top with Accept/Decline buttons. The invite also appears in the Invites panel under "Incoming."
3. On acceptance, sender receives `INVITE_ACCEPTED` → a confirmation toast appears.
4. Both parties receive `FRIEND_ADDED` (for friend requests) or `ROOM_JOINED` (for room invites) and the UI updates live.

### Pending invites

On WebSocket connect the server pushes a `PENDING_INVITES` snapshot. The "Invites" header button shows a badge with the pending count. The Invites panel has two tabs: Incoming (from the snapshot) and Outgoing (fetched on demand from `GET /api/invites/outgoing`).

### Presence

The `OnlineFriendsRail` (left sidebar column on all protected pages) shows circular avatars for all currently online friends. Clicking an avatar navigates to their profile at `/friends/info`. Friend cards on the friends list show a green/grey status dot. The friend info page shows a larger status dot overlaid on the profile avatar.

---

## Admin panel

The admin panel is available to MODERATOR+ users and is reachable via the "Administrative" link in the header (rendered conditionally by `ElevatedNav`).

### Site Info (`/site-info`, TRUSTED+)

Displays live server statistics fetched from `GET /api/admin/site-info`:

| Stat             | Description                         |
|------------------|-------------------------------------|
| Connected users  | Current open WebSocket connections  |
| Total sessions   | All active HTTP sessions            |
| Active rooms     | Rooms with at least one joined user |
| Total users      | All registered accounts             |
| Total rooms      | All rooms in the database           |
| Banned users     | Number of globally banned accounts  |

ADMIN+ users see an "Advanced Site Info" button that loads `GET /api/admin/advanced-site-info` on demand:

**JVM section:** memory used / committed / max (MB), live and peak thread counts, CPU usage %, GC pause mean and max (ms), server uptime.

**HTTP Requests table:** per-endpoint breakdown of URI, method, status codes, total request count, error rate, mean and max response time.

### Elevated Users (`/admin/elevated-users`, MODERATOR+)

Lists every account with a site role above USER. Each row shows the username and role badge. Users with a lower rank than your own can be promoted or demoted one step at a time. Pagination toggle: 25 / 50 / 100 per page.

### Find User (`/admin/find-user`, MODERATOR+)

Search any account by username. On match, displays avatar, username, role badge, email, full name, bio, join date, and room count. If the found account's role is lower than your own, you can:
- **Promote** — advance the account one step up the site role hierarchy.
- **Ban** — globally ban the account with an optional reason.

### Ban List (`/admin/ban-list`, MODERATOR+)

Paginated list of all globally banned accounts. Each row shows the banned username, the moderator who issued the ban, the timestamp, and the optional reason. An **Unban** action is available per row, guarded by a confirmation popup.

---

## Encryption

Rooms can be created with encryption enabled, indicated by a flag in the chat header.

Encryption is applied **server-side at rest only** — messages are stored encrypted in the database using AES-256-GCM with AAD binding each message to its room, user, and message identifier. The server decrypts messages before delivering them to clients, so the web client receives and renders plaintext.

This is **not end-to-end encryption.** The server has access to all message content in plaintext at delivery time. Encryption at rest protects message content from database-level exposure (backups, unauthorized DB access), not from the server itself.

The server decrypts messages before delivering them to the client. History responses contain only the plaintext `message` field — `nonce`, `ciphertext`, and `keyVersion` are not exposed to the client.

---

## Error handling

| Scenario                      | Behaviour                                                                   |
|-------------------------------|-----------------------------------------------------------------------------|
| REST 401                      | Redirect to `/login`                                                        |
| WS ERROR code 401             | Redirect to `/login` (global, `AppSocketProvider`)                          |
| REST 403                      | Inline error message on the page                                            |
| WS ERROR code 403             | Redirect to `/rooms` (global, `AppSocketProvider`)                          |
| WS ERROR code 429             | Disable chat input for 3 seconds, show "You are sending messages too fast." |
| Server unreachable at startup | Redirect to `/server-offline` (polling + retry button)                      |
| WS disconnected               | Exponential back-off reconnect (2s → 4s → 8s → … → 30s cap)                 |
| Destructive actions           | `ConfirmPopup` modal required before any kick, ban, remove, or delete       |

---

## Styling and theming

The app uses a single dark colour theme defined as CSS custom properties in `globals.css`. There is no light mode or theme switching.

### Design tokens

| Token             | Value                    | Used for                                         |
|-------------------|--------------------------|--------------------------------------------------|
| `--bg-main`       | `#50727B`                | Page background                                  |
| `--bg-card`       | `#344955`                | Cards, header                                    |
| `--bg-dark`       | `#35374B`                | Left rail, action buttons                        |
| `--bg-input`      | `#5F8691`                | Inputs, secondary button                         |
| `--accent`        | `#78AC83`                | Primary button, badge, focus ring, active states |
| `--text-main`     | `#ffffff`                | Body text                                        |
| `--text-soft`     | `rgba(255,255,255,0.82)` | Secondary text                                   |
| `--text-muted`    | `rgba(255,255,255,0.68)` | Timestamps, labels, metadata                     |
| `--border-soft`   | `rgba(255,255,255,0.12)` | Dividers                                         |
| `--error-bg`      | `rgba(158,61,61,0.22)`   | Error box background                             |
| `--error-text`    | `#ffd2d2`                | Error text                                       |
| `--status-online` | `#22c55e`                | Online presence dot                              |
| `--radius-card`   | `14px`                   | Card border-radius                               |
| `--radius-input`  | `10px`                   | Input border-radius                              |
| `--radius-pill`   | `999px`                  | Pill buttons                                     |

### Button variants

| Class              | Appearance                    | Use                                  |
|--------------------|-------------------------------|--------------------------------------|
| `.primaryButton`   | Green accent, pill            | Primary actions                      |
| `.secondaryButton` | Teal, pill                    | Secondary/cancel                     |
| `.dangerButton`    | Dark red, pill                | Destructive actions                  |
| `.textButton`      | Transparent                   | Inline links                         |
| `.actionButton`    | Dark bg, rounded rect         | Row-level actions (kick, ban, leave) |
| `.buttonLoading`   | Reduced opacity + CSS spinner | Async in-progress state              |
| `.buttonDisabled`  | 50% opacity                   | Unavailable actions                  |

---

## Hooks and utilities

### `useLoading<T>` (`src/shared/hooks/useLoading.ts`)

General-purpose async data-fetching hook. Takes a loading function and optional dependency array. Returns `{ loading, error, response, reload }`. Used as the basis for `useRooms`, `useFriends`, and `useUser`.

### `useChatHistory` (`src/features/chat/hooks/useChatHistory.ts`)

Manages paginated chat history (page size 25). Handles initial load and "load older" prepend with deduplication. Resets state when `roomId` changes. Exposes `setMessages` so live WS messages can be appended by `useChatRoomSession`.

### `useChatRoomSession` (`src/features/chat/hooks/useChatRoomSession.ts`)

Manages the full WS lifecycle for a chat room — sending JOIN on mount, LEAVE on unmount, and handling all room-specific inbound events (`ROOM_JOINED`, `ROOM_ACTION`, `ROOM_PRESENCE`, chat messages). Also manages rate-limit state.

### `useTypingIndicator` (`src/features/chat/components/TypingIndicator.tsx`)

Subscribes to `TYPING` WS events for the current room and returns the username of whoever is currently typing (or `null`). Auto-clears after 4 seconds of inactivity, clears immediately on `MESSAGE` from the same user, and filters by `roomId` to prevent stale events from a previous room showing up during transitions. Throttled on the send side to once per 2 seconds.

### `isAtLeastSiteRole` (`src/shared/lib/userRole.ts`)

Utility that compares a user's site role against a required minimum. Used by `ElevatedNav`, `SiteInfo`, and every admin page to gate rendering and redirect unauthorized users. The role order is `USER < TRUSTED < MODERATOR < ADMIN < SUPERUSER`.

### `LoadingOverlay` (`src/features/chat/components/LoadingOverlay.tsx`)

Full-screen backdrop overlay with an animated app logo. Accepts a `visible` prop. Used on friends, rooms, chat, login, profile, and friend detail pages to cover the UI while data is loading.

### `MessageNotificationToast` (`src/shared/components/MessageNotificationToast.tsx`)

Subscribes to `MESSAGE_NOTIFICATION` WS events and renders a toast when a message arrives in a room that is not the user's currently active room. The toast is clickable and navigates to the relevant room. Auto-dismisses after 4 seconds.

### `fetchJSON` (`src/shared/lib/fetchJSON.ts`)

Thin fetch wrapper that always sets `Content-Type: application/json` and returns `{ status, data }` without throwing. Callers branch on status codes directly.

### `formatTimestamp` (`src/shared/lib/formatTimestamp.ts`)

Shows `HH:MM` for today's messages, `Mon DD, HH:MM` for older ones. Used in chat messages and the friend info "Friends since" field.

---

## REST API reference

All requests include `credentials: "include"` for cookie-based auth.

| Method | Path                              | Min role    | Feature                                         |
|--------|-----------------------------------|-------------|-------------------------------------------------|
| GET    | `/api/auth`                       | —           | Session check                                   |
| POST   | `/api/login`                      | —           | Login                                           |
| POST   | `/api/logout`                     | —           | Logout                                          |
| POST   | `/api/register`                   | —           | Register                                        |
| GET    | `/api/user`                       | —           | Get own profile                                 |
| PUT    | `/api/user/edit`                  | —           | Update profile                                  |
| PATCH  | `/api/user/edit/password`         | —           | Change password                                 |
| DELETE | `/api/user/delete`                | —           | Delete account                                  |
| GET    | `/api/rooms`                      | —           | List joined rooms                               |
| POST   | `/api/rooms/make`                 | —           | Create room                                     |
| DELETE | `/api/rooms/leave`                | —           | Leave room                                      |
| PUT    | `/api/rooms/edit`                 | —           | Rename room                                     |
| DELETE | `/api/rooms/delete`               | —           | Delete room                                     |
| POST   | `/api/rooms/action`               | —           | Kick or ban a member                            |
| POST   | `/api/rooms/changeRole`           | —           | Promote or demote a member                      |
| DELETE | `/api/rooms/unban`                | —           | Unban a user from a room                        |
| GET    | `/api/rooms/:roomId/members`      | —           | List room members                               |
| GET    | `/api/rooms/:roomId/bans`         | —           | List banned users in a room                     |
| POST   | `/api/rooms/dm`                   | —           | Open or get existing DM room                    |
| GET    | `/api/chats/:roomId`              | —           | Paginated message history (`?page=N&size=N`)    |
| GET    | `/api/friends`                    | —           | List friends                                    |
| DELETE | `/api/friends/remove`             | —           | Remove a friend                                 |
| GET    | `/api/friends/:userId`            | —           | Get a friend's profile                          |
| GET    | `/api/invites/pending`            | —           | List pending invites                            |
| GET    | `/api/invites/outgoing`           | —           | List outgoing invites                           |
| POST   | `/api/invites/friend`             | —           | Send a friend request                           |
| POST   | `/api/invites/room`               | —           | Send a room invite                              |
| POST   | `/api/invites/open`               | —           | Create an open room invite                      |
| POST   | `/api/invites/respond`            | —           | Accept or decline an invite                     |
| GET    | `/api/admin/site-info`            | `TRUSTED`   | Basic server statistics                         |
| GET    | `/api/admin/advanced-site-info`   | `ADMIN`     | JVM, CPU, GC, and HTTP endpoint metrics         |
| GET    | `/api/admin/users`                | `MODERATOR` | List all elevated users                         |
| GET    | `/api/admin/user/:username`       | `MODERATOR` | Get any user's profile details                  |
| POST   | `/api/admin/change-user-role`     | `MODERATOR` | Promote or demote a user's site role            |
| POST   | `/api/admin/ban-user`             | `MODERATOR` | Globally ban a user (optional reason)           |
| POST   | `/api/admin/unban-user`           | `MODERATOR` | Remove a global ban                             |
| GET    | `/api/admin/banned`               | `MODERATOR` | Paginated global ban list (`?page=N&size=N`)    |
