# Quick Implementation Guide: Move Long-Term Programs to /programs/long

**Time Required**: ~2 hours
**Risk**: Low (with redirects for backward compatibility)
**Status**: Ready to implement

---

## Summary of Changes

**Current (Inconsistent)**:
```
/programs           -> Public catalog
/programs/short     -> Short-term programs
/programs/non-formal -> Non-formal programs
/long-term-programs -> Long-term programs ❌ Outside hierarchy!
```

**After (Consistent)**:
```
/programs           -> Public catalog
/programs/short     -> Short-term programs
/programs/non-formal -> Non-formal programs
/programs/long      -> Long-term programs ✅ Consistent!
```

---

## Step-by-Step Implementation

### Step 1: Update app.routes.ts (5 minutes)

**File**: `apps/vet/src/app/app.routes.ts`

**Change**:
```typescript
// REMOVE this top-level route
{
  path: 'long-term-programs',
  canActivate: [authenticatedGuard],
  data: breadcrumb([]),
  loadChildren: () =>
    import('@vet/long-term-programs')
      .then(m => m.longTermProgramsRoutes),
},

// ADD inside programs.children array
{
  path: 'programs',
  children: [
    // ... existing short and non-formal routes ...

    // ADD THIS:
    {
      path: 'long',
      data: breadcrumb([]),
      loadChildren: () =>
        import('@vet/long-term-programs')
          .then(m => m.longTermProgramsRoutes),
    },
  ],
},

// ADD redirect for backward compatibility (at root level)
{
  path: 'long-term-programs',
  redirectTo: '/programs/long',
  pathMatch: 'prefix'
},
```

---

### Step 2: Update Breadcrumb Paths (30 minutes)

**Find all references**:
```bash
grep -r "/long-term-programs/" --include="*.ts" . | grep -v node_modules | grep -v ".spec.ts"
```

**Expected files** (~15-20 files):
- `long-term-programs/src/long-term-program.routes.ts`
- `dashboard/src/routing/long-term-programs-dashboard.routes.ts`
- `dashboard/src/menu/long-term-programs.menu.ts`
- Various breadcrumb configurations

**Bulk Replace**:
```bash
# Dry run (see what would change)
grep -rl "/long-term-programs/" --include="*.ts" . | grep -v node_modules | grep -v ".spec.ts" | head -20

# Actual replace
find . -name "*.ts" -type f -not -path "*/node_modules/*" -not -name "*.spec.ts" -exec sed -i '' 's|/long-term-programs/|/programs/long/|g' {} +
```

**Manual verification needed for**:
- Dashboard menu items
- Navigation components
- Any router.navigate() calls

---

### Step 3: Update Specific Files

#### 3.1 Long-Term Routes File

**File**: `long-term-programs/src/long-term-program.routes.ts`

**Changes**:
```typescript
// Update all breadcrumb references
// BEFORE:
{ path: '/long-term-programs/registration', text: '...' }

// AFTER:
{ path: '/programs/long/registration', text: '...' }
```

Should be handled by bulk replace, but verify the file.

---

#### 3.2 Dashboard Routes

**File**: `dashboard/src/routing/long-term-programs-dashboard.routes.ts`

**Before**:
```typescript
{
  path: '/long-term-programs/...',
  text: '...'
}
```

**After**:
```typescript
{
  path: '/programs/long/...',
  text: '...'
}
```

---

#### 3.3 Dashboard Menu

**File**: `dashboard/src/menu/long-term-programs.menu.ts`

Check for any hardcoded paths in menu items:
```typescript
// Update any paths from
{ path: '/long-term-programs/...' }
// to
{ path: '/programs/long/...' }
```

---

#### 3.4 Dashboard Items

**File**: `dashboard/src/menu/dashboard.items.ts`

Update the long-term programs menu item:
```typescript
// BEFORE
{
  path: '/long-term-programs',
  // ...
}

// AFTER
{
  path: '/programs/long',
  // ...
}
```

