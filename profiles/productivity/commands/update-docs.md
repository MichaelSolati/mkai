# Documentation Update Command: Update Project Documentation

## Documentation Discovery

1. Scan the project for existing documentation:
   - Check for `README.md`, `CLAUDE.md`, `docs/` directory, `specs/` directory, and any other markdown files
   - Identify the documentation structure and conventions used in this project
   - Note which documentation files exist and what they cover

2. Analyze recent code changes:
   - Review recent git commits to understand what has changed
   - Identify new features, modified APIs, changed configurations, or removed functionality
   - Cross-reference code changes against existing documentation to find gaps

## Documentation Analysis

1. Identify what is out of date:
   - API documentation that no longer matches implementation
   - README instructions that reference removed or renamed files/commands
   - Architecture docs that describe a previous design
   - Configuration examples with outdated options or defaults
   - Setup/install instructions that skip new dependencies or steps

2. Identify what is missing:
   - New features or modules with no documentation
   - Changed behavior that is not reflected in docs
   - New environment variables, config options, or CLI flags

## Documentation Updates

1. Update each affected documentation file:
   - Correct outdated information to match current implementation
   - Add documentation for new features or changes
   - Remove references to deleted functionality
   - Update code examples and configuration snippets
   - Ensure setup/install instructions are current

2. Maintain consistent style:
   - Follow the existing documentation conventions in the project
   - Use consistent heading levels, formatting, and tone
   - Preserve the existing structure where possible

## Guidelines

- Only update documentation files that already exist - do NOT create new documentation files unless explicitly asked
- Preserve the project's existing documentation style and structure
- Focus on accuracy - ensure docs reflect the actual current implementation
- Include practical examples where the existing docs use them
- Do not add speculative or aspirational content - document what IS, not what might be

## Output

Provide a summary of documentation updates after completion:
1. Files updated
2. Key changes made to each file
3. Any documentation gaps that remain (things you could not resolve without more context)
