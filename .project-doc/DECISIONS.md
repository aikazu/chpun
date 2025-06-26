# Decision D001: Use Local Storage

*   **Context**: The game needs to save the user's progress.
*   **Options Considered**:
    1.  **Local Storage**: Simple to implement, but data is not persistent across devices.
    2.  **Server-side database**: More complex to implement, but data is persistent across devices.
*   **Decision**: Use local storage because it is simpler to implement and sufficient for this simple game.
*   **Consequences**: The user's progress will be lost if they clear their browser data.