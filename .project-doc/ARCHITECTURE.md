# System Diagram

```
+-----------------+      +-----------------+      +-----------------+
|   index.html    |----->|    style.css    |      |   script.js     |
+-----------------+      +-----------------+      +-----------------+
        |                      ^                      |
        |                      |                      |
        v                      v                      v
+-------------------------------------------------------------+
|                        Browser                              |
+-------------------------------------------------------------+
```

# Data Model

*   **`count`**: A number that stores the number of punches.
*   **`name`**: A string that stores the name of the person being punched.
*   **`image`**: A string that stores the URL of the image being punched.

# Design Patterns

*   **Observer Pattern**: The `click` event on the punch target is observed to update the punch count.
*   **Module Pattern**: The JavaScript code is organized into modules to separate concerns.

# Security & Performance

*   The game is entirely client-side, so there are no major security concerns.
*   Performance is not a major concern for this simple game.