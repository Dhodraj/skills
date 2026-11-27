# <ID>: <decision as an imperative phrase>

| | |
|:---|:---|
| **Status** | Proposed · Accepted · Superseded by <ID> |
| **Date** | YYYY-MM-DD |
| **Decision maker** | <named by the user> |
| **Authored** | <named by the user> |
| **Reviewed** | <named by the user> |
| **Consulted** | <named by the user> |
| **Informed** | <named by the user> |

<Leave out any row the user names nobody for.>

<Bottom line: each decision and its main reason, in one or two sentences. For a pending decision: the decider and the input awaited.>

## 1. Context and problem

<The situation today. What breaks, costs or hurts because of it. Why it needs deciding now.>

<If the options were not peers at first, state the right first-level comparison here.>

## 2. Decision <N>: <name>

### 2.1 Goals

- **Bound type:** result-bound, delivery-bound or time-bound: <the concrete target>
- <goal>
- **Non-goals:** <what this decision does not cover>

### 2.2 Assumptions

| # | Assumption | Risk if wrong |
|:--|:---|:---|
| A1 | <load-bearing assumption> | <what changes if it is false> |

### 2.3 Options

#### Option 1: <name>

<One line: what it is.>

| Criterion | Assessment |
|:---|:---|
| Cost | <assessment, each number labelled Measured, Reported, Inferred or Open> |
| Security | <assessment> |
| <criterion> | <assessment> |

**Steelman:** <the strongest case for this option, as its champion would argue it>

**Why it lost:** <rejected options only: the input that decides against it>

#### Option 2: <name>

<Description, assessment table, Steelman, and Why it lost if rejected.>

### 2.4 Outcome

**Chosen:** <option>, or **Pending:** <the decider and the input awaited>.

### 2.5 Reasoning

<Why this option, from the inputs. Whether it is the standard choice or a deviation, and the gain that justifies a deviation. The cost trade-off. The security trade-off.>

### 2.6 Consequences

| Type | Detail |
|:---|:---|
| Positive | |
| Trade-off | |
| Risk | |

<Repeat section 2 as Decision 2, 3 only for sequential, dependent decisions.>

## 3. Implementation plan

1. <step done, with `file:line` where the code does it>
2. **Open:** <step the code does not do yet, with `file:line` of the gap>

## 4. Loose points and accepted risks

### 4.1 <loose point>

- **Assumption:** <what is taken as true now>
- **Risk:** <what is unresolved or knowingly accepted; a code gap gives its `file:line`>
- **Resolution:** <the condition that resolves it, or the mitigation if it fires>

## Records named here

| ID | Title | Kind |
|:---|:---|:---|
| <ID> | <title> | <ADR, spec requirement, convention or infra doc> |

<Leave out this section when the record cites no other record.>