---

### Step 4: Search for Router Navigate Calls (15 minutes)

**Search**:
```bash
grep -r "navigate.*long-term-programs" --include="*.ts" . | grep -v node_modules
```

**Update any found instances**:
```typescript
// BEFORE
this.router.navigate(['/long-term-programs/register-admission']);

// AFTER
this.router.navigate(['/programs/long/register-admission']);
```

---

### Step 5: Verify TypeScript Compilation (5 minutes)

```bash
npx tsc --noEmit --project apps/vet/tsconfig.app.json
```

**Expected**: ✅ No compilation errors

---

### Step 6: Test All Flows (30 minutes)

#### Manual Testing Checklist

**Long-Term Programs - Public Access**:
- [ ] Navigate to `/long-term-programs/register-admission` → should redirect to `/programs/long/register-admission`
- [ ] Navigate to `/long-term-programs/update-admission/123` → should redirect to `/programs/long/update-admission/123`

**Long-Term Programs - Authenticated**:
- [ ] Login as user
- [ ] Navigate to dashboard
- [ ] Click on long-term programs link → should go to `/programs/long/*`
- [ ] Register admission flow works
- [ ] Update admission flow works
- [ ] View admission flow works
- [ ] Exam card page works
- [ ] Last choose works
- [ ] Last result works

**Breadcrumbs**:
- [ ] All breadcrumbs show correct paths (no `/long-term-programs/` visible)
- [ ] Breadcrumb links navigate correctly

**Dashboard**:
- [ ] Dashboard sidebar shows long-term programs
- [ ] Clicking dashboard long-term programs link navigates correctly
- [ ] Long-term programs submenu items work

---

### Step 7: Update Documentation (10 minutes)

Update any documentation mentioning `/long-term-programs/`:
- API documentation
- User guides
- Developer onboarding docs
- README files

---

## Files to Modify (Estimated)

### Critical Files (Must Change)
1. ✅ `apps/vet/src/app/app.routes.ts` - Route configuration
2. ✅ `long-term-programs/src/long-term-program.routes.ts` - Breadcrumbs
3. ✅ `dashboard/src/routing/long-term-programs-dashboard.routes.ts` - Dashboard routes
4. ✅ `dashboard/src/menu/long-term-programs.menu.ts` - Menu items
5. ✅ `dashboard/src/menu/dashboard.items.ts` - Main menu

### Likely Files (Bulk Replace Should Handle)
6. Various route files with breadcrumb references
7. Components with navigation calls
8. Test files (if any reference the path)

**Total Estimated**: 15-25 files

---

## Rollback Plan

If issues arise:

### Option 1: Git Revert
```bash
git log --oneline | head -5  # Find commit
git revert <commit-hash>
```

### Option 2: Manual Rollback
```bash
# Reverse the sed command
find . -name "*.ts" -type f -not -path "*/node_modules/*" -not -name "*.spec.ts" -exec sed -i '' 's|/programs/long/|/long-term-programs/|g' {} +

# Restore app.routes.ts
git checkout HEAD -- apps/vet/src/app/app.routes.ts
```

---

## Validation Commands

### Find Remaining Old References
```bash
# Should return 0 results after migration
grep -r "/long-term-programs/" --include="*.ts" . | grep -v node_modules | grep -v ".spec.ts" | grep -v "IMPLEMENT_PROGRAMS"
```

### Verify Redirect Works
```bash
# Start dev server
npx nx serve vet

# Test in browser
# Visit: http://localhost:4200/long-term-programs/register-admission
# Should redirect to: http://localhost:4200/programs/long/register-admission
```

### Type Check
```bash
npx tsc --noEmit --project apps/vet/tsconfig.app.json
# Expected: 0 errors
```

---

## Expected Outcomes

### ✅ Success Criteria

1. **URL Structure**:
   - All long-term program routes accessible at `/programs/long/*`
   - Old URLs (`/long-term-programs/*`) redirect to new URLs

