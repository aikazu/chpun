## Architecture

### System Diagram

```
+-----------------+      +-----------------+      +-----------------+
|   Game Client   |----->|  Game Logic     |----->|   UI Renderer   |
| (HTML/CSS/JS)   |      | (JavaScript)    |      | (DOM)           |
+-----------------+      +-----------------+      +-----------------+
        ^
        |
        v
+-----------------+
| Firebase        |
| Firestore       |
| (Leaderboard)   |
+-----------------+
```

### Data Model

*   **Player:**
    *   `nickname`: string
    *   `totalLifetimeEarnings`: number
*   **Game State (Local Storage):**
    *   `currentMoney`: number
    *   `goldenGloves`: number
    *   `upgrades`: object (e.g., `{ gloves: 1, autoPunchers: 0 }`)

### Design Patterns

*   **Model-View-Controller (MVC):** The game logic (Model) will be separated from the UI (View) and the user input (Controller).
*   **Observer:** Upgrades and game events will use an observer pattern to notify different parts of the game when changes occur.

### Security & Performance

*   **Security:** The leaderboard will be secured using Firebase's security rules to prevent tampering.
*   **Performance:** The game will be optimized to minimize DOM updates and ensure a smooth user experience, especially during rapid clicking.
