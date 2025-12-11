#!/usr/bin/env python3
"""
Migrate imports from @vet/shared to secondary entry points
"""
import re
import sys
from pathlib import Path
from typing import Dict, List, Set

# Categorize imports by their secondary entry point
ICON_IMPORTS = {'vetIcons', 'VetIcon'}
HEAVY_COMPONENT_IMPORTS = {
    'BreadcrumbComponent', 'DialogComponent', 'DatePickerComponent',
    'ResponsiveStepperComponent', 'SelectorComponent',
    'EducationStandartsComponent', 'MapComponent', 'FileUploadComponent'
}
UI_COMPONENT_IMPORTS = {
    'ButtonComponent', 'InputComponent', 'CheckboxComponent', 'SwitchComponent',
    'IconComponent', 'IconButtonComponent', 'InfoComponent', 'DividerComponent',
    'ComponentOutletComponent', 'ExpandableSidebarComponent',
    'ExpandableSidebarMenuComponent', 'RouterExpandableSidebarMenuComponent',
    'NavbarComponent', 'NavbarLogoDirective'
}
DIALOG_IMPORTS = {
    'AlertDialogOutletComponent', 'ConfirmationDialogOutletComponent',
    'DialogOutletComponent', 'SingleDialogOutletComponent',
    'AlertDialogService', 'ConfirmationDialogService', 'AppDialogService',
    'useAlert', 'useConfirm'
}
SERVICE_IMPORTS = {
    'ToastService', 'ReloadService', 'RouteParamsService',
    'LocalStorageService', 'LocalStoredStateService', 'Reloader', 'ThemeService'
}
PIPE_IMPORTS = {
    'DateDiffPipe', 'FormatDatePipe', 'FormatDateTimePipe', 'FormatDateStringPipe',
    'UploadedFileUriPipe', 'TransPipe', 'SanitizePipe'
}
VALIDATOR_IMPORTS = {
    'customPatternValidator', 'georgianLettersValidator', 'englishLettersValidator',
    'mobileNumberValidator', 'personalNumberValidator', 'numericValidator',
    'scorePatternValidator', 'georgianMobileValidator'
}

def categorize_import(name: str) -> str:
    """Determine which secondary entry point an import belongs to"""
    if name in ICON_IMPORTS:
        return '@vet/shared/icons'
    elif name in HEAVY_COMPONENT_IMPORTS:
        return '@vet/shared/heavy-components'
    elif name in UI_COMPONENT_IMPORTS:
        return '@vet/shared/ui-components'
    elif name in DIALOG_IMPORTS:
        return '@vet/shared/dialogs'
    elif name in SERVICE_IMPORTS:
        return '@vet/shared/services'
    elif name in PIPE_IMPORTS:
        return '@vet/shared/pipes'
    elif name in VALIDATOR_IMPORTS:
        return '@vet/shared/validators'
    else:
        return '@vet/shared'  # Keep in main shared for now

def parse_import_line(line: str) -> tuple:
    """Parse an import line and extract imported names"""
    # Match: import { names } from '@vet/shared'
    match = re.search(r"import\s+\{([^}]+)\}\s+from\s+['\"]@vet/shared['\"]", line)
    if not match:
        return None, []

    imports_str = match.group(1)
    # Split by comma and clean up
    imports = [item.strip() for item in imports_str.split(',')]

    # Handle 'X as Y' imports
    parsed_imports = []
    for imp in imports:
        if ' as ' in imp:
            original, alias = imp.split(' as ')
            parsed_imports.append((original.strip(), alias.strip()))
        else:
            parsed_imports.append((imp, None))

    return line, parsed_imports

def generate_new_imports(imports: List[tuple]) -> Dict[str, List[tuple]]:
    """Group imports by their target secondary entry point"""
    grouped = {}
    for name, alias in imports:
        target = categorize_import(name)
        if target not in grouped:
            grouped[target] = []
        grouped[target].append((name, alias))
    return grouped

def format_import_line(target: str, imports: List[tuple]) -> str:
    """Format a new import line"""
    import_list = []
    for name, alias in imports:
        if alias:
            import_list.append(f"{name} as {alias}")
        else:
            import_list.append(name)

    imports_str = ', '.join(import_list)
    return f"import {{ {imports_str} }} from '{target}';"

def migrate_file(file_path: Path) -> bool:
    """Migrate a single file's imports"""
    try:
        content = file_path.read_text()
        lines = content.split('\n')
        new_lines = []
        modified = False

        for line in lines:
            if "from '@vet/shared'" in line and 'import {' in line:
                original_line, imports = parse_import_line(line)
                if imports:
                    grouped = generate_new_imports(imports)

                    # If all imports stay in @vet/shared, keep original
                    if len(grouped) == 1 and '@vet/shared' in grouped:
                        new_lines.append(line)
                    else:
                        # Generate new import lines
                        for target in sorted(grouped.keys()):
                            if target == '@vet/shared' and len(grouped) > 1:
                                # Mixed imports - keep remaining in @vet/shared
                                new_line = format_import_line(target, grouped[target])
                                new_lines.append(new_line)
                            else:
                                new_line = format_import_line(target, grouped[target])
                                new_lines.append(new_line)
                        modified = True
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)

        if modified:
            file_path.write_text('\n'.join(new_lines))
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}", file=sys.stderr)
        return False

def main():
    # Find all TypeScript files
    root = Path('.')
    ts_files = []

    for pattern in ['**/*.ts', '**/*.tsx']:
        for file in root.glob(pattern):
            # Skip node_modules, specs, and generated files
            if ('node_modules' not in str(file) and
                '.spec.ts' not in str(file) and
                'backend/src/lib/generated' not in str(file) and
                'REFACTORING_PLAN.md' not in str(file) and
                'PHASE_' not in str(file)):

                # Check if file imports from @vet/shared
                try:
                    content = file.read_text()
                    if "from '@vet/shared'" in content:
                        ts_files.append(file)
                except:
                    pass

    print(f"Found {len(ts_files)} files to migrate")

    migrated = 0
    for file in ts_files:
        if migrate_file(file):
            migrated += 1
            print(f"✓ {file}")

    print(f"\nMigrated {migrated} files")

if __name__ == '__main__':
    main()
