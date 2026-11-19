# Principles

Ask every element on the screen against this catalogue: each label, value,
icon, button, link, badge, status word, help text and callout. Ask every
principle that applies to the element; the index below lists the rows for each
element kind. Skip a principle only when it cannot apply to that element.
Record skipped rows once per element kind on each screen, not once per element.
Where an Ask cell names a gates rule, apply that rule from
[gates.md](gates.md). Where it names
[craft.md](craft.md),
[journey-and-states.md](journey-and-states.md) or
[SKILL.md](../../review-the-ui/SKILL.md), apply the part it names. A "no" is a candidate. It
becomes a finding once it names who it hurts and how (SKILL.md section 8). Every "SKILL.md" below means review-the-ui's.
SKILL.md section 7 sets its severity; the principle's source sets nothing.

The code in brackets after each principle names its sources. Where two sources
state the same principle, it has one row, and later sections list it under
"Asked above".

## Sources

| Code | Source | URL | Items |
|---|---|---|---|
| N | Nielsen, 10 usability heuristics | https://www.nngroup.com/articles/ten-usability-heuristics/ | 10 |
| D | Norman, The Design of Everyday Things, as summarised by the Interaction Design Foundation, with conceptual model from the Wikipedia summary of the book | https://www.interaction-design.org/literature/topics/don-norman and https://en.wikipedia.org/wiki/The_Design_of_Everyday_Things | 7 and 4, 8 distinct |
| G | Gestalt principles, Interaction Design Foundation | https://www.interaction-design.org/literature/topics/gestalt-principles | 12 |
| S | Shneiderman, eight golden rules | https://www.cs.umd.edu/users/ben/goldenrules.html | 8 |
| L | Laws of UX | https://lawsofux.com/ | 30 |
| W | WCAG 2.2, levels A and AA | https://www.w3.org/TR/WCAG22/ | 55 (31 A, 24 AA) |
| GE | GOV.UK Design System, error message | https://design-system.service.gov.uk/components/error-message/ | 7 sections and "How it works" |
| GB | GOV.UK Design System, button | https://design-system.service.gov.uk/components/button/ | 8 sections and "How it works" |
| NE | NN/g, error-message guidelines | https://www.nngroup.com/articles/error-message-guidelines/ | 13 |
| NC | NN/g, UI copy | https://www.nngroup.com/articles/ui-copy/ | 15 |

## Index by element kind

"Look" rows are judged on a screenshot or snapshot. "Act" rows need pressing,
typing, the keyboard, a timer, zoom or rotation, so they run in the SKILL.md
step 5 walk. "Needs the journey" rows also need to know what the product
already holds or asked for earlier.

- **Text or label.** Look: 1.2, 1.4, 1.8, 1.10, 3.3, 3.4, 3.5, 3.10, 3.11, 5.1, 5.3, 5.5, 5.13, 1.3.3, 1.4.1, 1.4.3, 1.4.5, 2.4.6. Act: 1.4.4, 1.4.12.
- **Value or status word.** Look: 1.1, 1.2, 1.4, 1.12, 3.6, 3.8, 5.3, 5.5, 1.4.1, 1.4.3. Act: 1.4.4, 1.4.12.
- **Icon.** Look: 1.2, 1.4, 1.8, 3.1, 3.6, 3.8, 3.9, 3.10, 3.11, 5.7, 1.4.1, 1.4.11, 2.5.8. Act: 1.4.13, 7b.13.
- **Button or command.** Look: 1.4, 1.5, 1.8, 1.11, 2.2, 2.5, 3.9, 3.10, 3.11, 5.4, 5.7, 5.10, 5.16, 1.4.11, 2.5.8, 7b.1, 7b.2, 7b.3, 7b.4, 7b.6, 7b.7, 7b.9, 7b.10, 7b.11, 7b.12, 7b.14, 7b.16, 7b.17, 7b.18, 7b.19. Act: 1.1, 1.3, 1.9, 2.1, 2.6, 4.2, 4.3, 5.6, 2.1.1, 2.4.7, 2.5.2, 3.2.1, 3.3.4, 7b.5, 7b.8, 7b.13, 7b.15.
- **Link.** Look: 1.4, 2.2, 3.10, 1.4.3, 2.4.4. Act: 2.1.1, 2.4.7, 3.2.1.
- **Input field.** Look: 1.5, 1.6, 2.3, 3.5, 5.2, 5.4, 1.4.11, 3.3.2. Act: 1.9, 2.4, 5.12, 2.1.1, 2.4.3, 2.4.7, 2.4.11, 3.2.1, 3.2.2, 3.3.8, 7a.12. Needs the journey: 5.11 and 5.15 (look), 3.3.7 (act).
- **Error message.** Look: 3.3, 1.4.1. Act: 1.9, 7a.1 to 7a.15.
- **Card or panel.** Look: 1.8, 1.12, 2.2, 3.1, 3.3, 3.7, 3.13, 5.1. Act: 1.4.10.
- **List or table.** Look: 1.7, 1.12, 2.3, 3.4, 5.2, 5.3, 5.14. Act: 2.1, 4.3, 1.4.10, 2.5.7.
- **Navigation.** Look: 1.4, 5.10, 5.14. Act: 2.1.1, 2.4.1, 2.4.3.
- **Dialog or overlay.** Look: 3.7. Act: 1.3, 4.2, 1.4.13, 2.1.2, 2.4.11, 3.2.1.
- **Moving or timed content.** Act: 3.12, 4.3, 5.8, 2.2.1, 2.2.2, 2.3.1, 2.5.1, 2.5.7.
- **The page as a whole.** Look: 1.8, 3.2, 4.1, 5.1, 5.9, 5.10, 5.13, 5.16, 2.4.2, 7b.3. Act: 5.6, 5.8, 1.3.4, 1.4.4, 1.4.10, 1.4.12, 2.1.4, 2.4.1, 2.4.3, 3.3.4, 7a.15. Needs the journey: 5.11 and 5.15 (look), 3.3.7 (act).

