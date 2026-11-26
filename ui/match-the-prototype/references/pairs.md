# The pairs file

One JSON object that `plan.js` and `compare.js` both read. A string names
the same value on both sides; an object with `prototype` and `product` names
each side.

```json
{
  "origin": {
    "prototype": "http://127.0.0.1:<prototype port>/<mock folder>/index.html",
    "product": "http://localhost:<product port>/"
  },
  "widths": [1280, 1920],
  "hold": "/api/",
  "firstFrameMs": 600,
  "pairs": [
    {
      "state": "many",
      "address": { "prototype": "#/runs", "product": "/runs" },
      "settled": "main ul li",
      "steps": { "product": [{ "click": "button.more" }, { "wait": 200 }] },
      "widths": [1280, 1920, 375],
      "elements": [
        { "name": "page title", "selector": "main h1" },
        { "name": "first row", "selector": "main ul li" },
        { "name": "row count", "selector": "main ul li .count", "data": true }
      ]
    }
  ]
}
```

| Field | What it does |
|---|---|
| `origin` | Each side's base address. Every `address` resolved against it must land on `localhost`, `127.0.0.1` or `[::1]`, or `plan.js` stops |
| `widths` | The project's widths. Required. A pair's own `widths` replaces it for that pair |
| `hold` | The path prefix of the requests held back in the first frame. Without it, every `fetch` and XHR request is held |
| `firstFrameMs` | How long after load the first frame is taken. Default 600 |
| `settled` | The element whose arrival marks the settled frame |
| `steps` | Clicks, checks and waits before the settled frame |
| `text` | The element whose words are compared as the page text. Default `body` |
| `elements` | Every element a person would point at. `data: true` leaves its words out of the comparison and out of the first frame |
