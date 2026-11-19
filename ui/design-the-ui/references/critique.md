# Screenshot critique

A look at the whole screen as a designer sees it, before any rule is asked.
The principle rows and the measurements check parts. This checks the picture.

## Take the images

Render each state of the screen at 1440 and at 375. Take one screenshot per
state and width. Open one image at a time and run the prompt on it alone. Two
images side by side split the attention, and faults on the second go unseen.

## The prompt

Use it word for word, once per image:

> You are a senior product designer reviewing one screen. List every thing on this screen that looks wrong, unclear, untrue, misplaced or unfinished. Check: alignment of edges and columns; balance and empty space; whether each control sits next to what it acts on; whether each status word is true and matches its look; repeated or contradictory text; wording a customer would not use; one icon or word with two meanings; controls offered when they cannot act; items that cannot be told apart; anything clipped, wrapped badly or unreadable; and what is missing that a person needs here (such as when something last ran, or a way to do a chore in bulk). Report every candidate, even small. Do not judge severity. Do not excuse anything because it is consistent or deliberate. For each, give what you see, where (describe the position), and why it hurts the person.

## Dropping a candidate

"Consistent" or "deliberate" is never a reason to drop a candidate. Drop one
when it is not on the image (zoom or read the DOM to check), or when the
project's DESIGN.md allows the choice in writing. Cite that line. A Floor rule
in gates.md cannot be allowed away. In review-the-ui, section 8's other exclusions
still apply.

## In design-the-ui: fix until clean

1. Fix every candidate that holds.
2. Re-shoot every state and width the fix can reach.
3. Run the prompt again on each new image.
4. Stop when a pass returns no candidate that holds, or after 3 passes.

## In review-the-ui: feed the findings

Each candidate that holds becomes a finding, with the screenshot as its
evidence.
