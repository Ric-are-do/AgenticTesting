# Test info

- Name: fixture hard failure 4
- Location: fixture.spec.ts:40:5

# Error details

```
Error: expect(locator).toHaveText(expected)
Locator: locator("[data-test=\"error\"]")
Expected: "Error: First Name is required"
Received: "Error: Last Name is required"
```

# Page snapshot

```yaml
- textbox "First Name": Ada
- textbox "Last Name"
- textbox "Zip/Postal Code"
- heading "Error: Last Name is required" [level=3]
```
