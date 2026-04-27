---
name: csv-to-table
description: Converts a comma-separated string into a formatted Markdown table. Auto-detects headers, supports column alignment, and displays the result directly in chat.
---

# CSV to Markdown Table

Converts comma-separated input into a formatted Markdown table and displays it inline in the conversation. No external dependencies required.

## When to Activate

- User provides a CSV string and asks to format it as a table
- User says "convert to table", "make a markdown table", "format as table", or similar
- User pastes CSV data and wants it rendered nicely
- User asks to visualize comma-separated data

## How It Works

### Step 1: Parse the Input

Split the input into rows by newline (`\n`). For each row, split by comma to get cells. Trim whitespace from each cell.

```
rows = input.trim().split('\n').map(row => row.split(',').map(cell => cell.trim()))
```

Handle edge cases:
- Ignore completely empty rows
- Normalize all rows to the same column count (pad with empty strings if needed)

### Step 2: Auto-Detect Headers

Check if the **first row** looks like headers using these heuristics:
- All cells in row 1 are non-numeric strings → likely headers
- Any cell in row 1 ends with `:` or is ALL_CAPS → likely headers
- Row 1 cells are all unique, while other rows have repeated patterns → likely headers
- If the user explicitly says "no header" or "first row is data" → treat as data

If headers are detected, use row 1 as the header row and the rest as data rows.
If no headers are detected, generate generic column names: `Col 1`, `Col 2`, etc.

### Step 3: Apply Column Alignment

Default alignment is **left** for all columns.

User can specify alignment in the request:
- `"align right"` or `"right-align"` → all columns right-aligned
- `"center"` or `"center-align"` → all columns centered
- `"align col 2 right"` → right-align column 2 specifically
- Per-column: `"left,right,center"` → apply alignment to each column in order

Alignment syntax in Markdown separator row:
- Left: `:---`
- Right: `---:`
- Center: `:---:`
- Default (left): `---`

### Step 4: Calculate Column Widths

For each column, find the maximum character width across all cells (including header). Use this width to pad cells with spaces for a clean, aligned table.

```
colWidth[i] = max(header[i].length, max(rows[j][i].length for all j))
```

### Step 5: Render the Markdown Table

Render using standard Markdown table syntax:

```
| Header 1  | Header 2  | Header 3  |
| --------- | --------- | --------- |
| data      | data      | data      |
```

- Pad each cell to `colWidth` with trailing spaces
- Use the appropriate separator for each column's alignment

### Step 6: Output

Display the formatted Markdown table directly in the chat response. No code blocks needed — output it as raw Markdown so it renders immediately.

If the input was ambiguous, briefly note what was assumed (e.g., "I treated the first row as headers").

## Examples

### Basic with Auto-Detected Headers

**Input:**
```
Name,Age,City
Alice,30,New York
Bob,25,London
Carol,35,Tokyo
```

**Output:**

| Name  | Age | City     |
| ----- | --- | -------- |
| Alice | 30  | New York |
| Bob   | 25  | London   |
| Carol | 35  | Tokyo    |

---

### No Headers Detected

**Input:**
```
apple,1.50,fruit
banana,0.75,fruit
carrot,0.90,vegetable
```

**Output:**

| Col 1  | Col 2 | Col 3     |
| ------ | ----- | --------- |
| apple  | 1.50  | fruit     |
| banana | 0.75  | fruit     |
| carrot | 0.90  | vegetable |

---

### Right-Aligned Numbers

**Request:** "Convert this CSV to a table, right-align the numbers"

**Input:**
```
Product,Quantity,Price
Widget,100,9.99
Gadget,50,24.99
Doohickey,200,4.99
```

**Output:**

| Product   | Quantity |  Price |
| --------- | -------: | -----: |
| Widget    |      100 |   9.99 |
| Gadget    |       50 |  24.99 |
| Doohickey |      200 |   4.99 |

---

### Mixed Alignment

**Request:** "Table with left,right,center alignment"

**Input:**
```
Name,Score,Grade
Alice,95,A
Bob,82,B
```

**Output:**

| Name  | Score | Grade |
| :---- | ----: | :---: |
| Alice |    95 |   A   |
| Bob   |    82 |   B   |

## Edge Cases

- **Single column:** Render as a single-column table
- **Single row:** If only one row and no explicit header instruction, treat as data with generated headers
- **Unequal rows:** Pad shorter rows with empty cells to match the longest row
- **Cells with spaces:** Preserve internal spaces; trim only leading/trailing
- **Empty cells:** Render as blank table cells
- **Quoted fields:** If a cell is wrapped in double quotes, treat the content inside as the cell value (basic CSV quoting)
