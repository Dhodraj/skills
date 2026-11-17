# A fixed number of fix passes, after which defects are reported

Decided 2026-11-16.

## What was proposed

"Three passes is the limit: after the third, stop and report every finding
left, with the reason it is still there."

A fixed count reads as a budget to spend and as permission to stop. It also
authorises handing back with a known Floor breach once the passes are spent,
which is a loosening. In a run nobody is watching, that ceiling becomes the
default.

## What to do instead

The loop ends when a fix finds nothing new. Three survives only as the point
where an open Floor breach becomes a question to the user, never a reason to
accept it.