## 1. Nielsen's usability heuristics

| ID | Principle | Ask of each element | A fault looks like |
|---|---|---|---|
| 1.1 | Visibility of system status, feedback (N1, S3, D feedback) | Does the element show the state it is in, and does it respond visibly as soon as it is used, with a true state (gates rule 3)? | A save button that gives no sign whether the save finished. |
| 1.2 | Match between the system and the real world (N2) | Does the element use the customer's words and order, not the system's? | A column named after a database field, or a status that reads "ERR_STATE_3". |
| 1.3 | User control and freedom (N3, S6) | Can the action this element starts be cancelled, undone or left? | A dialog with no cancel and no close, or a delete with no undo. |
| 1.4 | Consistency and standards (N4, S1, D consistency, L Jakob's law, NC consistent command words) | Does the element look, read and behave like its peers on this screen and like the platform convention? | Two buttons that do the same thing, one named "Remove" and one "Delete". |
| 1.5 | Error prevention (N5, S5, NE safeguard against likely mistakes) | Does the element stop a likely slip before it happens, by a constraint, a default or a confirm step? | A destructive action placed beside a frequent one in the same style. |
| 1.6 | Recognition rather than recall (N6, S8, L working memory) | Can the customer act on this element without remembering something from elsewhere? | A field that asks for a code shown only on the previous step. |
| 1.7 | Flexibility and efficiency of use (N7, NC shortcuts for frequent tasks) | Does a frequent action have a faster path for a practised user that a new user can ignore? | A bulk task that needs one click per row and has no select all. |
| 1.8 | Aesthetic and minimalist design (N8, L Occam's razor) | Does every part of the element carry something the customer needs here (gates rules 31 and 47)? | A tile with an icon, a heading, a subtitle and a tooltip that all say "Settings". |
| 1.9 | Help users recognise, diagnose and recover from errors (N9, W 3.3.1, W 3.3.3, NE constructive advice) | Does the error name the item, say in plain words what went wrong, and say how to fix it? | "Something went wrong (500)" with no next step. |
| 1.10 | Help and documentation (N10, L paradox of the active user) | Where the element needs explaining, is the help on the screen beside it? | A field labelled "Retention policy" whose only help is a link to a long guide. |
| 1.11 | Does it act, and only when it can? (N5, D constraints) | Is the control offered only where its action means something in the item's current state? | A control offered where its action means nothing, such as removing an item that has not started. |
| 1.12 | Can items that share a kind be told apart? (N2, N6) | Does each item carry something that tells it from the others of its kind? | Several items with one title and nothing to tell them apart. |

## 2. Norman's design principles

| ID | Principle | Ask of each element | A fault looks like |
|---|---|---|---|
| 2.1 | Discoverability, visibility (D) | Can the customer see that this action exists without hovering, guessing or opening a menu? | Row actions that appear only on hover, so a touch user never finds them. |
| 2.2 | Affordances (D) | Does the element look like what it does: a button pressable, a field typeable, a static value inert? | A clickable card styled exactly like the static cards around it. |
| 2.3 | Signifiers (D) | Is there a visible cue for where and how to act on it? | A list that reorders by drag with no handle and no hint. |
| 2.4 | Constraints (D) | Does the element make wrong input impossible, rather than warn after the fact? | A quantity field that accepts letters and fails only on submit. |
| 2.5 | Mapping (D) | Can the customer predict the effect of the control from its position and shape? | A filter control placed far from the list it filters. |
| 2.6 | Conceptual model (D, L mental model) | Does the element's wording and behaviour fit one clear picture of how the system works? | A "Save" button that also publishes to every customer. |

Asked above: feedback (1.1), consistency (1.4).

## 3. Gestalt principles of grouping

| ID | Principle | Ask of each element | A fault looks like |
|---|---|---|---|
| 3.1 | Emergence (G) | Does the element read as one whole at a glance, before its parts are inspected? | An icon built of so many small parts that no shape emerges. |
| 3.2 | Closure (reification) (G) | Where the element relies on the eye to complete a shape, does it complete the way intended? | A carousel that shows whole cards only, so nothing hints that more exist. |
| 3.3 | Common region (G, L) | Is the element inside the same bounded area as what it belongs to, and outside areas it does not? | A field's error message that sits in the next card. |
| 3.4 | Continuity (G) | Does the element sit on the line the eye already follows: its row, column or sequence? | One step of a stepper set lower than the others. |
| 3.5 | Proximity (G, L) | craft.md, Spacing and alignment: "Whitespace groups", "A title over its subtitle is one item" and "A control keeps 8 to 12px". | A label equally far from the field above and the field below. |
| 3.6 | Multistability (G) | Does the element have one reading only? | A toggle where nobody can tell whether the filled half means on or off. |
| 3.7 | Figure and ground (G) | Does the element stand clearly in front of or behind its background? | A dialog with no backdrop that blends into the page behind it. |
| 3.8 | Invariance (G) | Is the element recognisable as the same thing when shown at another size or colour elsewhere? | A status icon redrawn so differently at small size that it reads as another icon. |
| 3.9 | Prägnanz (G, L) | craft.md, "Depth is a shadow, structure is a border", and gates rule 31. | A button with a gradient, a bevel, a shadow and an outline at once. |
| 3.10 | Similarity (G, L) | Does the element look like the things that act like it, and unlike the things that do not? | Links and plain bold text in the same colour and weight. |
| 3.11 | Symmetry and order (G) | craft.md, Spacing and alignment, "No near-tangents". | Toolbar icons a few pixels off a common baseline. |
| 3.12 | Common fate (G) | Do elements that move or change together actually belong together? | Unrelated panels that slide in together, implying a link. |
| 3.13 | Uniform connectedness (L) | Where a line, border or fill joins the element to others, are they related? | A connector line in a flow joining two steps that do not follow each other. |

## 4. Shneiderman's eight golden rules

| ID | Principle | Ask of each element | A fault looks like |
|---|---|---|---|
| 4.1 | Seek universal usability (S2) | Can a first-time user on a small screen use the element without training? | A label in internal jargon that only a trained administrator understands. |
| 4.2 | Design dialogs to yield closure (S4) | If the element ends a sequence, does it tell the customer the task is done and what happens next? | Checkout that ends on a blank page with no confirmation. |
| 4.3 | Keep users in control (S7) | Does the element change things only when the customer asks it to? | A list that reorders itself while the customer reads it. |

Asked above: strive for consistency (S1, 1.4), offer informative feedback (S3,
1.1), prevent errors (S5, 1.5), permit easy reversal of actions (S6, 1.3),
reduce short-term memory load (S8, 1.6).

## 5. Laws of UX

| ID | Principle | Ask of each element | A fault looks like |
|---|---|---|---|
| 5.1 | Aesthetic-usability effect (L) | SKILL.md section 4, checks 2 and 8, and craft.md, "Spacing and alignment". | One truncated label and one mismatched corner radius that make the screen feel broken. |
| 5.2 | Choice overload, Hick's law (L) | Does the element offer few enough choices to decide quickly, with a default, a search or groups where there are many? | A dropdown of 80 unsorted options with no search. |
| 5.3 | Chunking, Miller's law (L) | Is long content in the element split into small, labelled groups? | A 16-digit reference shown as one unbroken string. |
| 5.4 | Cognitive bias (L) | Does the element allow for the mental shortcuts people take, so that a default, an anchor or a framing does not lead the customer to a judgment they would not make on reflection? | A paid add-on ticked by default and accepted without being read. |
| 5.5 | Cognitive load (L) | Can the customer understand the element without working anything out? | A size shown in bytes that the customer must convert. |
| 5.6 | Doherty threshold (L) | SKILL.md step 5, Lifecycle, "Loading". | A button that shows nothing for two seconds after a press. |
| 5.7 | Fitts's law (L) | Is the target large enough (gates rule 11) and close to where the pointer or thumb already is? | A small close icon in the far corner of a wide dialog. |
| 5.8 | Flow (L) | Does the element let the task continue without breaking concentration? | A survey popup in the middle of a payment. |
| 5.9 | Goal-gradient effect (L) | Where the task has steps, does the element show how close the customer is to done? | A ten-step form with no progress shown. |
| 5.10 | Pareto principle (L) | Is the action the screen exists for the most prominent one? | The daily action hidden in an overflow menu while a rare one is the primary button. |
| 5.11 | Parkinson's law (L) | Does the element shorten the task with a prefill, a default or autofill? | A form that asks for an address the system already holds. |
| 5.12 | Postel's law (L) | Does an input accept the forms people type: spaces, dashes, mixed case? | A phone field that rejects spaces. |
| 5.13 | Selective attention (L) | Is important content styled so that it cannot be mistaken for an advert or decoration? | A critical notice in a banner styled like a promotion. |
| 5.14 | Serial position effect (L) | Are the key items first or last in the list or menu? | The main navigation item placed in the middle of nine. |
| 5.15 | Tesler's law (L) | Does the system carry complexity the customer should not have to, through defaults or detection? | A form that asks for a time zone the browser already reports. |
| 5.16 | Von Restorff effect (L, GB default buttons) | Does the one thing that must stand out differ from its neighbours, and only that thing, with at most one primary button on the screen (gates rule 40)? | Three buttons styled as primary on one screen. |

Asked above: Jakob's law, working memory, Occam's razor and paradox of the
active user (section 1); mental model (section 2); law of common region, law
of proximity, law of Prägnanz, law of similarity and law of uniform
connectedness (section 3). Asked across screens: peak-end rule and Zeigarnik
effect (last section).

## 6. WCAG 2.2, levels A and AA, judged on the running page

| ID | Principle | Ask of each element | A fault looks like |
|---|---|---|---|
| 1.3.3 | Sensory Characteristics (W) | Does an instruction name the thing by more than shape, colour, size, position or sound? | "Press the round button on the right." |
| 1.3.4 | Orientation (W) | Does the element work in both portrait and landscape? | A screen that shows "Rotate your device" in portrait. |
| 1.4.1 | Use of Color (W) | Gates rule 8. | A required field marked only by a red label. |
| 1.4.3 | Contrast (Minimum) (W, GB dark backgrounds) | Gates rule 5, for text. | Grey helper text on a white background at 3:1. |
| 1.4.4 | Resize Text (W) | At 200% browser zoom, is all of the element's text readable and uncut? | A button label clipped at 200% zoom. |
| 1.4.5 | Images of Text (W) | Is text shown as text, not as a picture of text? | A heading exported as an image that blurs when zoomed. |
| 1.4.10 | Reflow (W) | Gates rule 14, at 320 px wide and at 400% zoom. | A table that forces sideways scrolling of the whole page at 320 px. |
| 1.4.11 | Non-text Contrast (W) | Gates rule 5, for icons, field edges and focus rings. | A text field whose border is a faint grey at 1.5:1. |
| 1.4.12 | Text Spacing (W) | With line height 1.5, paragraph spacing 2 times, letter spacing 0.12em and word spacing 0.16em applied, is all text still visible? | A badge whose text is cut off when spacing is increased. |
| 1.4.13 | Content on Hover or Focus (W) | Can content that appears on hover or focus be dismissed without moving the pointer, be hovered itself, and stay until dismissed? | A tooltip that vanishes when the pointer moves onto it. |
| 2.1.1 | Keyboard (W) | Can the element be reached and used with the keyboard alone? | A custom dropdown that opens only on a mouse click. |
| 2.1.2 | No Keyboard Trap (W) | Can focus leave the element by keyboard? | An embedded editor that keeps focus with Tab and Escape. |
| 2.1.4 | Character Key Shortcuts (W) | Does a single-key shortcut work only when the element has focus, or can it be turned off or changed? | Pressing "d" while typing elsewhere deletes the selected item. |
| 2.2.1 | Timing Adjustable (W) | If the element has a time limit, can the customer turn it off, adjust it or extend it? | A session that ends mid-form with no warning and no option to extend. |
| 2.2.2 | Pause, Stop, Hide (W) | Can moving, blinking or auto-updating content that lasts over 5 seconds be paused or hidden? | An auto-advancing carousel with no pause control. |
| 2.3.1 | Three Flashes or Below Threshold (W) | Does nothing on the screen flash more than three times a second? | A rapidly flashing alert banner. |
| 2.4.1 | Bypass Blocks (W) | Does the first Tab press offer a way past repeated navigation? | Forty Tab presses through the menu before reaching the content. |
| 2.4.2 | Page Titled (W) | Does the page title, read from the snapshot, name this page and its purpose? | Every page titled with only the product name. |
| 2.4.3 | Focus Order (W) | Does Tab move through the elements in an order that keeps their meaning? | Focus that jumps from the first field to the footer and back. |
| 2.4.4 | Link Purpose (In Context) (W) | Can the link's destination be told from its text or its sentence? | A list of links that all read "Click here". |
| 2.4.6 | Headings and Labels (W) | Does the heading or label describe the topic or purpose of what it names? | A heading "Details" over a section about billing. |
| 2.4.7 | Focus Visible (W) | Gates rule 6. | A link whose focus state is invisible. |
| 2.4.11 | Focus Not Obscured (Minimum) (W) | When the element has focus, is it at least partly visible, not hidden under a sticky header, footer or banner? | A focused field hidden behind a cookie banner. |
| 2.5.1 | Pointer Gestures (W) | Gates rule 13, for path and multi-finger gestures. | A map that zooms only by pinching. |
| 2.5.2 | Pointer Cancellation (W) | Does the action fire on release, so sliding off before release cancels it? | A delete that fires the moment the pointer goes down. |
| 2.5.7 | Dragging Movements (W) | Gates rule 13, for dragging. | A slider that moves only by dragging its thumb. |
| 2.5.8 | Target Size (Minimum) (W) | Gates rule 11. | Two 16 px icon buttons placed edge to edge. |
| 3.2.1 | On Focus (W) | Does focusing the element leave the page as it was? | Tabbing into a field opens a new window. |
| 3.2.2 | On Input (W) | Does changing the element's value avoid a change of context the customer was not told about? | Choosing a country in a dropdown loads a new page at once. |
| 3.3.2 | Labels or Instructions (W) | Passes gates rule 7, and is any required format stated before entry? | A date field with no label beyond a placeholder and no format given. |
| 3.3.4 | Error Prevention (Legal, Financial, Data) (W) | If the submission commits money, a legal agreement or a data change, can it be reviewed, corrected or reversed? | A "Pay now" that charges at once with no review step. |
| 3.3.7 | Redundant Entry (W) | Is information given earlier in the process filled in or offered, not asked for again? | A delivery address requested again on the billing step with no "same as delivery" option. |
| 3.3.8 | Accessible Authentication (Minimum) (W) | Can the customer sign in without a memory test or puzzle, with paste and password managers allowed? | A password field that blocks paste. |

Asked above: 3.3.1 Error Identification and 3.3.3 Error Suggestion (1.9).
Asked across screens: 2.4.5 Multiple Ways, 3.2.3 Consistent Navigation, 3.2.4
Consistent Identification, 3.2.6 Consistent Help (last section).

Left out, because a code review, an assistive technology test, a media review
or a device test judges them, not the running page:

| Criterion | Why |
|---|---|
| 1.1.1 Non-text Content | Text alternatives are in the markup, not on the screen. Gates rule 12 covers the code side. |
| 1.2.1 to 1.2.5 (Audio-only and Video-only, Captions Prerecorded, Audio Description or Media Alternative, Captions Live, Audio Description) | Media content needs an audio and video review. |
| 1.3.1 Info and Relationships | Structure must be in the markup; the screen can look right while the code is wrong. |
| 1.3.2 Meaningful Sequence | The reading order is the code order, heard through a screen reader. |
| 1.3.5 Identify Input Purpose | The `autocomplete` attribute is in the markup. |
| 1.4.2 Audio Control | Audio needs an audio review. |
| 2.5.3 Label in Name | Compares the visible label with the accessible name in the markup. |
| 2.5.4 Motion Actuation | Needs a device that reports motion. |
| 3.1.1 Language of Page, 3.1.2 Language of Parts | The `lang` attribute is in the markup. |
| 4.1.2 Name, Role, Value | Read from the accessibility tree. Gates rule 7 covers names. |
| 4.1.3 Status Messages | Whether a message is announced is heard through a screen reader. |
| 4.1.1 Parsing | Obsolete and removed from WCAG 2.2. |

## 7. Interface text

### 7a. Error messages

| ID | Principle | Ask of each element | A fault looks like |
|---|---|---|---|
| 7a.1 | Place the error at its source (GE how it works, NE close to the source) | SKILL.md step 5, Lifecycle, "Failure". | Field errors shown only in a toast at the top of the page. |
| 7a.2 | Mark it in more than one way (GE how it works, NE noticeable, redundant and accessible indicators) | Is the error marked by its text plus a second cue on the field, such as a border, and not by colour alone (gates rule 8)? | A field that turns red with no message. |
| 7a.3 | Summarise errors at the top (GE how it works) | When a form has errors, does a summary at the top list each one and link to its field? | A long form that reloads with errors scattered below the fold and nothing at the top. |
| 7a.4 | Keep what was entered (GE how it works, NE preserve the user's input) | After an error, are all answers, right and wrong, still in their fields? | A failed submit that empties every field. |
| 7a.5 | Match the error to the label (GE) | Does the error use the words of the field's label? | Label "Date of birth", error "Invalid input". |
| 7a.6 | Clear, concise, human, positive (GE be clear and concise, NE human-readable language, NE positive tone without blame) | Is the message plain words, with no code, no blame, and no "please", "sorry", "valid", "invalid" or "oops"? | "Oops! You entered an invalid value." |
| 7a.7 | Same words in both places (GE be consistent) | Does the summary use the same words as the message at the field? | The summary says "Email missing", the field says "Enter an email address". |
| 7a.8 | Specific to the problem (GE be specific, NE concise and precise) | Does the message name this field's actual problem: empty, too long, too short, wrong characters or wrong format? | "This field is required" on a field that holds a value in the wrong format. |
| 7a.9 | Instructions and descriptions used consistently (GE) | Does an empty field get an instruction ("Enter your name") and a wrong value a description ("Name must be 35 characters or less"), the same way on every field? | One field says "Enter a date", the next says "A date is needed". |
| 7a.10 | One template per kind of error (GE use error message templates) | Does the same kind of error get the same wording on every field of that type? | Three date fields with three different wordings for the same mistake. |
| 7a.11 | Prominence matches impact (NE design errors based on their impact) | Is the error's prominence in proportion to its consequence? | A full-page red alert for an optional field. |
| 7a.12 | Not too early (NE avoid prematurely displaying errors) | Does the error wait until the customer leaves the field or submits? | An email field that turns red at the first keystroke. |
| 7a.13 | Reduce correction effort (NE) | Does the error offer the fix itself where it can, such as a suggestion or a jump to the field? | An obvious typo in an email domain with no "Did you mean" offer. |
| 7a.14 | Explain the rule briefly (NE concisely educate on how the system works) | Where the error comes from a rule the customer cannot see, does it state the rule in one line? | "Password not accepted" with no word on what is needed. |
| 7a.15 | A way out of total failure (NE mitigate failure with novelty) | On a page-level failure, does the screen give a way forward, such as home, search or retry? | A blank "Not found" page with no link. |

Asked above: safeguard against likely mistakes (NE, 1.5), offer constructive
advice (NE, 1.9). Not judged on a screen: track errors (GE), which is about
counting errors in analytics.

### 7b. Buttons and commands

| ID | Principle | Ask of each element | A fault looks like |
|---|---|---|---|
| 7b.1 | Verb and object, sentence case, no generic words (GB how it works, NC verbs for actions, NC avoid generic command language) | Gates rules 49 and 48. | "Submit", "OK" or "Click Here". |
| 7b.2 | Align the primary button to the form (GB how it works) | Is the primary button aligned to the left edge of the form it submits? | A primary button floating at the far right, missed at high zoom. |
| 7b.3 | A start action for a journey (GB start buttons) | Does the action that begins a journey stand apart from the buttons inside forms and say where it leads? | A service entry page whose only way in is a small text link. |
| 7b.4 | Few secondary actions (GB secondary buttons) | Are the secondary buttons few enough that the next step stays obvious? | Six secondary buttons in a row under one form. |
| 7b.5 | Warning style for serious actions only (GB warning buttons) | Is a warning-styled button used only for an action that cannot be undone, behind a confirm step, with text that states what will happen (gates rules 8 and 50)? | A red "Delete" that removes an account at once, explained by colour alone. |
| 7b.6 | No unexplained disabled button (GB disabled buttons) | journey-and-states.md, The states, "Disabled". | A greyed-out "Continue" with no sign of what is missing. |
| 7b.7 | Group buttons that belong together (GB grouping buttons) | craft.md, Spacing and alignment, "No near-tangents". | A "Cancel" link on a different baseline from the button beside it. |
| 7b.8 | One press sends once (GB prevent sending more than once) | SKILL.md step 5, The mistakes, "Press the primary action twice". | A slow "Send" that sends two invitations when pressed twice. |
| 7b.9 | Short and clear (NC) | Is the command the fewest words that still say what it does? | "Click here to proceed to the next step of the process". |
| 7b.10 | Name the next state, not the current one (NC describe the consequent state) | Does a toggle command name the state it will move to? | A button reading "Hidden" that shows the panel. |
| 7b.11 | Adjectives for appearance changes (NC) | Does a command that changes how something looks name the resulting look? | A text-style menu with "Change 1" and "Change 2". |
| 7b.12 | No vague names (NC avoid vague command names) | Does the command avoid words that could mean several things, such as "Process" or "Manage"? | A "Handle" button with no hint of what it does. |
| 7b.13 | Tooltips for outcomes (NC include tooltips to clarify outcomes) | Does an icon-only or unclear command show a tooltip that states its outcome? | A toolbar of unlabelled icons with no tooltips. |
| 7b.14 | No branded terms (NC limit branded terms) | Is the command free of internal or brand names the customer must learn? | "Open in Canvas Pro" where "Open in editor" was meant. |
| 7b.15 | Ellipsis when more input is needed (NC) | Gates rule 48. | "Export…" that downloads at once, beside "Print" that opens a dialog. |
| 7b.16 | Keep standard shortcuts (NC do not repurpose standard shortcuts) | Does each shortcut shown keep its platform meaning? | A shortcut hint that maps the platform copy keys to "Duplicate row". |
| 7b.17 | Shortcuts shown (NC make shortcuts discoverable) | Is each shortcut shown beside its command or in its tooltip? | Shortcuts that exist but appear nowhere on the screen. |
| 7b.18 | Learnable shortcuts (NC shortcuts learnable and memorable) | Does each shortcut relate to its command's name? | "Archive" on a key that has no link to the word. |
| 7b.19 | Few modifiers (NC use minimal modifiers) | Does each shortcut use at most two modifier keys? | A shortcut that needs four keys held at once. |

Asked above: one main call to action (GB default buttons, 5.16), consistent
command words (NC, 1.4), shortcuts for frequent tasks (NC, 1.7).

## Principles a single element cannot show

These are judged across screens or over a whole journey. Check them once per
review, after the element pass.

| Principle | How to check |
|---|---|
| Consistency across screens (N4, S1, W 3.2.4 Consistent Identification, NC consistent command words) | Build the four tables in [product.md](../../review-the-ui/references/product.md) section 3 and work from them. |
| Consistent navigation (W 3.2.3) | Compare the navigation on each screen. The repeated links must be in the same relative order everywhere. |
| Consistent help (W 3.2.6) | Note where each screen puts help and contact. It must be in the same relative place on every screen that has it. |
| Multiple ways (W 2.4.5) | For each page that is not a step in a process, find at least two ways to reach it, such as navigation, search or a site map. |
| Recognition across screens (N6, S8) | Walk the journey. At each step, list what the customer must remember from an earlier step. Each item not shown again where it is needed is a finding. |
| Zeigarnik effect (L) | Leave the journey part way and come back. Check that the unfinished task is shown, with where it stopped and how to resume it. |
| Peak-end rule (L) | Walk the journey to the end. Name the hardest moment and the last screen. Check that the hardest moment has the clearest help, and that the last screen confirms the result and the next step. |
