# LocalSpot Booker Architecture

```mermaid
flowchart LR
  U[Users] --> V[Vercel - Next.js Frontend]
  V -->|HTTPS REST| R[Render - Express API]
  R --> M[(MongoDB Atlas)]
  R --> A[JWT Auth + RBAC]
  G[GitHub Actions CI] --> V
  G --> R
```

## Domain modules

- Auth: signup, login, current user profile.
- Listings: create/search/update listings by category and area.
- Reservations: book and track reservations/appointments.

## Separation of concerns

- Frontend separates features into `auth`, `listings`, `reservations`, `hooks`, and `services`.
- Backend separates concerns by `models`, `controllers`, `routes`, `middleware`, and `services`.
- API contracts are centralized in typed DTOs and request schemas.
