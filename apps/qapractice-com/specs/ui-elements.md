# QA Practice UI Elements Test Plan

## Application Overview

https://www.qapractice.com/practice-different-ui-elements: one control per
row, each with an "Output:" box that reports what happened. Output boxes have
no test id (located next to their control). Fresh browser state assumed.
Seen live 2026-11-13.

## Test Scenarios

### 1. Basic elements

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 1.1. Text field and text area mirror the input

**File:** `apps/qapractice-com/tests/ui/ui-text-inputs.spec.ts`

**Steps:**
  1. Type "Hello QA" in [data-testid=ui-text-field] and "line one" in [data-testid=ui-textarea].
    - expect: their outputs read "Hello QA" and "line one"

#### 1.2. Click counter counts clicks

**File:** `apps/qapractice-com/tests/ui/ui-click-counter.spec.ts`

**Steps:**
  1. Open the page.
    - expect: output "Clicked 0 times"
  2. Click [data-testid=ui-click-button] three times.
    - expect: output "Clicked 3 times"

#### 1.3. Single checkbox toggles

**File:** `apps/qapractice-com/tests/ui/ui-single-checkbox.spec.ts`

**Steps:**
  1. Check [data-testid=ui-single-checkbox].
    - expect: output "Checked"
  2. Uncheck it.
    - expect: output "Unchecked"

#### 1.4. Multiple checkboxes are listed

**File:** `apps/qapractice-com/tests/ui/ui-multiple-checkboxes.spec.ts`

**Steps:**
  1. Check Option 1 and Option 3.
    - expect: output "Checked: option1, option3"

#### 1.5. Radio group is exclusive

**File:** `apps/qapractice-com/tests/ui/ui-radio-group.spec.ts`

**Steps:**
  1. Select Radio 1, then Radio 3.
    - expect: Radio 1 unchecked; output "Radio 3"

#### 1.6. Dropdowns report the selection

**File:** `apps/qapractice-com/tests/ui/ui-dropdowns.spec.ts`

**Steps:**
  1. Choose India in [data-testid=ui-single-dropdown].
    - expect: output "India"
  2. Choose Option A and Option C in [data-testid=ui-multi-dropdown].
    - expect: output "Option A, Option C"

### 2. Interactive elements

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 2.1. Link and image report clicks

**File:** `apps/qapractice-com/tests/ui/ui-link-and-image.spec.ts`

**Steps:**
  1. Click [data-testid=ui-link].
    - expect: output "Link Clicked!"; still on the same page
  2. Click [data-testid=ui-image].
    - expect: output "Image Clicked!"

#### 2.2. Table sorts by name

**File:** `apps/qapractice-com/tests/ui/ui-table-sort.spec.ts`

**Steps:**
  1. Open the page.
    - expect: first row "1 Zui 30"
  2. Click [data-testid=ui-th-name].
    - expect: first row "5 Ashley 30", last "1 Zui 30"; output "Table sorted by name"

#### 2.3. Tooltip appears on hover

**File:** `apps/qapractice-com/tests/ui/ui-tooltip.spec.ts`

**Steps:**
  1. Hover [data-testid=ui-tooltip-trigger].
    - expect: a tooltip "This is a tooltip!"

#### 2.4. Slider reports its value

**File:** `apps/qapractice-com/tests/ui/ui-slider.spec.ts`

**Steps:**
  1. Open the page.
    - expect: output "Slider Value: 50"
  2. Set [data-testid=ui-slider] to 0, then 100.
    - expect: "Slider Value: 0", then "Slider Value: 100"

#### 2.5. Progress increments and stops at 100%

**File:** `apps/qapractice-com/tests/ui/ui-progress.spec.ts`

**Steps:**
  1. Click [data-testid=ui-progress-increment] once.
    - expect: output "Progress: 40%" (starts at 30%)
  2. Click it eight more times.
    - expect: output "Progress: 100%"

### 3. Complex and advanced components

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 3.1. Modal opens and closes

**File:** `apps/qapractice-com/tests/ui/ui-modal.spec.ts`

**Steps:**
  1. Click [data-testid=ui-modal-open].
    - expect: a dialog "This is a Modal"; output "Modal is open"
  2. Click the dialog's footer Close button.
    - expect: the dialog is gone; output 'Click "Show Modal"'

#### 3.2. Date input reports the date

**File:** `apps/qapractice-com/tests/ui/ui-date-picker.spec.ts`

**Steps:**
  1. Type 2027-01-15 in [data-testid=ui-datepicker].
    - expect: output "2027-01-15"

#### 3.3. File selection shows the file name

**File:** `apps/qapractice-com/tests/ui/ui-file-upload.spec.ts`

**Steps:**
  1. Choose sample.txt in [data-testid=ui-file-upload].
    - expect: output 'File "sample.txt" selected'

#### 3.4. Notification shows a toast

**File:** `apps/qapractice-com/tests/ui/ui-notification.spec.ts`

**Steps:**
  1. Click [data-testid=ui-show-notification].
    - expect: a toast "Operation completed successfully."; output "Notification shown"

#### 3.5. Tabs report the active tab

**File:** `apps/qapractice-com/tests/ui/ui-tabs.spec.ts`

**Steps:**
  1. Open the page.
    - expect: "Active Tab: tab1"
  2. Click "Tab 2".
    - expect: "Active Tab: tab2"