2. **Navigation**:
   - Dashboard links navigate to new paths
   - Breadcrumbs show new paths
   - No broken links

3. **Functionality**:
   - All user flows work (register, update, view)
   - Guards work correctly
   - Forms submit successfully

4. **Code Quality**:
   - TypeScript compiles without errors
   - No console errors in browser
   - No 404s in network tab

---

## Post-Migration Tasks

### 1. Communicate Changes

**To Frontend Team**:
- URL structure changed for long-term programs
- Old URLs redirect automatically
- Update any hardcoded paths in local branches

**To Backend Team**:
- No API changes required
- Frontend URL structure changed

**To QA Team**:
- Update test scripts with new URLs
- Test all long-term program flows
- Verify redirects work

### 2. Update External References

- [ ] Update any external documentation
- [ ] Update email templates with links
- [ ] Update marketing materials
- [ ] Update help desk documentation

### 3. Monitor After Deployment

- [ ] Check server logs for 404s on old paths
- [ ] Monitor redirect traffic
- [ ] Watch for user reports of broken links

---

## Automation Script (Optional)

**File**: `migrate-long-term-programs.sh`

```bash
#!/bin/bash

echo "Migrating long-term-programs to /programs/long..."

# Backup
echo "Creating backup branch..."
git checkout -b backup/before-long-term-migration

# Return to working branch
git checkout develop

# Find all occurrences
echo "Finding references..."
grep -r "/long-term-programs/" --include="*.ts" . | grep -v node_modules | grep -v ".spec.ts" | wc -l

# Prompt for confirmation
read -p "Proceed with replacement? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Aborted."
    exit 1
fi

# Replace
echo "Replacing paths..."
find . -name "*.ts" -type f -not -path "*/node_modules/*" -not -name "*.spec.ts" -exec sed -i '' 's|/long-term-programs/|/programs/long/|g' {} +

echo "Verifying changes..."
grep -r "/long-term-programs/" --include="*.ts" . | grep -v node_modules | grep -v ".spec.ts" | grep -v "migrate-long-term" | wc -l

echo "Done! Please:"
echo "1. Manually update app.routes.ts"
echo "2. Add redirect rule"
echo "3. Test the application"
echo "4. Commit changes"
```

---

## Commit Message Template

```
refactor(routes): move long-term programs to /programs/long hierarchy

BREAKING CHANGE: Long-term program URLs have changed

Before:
- /long-term-programs/register-admission
- /long-term-programs/update-admission/:id
- /long-term-programs/view-admission/:id
- /long-term-programs/exam-card/:pid
- /long-term-programs/last-choose/:id
- /long-term-programs/last-result/:id

After:
- /programs/long/register-admission
- /programs/long/update-admission/:id
- /programs/long/view-admission/:id
- /programs/long/exam-card/:pid
- /programs/long/last-choose/:id
- /programs/long/last-result/:id

Redirects added from old paths to maintain backward compatibility.

Changes:
- Moved long-term route under /programs hierarchy in app.routes.ts
- Updated all breadcrumb references
- Updated dashboard menu links
- Added redirect rule for old URLs
- Updated XX files with path references

Testing:
- ✅ All long-term program flows tested
- ✅ Redirects verified
- ✅ Breadcrumbs correct
- ✅ Dashboard navigation works
- ✅ Type checking passes

Related: PROGRAMS_ROUTING_ANALYSIS.md
```

---

## Timeline

| Task | Time | Running Total |
|------|------|---------------|
| Update app.routes.ts | 5 min | 5 min |
| Bulk path replacement | 30 min | 35 min |
| Manual verification | 15 min | 50 min |
| Type checking | 5 min | 55 min |
| Manual testing | 30 min | 85 min |
| Documentation update | 10 min | 95 min |
| **Total** | **~2 hours** | |

---

## Ready to Implement?

All analysis complete. Proceed with implementation steps above.

**Next Action**: Execute Step 1 (Update app.routes.ts)
