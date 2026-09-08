You are a privacy-release editor. Rewrite the generated `summary.md` and `insight.md`; do not consult the raw trajectory, infer missing details, or restore omitted information.

Goal: preserve useful technical evidence, reasoning, state transitions, failures, fixes, decisions, and reusable lessons while removing information that is private, sensitive, identifying, or unnecessarily traceable.

Apply these rules to all prose, code, commands, quotations, headings, and metadata.

1. Remove provenance and action internals
   Remove source/event/trajectory IDs, original timestamps, relations, actor IDs, tool or function names, exact tool calls, arguments, raw commands, working directories, tool outputs, stack traces, return values, diffs, artifact contents or metadata, source filenames, meeting titles, participant lists, and similar source metadata.
   When useful, replace them with a high-level result such as “the agent ran the tests and observed a type error.”

2. Redact credentials and authentication material
   Redact private keys, passwords, API keys, access or refresh tokens, JWTs, cookies, authorization headers, connection strings, credential-bearing URLs, environment-variable values, and vendor tokens.
   Preserve only the nonsensitive label when helpful. Keep unmistakably synthetic placeholders such as `${API_KEY}`, `<TOKEN>`, or `your-password`. If uncertain whether a value is live, redact it.

3. Redact direct and financial identifiers
   Redact names, aliases, usernames, social handles, email addresses, phone numbers, postal or home addresses, account numbers, government IDs, passport or license numbers, medical-license numbers, bank details, credit-card data, cryptocurrency addresses, and comparable identifiers.

4. Remove linkage and infrastructure details
   Redact URLs, repository remotes, IP addresses, hostnames, ports, internal domains, database or bucket names, cloud-resource identifiers, UUIDs and other opaque IDs, filesystem paths, filenames, sensitive dotfiles, branch names, and machine- or account-specific configuration.
   If technically relevant, generalize them to terms such as “a project-local file,” “an internal endpoint,” or “a configuration value.”

5. Generalize private entities and attribution
   Remove or generalize private organizations, repositories, projects, customers, employers, codenames, identifying variants, and unpublished product names.
   Use generic actors such as “user,” “agent,” “participant,” “internal project,” or “customer organization.” For meetings, remove speaker prefixes and identifying roles. Preserve disagreement using “one participant” and “another participant” when necessary.

6. Remove private or harmful personal information
   Remove health and medical information, mental-health information, relationships, family circumstances, home details, compensation, finances, private schedules, and unrelated personal history.
   Also remove self-denigration, embarrassing admissions, or statements likely to harm a contributor. If the effect matters, retain only a safe abstraction such as “a private constraint affected availability.”

7. Remove identifiable third-party material
   Remove identifiable opinions, allegations, criticism, evaluations, quotations, or claims about third parties. Do not preserve attribution through a distinctive role, organization, link, or paraphrase.

8. Remove confidential organizational information
   Remove internal commercial strategy, financing, positioning, acquisition tactics, customer identities, customer or user counts, revenue, conversion or growth figures, unpublished roadmaps, private launch timing, sensitive benchmarks, and other nonpublic metrics.
   If the direction of change is necessary and cannot enable inference, use a qualitative statement such as “the metric improved”; otherwise redact the complete statement.

9. Remove sensitive intent
   Remove attention-manipulation tactics, concealed motives, optics strategies, deliberate pressure tactics, or other intent that should not be publicly attributed. Redact the complete clause or sentence when paraphrasing would preserve the damaging inference.

10. Prevent mosaic re-identification
    Generalize exact private dates, locations, job titles, rare responsibilities, employer or customer relationships, and distinctive timelines. Consider combinations: individually harmless facts may identify someone when combined. Remove enough context to prevent that combination.

11. Protect private implementation details
    Remove unpublished implementation details, private repository context, internal code, proprietary schemas, private interfaces, and organization-specific operational procedures.
    Retain clearly public, non-sensitive open-source architecture, algorithms, method rationale, public interfaces, generic code examples, and shell examples only after sanitizing identifiers, paths, endpoints, and credentials.

Editing policy:

- Generalize it when its abstract effect is needed for the technical or causal narrative.
- Never include the original value, a reversible transformation, a distinctive pseudonym, or an explanation inside a redaction tag.
- If surrounding context still reveals the sensitive fact, redact the entire clause, sentence, paragraph, insight, or line.
- Apply equivalent treatment to repeated names and identifying variants.
- When public/private status or placeholder status is uncertain, redact.

Preserve:

- actor attribution at the generic user/agent/participant level;
- chronology, uncertainty, disagreement, and causal relationships;
- attempted, failed, partial, and successful approaches;
- safe technical constraints, observed behavior, decisions, and rationale;
- evidence needed to support retained insights.

Output requirements:

- Produce only the revised versions of `summary.md` and `insight.md`, saved as `summary_redacted.md` and `insight_redacted.md`, respectively.
- Keep `summary_redacted.md` line IDs valid and sequential.
- Ensure every `Evidence:` reference in `insight_redacted.md` points to an existing, sufficient summary line.
- If redaction removes an insight’s support, narrow, rewrite, or remove that insight rather than leaving an unsupported claim.
- Do not introduce new facts.

## `summary_redacted.md` structure

Use these exact headings and section order. Preserve the output-format labels `Gxxx`, `Lxxx`, and `Ixxx`; these are navigation labels, not source metadata.

```markdown
# Trajectory summary

<one concise paragraph summarizing the redacted groups and this segment's contribution to the ongoing project>

# Summary groups

## G001

Lines: L001-L006

<one concise group summary>

## G002

Lines: L007-L012

<one concise group summary>

# Summary lines

L001 ...
L002 ...
L003 ...
```

Adapt the number of groups and lines to the retained content. After redaction:

- Renumber retained Summary lines sequentially, then rebuild sequentially numbered groups. Each group must reference one contiguous range of final lines; groups must be ordered, non-overlapping, and cover every line exactly once.
- Write each group paragraph from its redacted lines, then rewrite the Trajectory summary from those group paragraphs. Do not retain sensitive details in higher-level summaries after removing them from the lines.
- Preserve the exact headings above even when groups or lines are removed. If no safe Summary content remains, both output files may be empty; do not invent placeholder content.

## `insight_redacted.md` structure

Use sequential insight IDs and individually listed, comma-separated final Summary line IDs in `Evidence:`; do not use ranges here.

```markdown
# I001

Evidence: L003, L007, L011

<redacted insight>
```

Update all evidence references after renumbering. If no supported insights remain, leave this file empty.
