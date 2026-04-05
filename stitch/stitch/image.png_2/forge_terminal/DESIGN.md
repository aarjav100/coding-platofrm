# Design System Specification

## 1. Overview & Creative North Star: "The Obsidian Architect"

The Creative North Star for this design system is **"The Obsidian Architect."** This philosophy rejects the cluttered, plastic feel of standard IDEs in favor of a high-end, editorial environment that feels like a precision instrument. We treat code not just as text, but as a structural masterpiece. 

To break the "template" look, we utilize **intentional asymmetry**. Primary navigation or utility bars should feel like floating HUD elements rather than rigid containers. By layering "Glassmorphism" over a "Deep Slate" foundation and utilizing "Emerald Green" for data-rich focal points, we create a sense of infinite depth. The layout relies on high-contrast typography scales and breathing room to ensure that while the environment is dark, the clarity is absolute.

---

### 2. Colors: Tonal Depth & Radiant Accents

We move away from flat surfaces. Colors are used to imply light sources within a dark vacuum.

*   **Primary (`#4edea3`):** Reserved for "Active State" energy. Use this for successful builds, primary CTAs, and critical syntax highlighting.
*   **Secondary (`#adc6ff`):** Used for "System Intelligence"—refactoring hints, secondary navigation, or blue-tinted glow effects to differentiate from user actions.
*   **Surface Hierarchy (The "No-Line" Rule):** 
    *   **Prohibit 1px solid borders** for sectioning. Boundaries must be defined by background shifts.
    *   **Surface-Lowest (`#0c0e12`):** Used for the main "Gutter" or background behind code.
    *   **Surface-Container (`#1e2024`):** The standard "Desk" where your work sits.
    *   **Surface-Highest (`#333539`):** Floating panels or active hover states.
*   **Signature Textures:** Apply a 3% opacity film grain (Noise Texture) over the entire UI. This eliminates color banding in gradients and provides a premium, "physical" feel to the digital slate.
*   **The Glass & Gradient Rule:** Use `surface-container` at 60% opacity with a `20px` backdrop blur for floating modals. Hero elements should utilize a subtle linear gradient from `primary` to `primary_container` to give buttons a "lithium-ion" glow.

---

### 3. Typography: Editorial Precision

We use a high-contrast pairing to balance technical rigor with modern aesthetics.

*   **Display & Headlines (Syne):** Bold and geometric. Use `display-lg` (3.5rem) for landing page impact and `headline-sm` (1.5rem) for module headers. Syne's wide stance commands authority.
*   **Body & UI (DM Sans):** Selected for its neutral, highly legible character. Use `body-md` (0.875rem) for the majority of UI labels to maintain a compact, "pro" feel.
*   **Code (DM Mono):** The engine room. Use this for all terminal outputs and code blocks. The monospacing must feel airy; increase the line-height to `1.6` for long-form reading.

---

### 4. Elevation & Depth: Tonal Layering

Traditional shadows feel "heavy" on deep slate backgrounds. We use **Ambient Light** instead.

*   **The Layering Principle:** Stack `surface-container-low` cards on a `surface` background. The separation is felt, not seen through lines.
*   **Ambient Shadows:** For "Floating" elements (Modals, Tooltips), use a shadow color of `#000000` at 40% opacity with a blur of `32px` and a `primary` tint (10% opacity) to mimic the green glow of the screen reflecting on the surface.
*   **The "Ghost Border" Fallback:** If a separation is mandatory for accessibility, use the `outline_variant` token at **15% opacity**. It should appear as a faint shimmer, not a solid stroke.
*   **Glow Effects:** Use `primary` with a large Gaussian blur (60px-100px) behind key elements to create a "technical aura" that guides the user's eye toward the primary action.

---

### 5. Components: The Primitive Set

#### Buttons
*   **Primary:** Background: `primary_container`. Text: `on_primary_container`. Border-radius: `DEFAULT` (4px). On hover: Add a subtle outer glow using the `primary` color.
*   **Secondary:** Background: `surface_container_highest`. Border: `none`. Text: `on_surface`.
*   **Tertiary:** Ghost style. No background. `DM Sans` bold text with an underline that only appears on hover.

#### Input Fields
*   **Default:** `surface_container_low` background with a `2px` bottom-only border in `outline_variant`.
*   **Focus:** The bottom border transitions to `primary` and a subtle `0.5rem` emerald glow radiates from the bottom.

#### Cards & Lists
*   **No Dividers:** Separate list items using the `Spacing Scale`. Use `spacing-4` (0.9rem) between items.
*   **Hover State:** Change the background of the list item to `surface_container_high`. Do not use a border.

#### Tooltips
*   **Styling:** `surface_container_highest` background, `DM Mono` (label-sm) text. This reinforces the "technical" nature of the tool.

---

### 6. Do’s and Don’ts

*   **DO:** Use `surface_bright` sparingly for "Flash" moments (e.g., successful deployment notifications).
*   **DO:** Maintain the 4px (`DEFAULT`) roundness across all UI elements to preserve the "Sharp/Technical" vibe.
*   **DON'T:** Use pure white (#FFFFFF) for text. Always use `on_surface` (#e2e2e8) to reduce eye strain in dark mode.
*   **DON'T:** Use standard "Drop Shadows." They look muddy on Deep Slate. Use tonal shifts or glow effects.
*   **DO:** Leverage the **Asymmetry Rule**. If a sidebar is on the left, consider offsetting the main content with a slightly larger right-side margin (`spacing-20`) to create a sophisticated, editorial "white space" (black space).