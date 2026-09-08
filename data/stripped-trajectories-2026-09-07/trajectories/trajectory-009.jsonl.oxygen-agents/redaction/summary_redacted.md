# Trajectory summary

This work created a lightweight local evaluation workflow, found and corrected a role-routing error that had made early results self-play and self-judged, and ran controlled evaluations with fixed auxiliary roles. It then designed a lower-assumption direct audit across several datasets and compared that audit with existing evaluators and a simple profile-alignment baseline. The results showed weak instance-level validation for one original evaluator, moderate system-level validation for a style evaluator, substantial judge sensitivity, limited score resolution, strong source distinguishability, and possible over-personalization in one task family. Some evaluation coverage remained incomplete, and the final recommendation was to report audit components and directional diagnostics separately from any combined score.

# Summary lines

L001 The user requested a lightweight local evaluation using existing task logic and data without the original large training and inference stack.
L002 The agent reported building a resumable runner with isolated outputs and validating a full evaluation pass after repairing an initial batch-execution failure.
L003 The agent clarified that prompts, interaction loops, parsing, scoring, and reward calculations were reused, while heavyweight infrastructure was replaced by a remote-model runner.
L004 Several model routes completed, while others were blocked by provider policy or quota limits; paid routes were serialized or run in controlled parallel lanes.
L005 The agent discovered that a compatibility layer replaced every auxiliary model with the evaluated model, causing early simulated conversations and judgments to use the target model itself.
L006 The agent explained that this could affect every interaction and score, and that rejudging alone could not repair conversations already generated under the wrong roles.
L007 The user required distinct target, judge, assistant, and document-generation roles under a fixed auxiliary model.
L008 The agent reported implementing independent role controls, reusing saved responses only where judge-only reruns were valid, regenerating affected conversations, and passing routing preflights before isolated reruns.
L009 The two evaluation families used materially different protocols: one scored single-turn responses on alignment dimensions, while the other scored multi-turn interactions and generated artifacts using several components.
L010 The agent built reusable analysis and anonymous comparative evaluation covering token use, turns, aggregate performance, pairwise results, tie handling, and candidate-position effects.
L011 A preflight produced all ties because a comparator read reference data from the wrong structural level; the agent corrected the adapter and added a regression check before submission.
L012 Comparative results showed that similar mean scores can coexist with different top-rank frequencies because top-one scoring discards margins and requires simultaneous wins over multiple rivals.
L013 Some judgments failed when candidate identifiers were confused with realistic content; incomplete results were retained separately rather than silently imputed.
L014 The user and agent defined a direct audit as an independent diagnostic rather than ground truth and fixed its scope, anonymity, sanitization, recoding, comparison histories, component structure, support policy, and statistical endpoints before implementation.
L015 The audit compared multiple non-chat and interaction datasets, reused existing trajectories, hid system identities, and converted presentation-specific decisions into canonical directions.
L016 The design required common successful support, no imputation, fixed randomization, dataset-equal weighting, paired uncertainty analysis, rank and pairwise measures, order-reversal diagnostics, and separate reports for each judge.
L017 A small smoke test was required to check prompt leakage, parsing, recoding, cost, batching, and recovery behavior before a full run.
L018 The smoke test exposed identifier-transcription failures; short batch-local labels fixed the issue, and only unresolved work was resumed.
L019 Smoke results showed substantial presentation-order and judge sensitivity as well as disagreement between the direct audit and an existing absolute style evaluator, so the small-sample rankings were treated as operational observations.
L020 The user then simplified the full design to fewer comparison histories and a deterministic randomized order; one judge completed all work while another retained a small unresolved subset without imputation.
L021 Across the shared systems, two leading systems were nearly tied and another was slightly behind, while the placement of an additional system depended on the judge.
L022 The audit judges agreed moderately on one task family and weakly on the other, establishing different reliability limits for comparisons against existing evaluators.
L023 One original alignment evaluator showed weak convergent validity against the audit, and removing its length penalty did not materially change that conclusion.
L024 A simple profile-alignment baseline improved several agreement measures but remained modest and performed poorly on one domain.
L025 An existing interaction-style score had moderate dataset-and-system-level agreement with the audit, but target-level agreement remained weak and judge-dependent.
L026 Instance-level analysis showed that within-system correlation and same-example system-gap correlation differed sharply: an evaluator could weakly track easier examples while failing to identify which system was relatively better on the same example.
L027 Combined audit scores were highly concentrated, creating many same-example ties and reducing ranking resolution.
L028 The dominant tied pattern combined equal measured specificity with strong source distinguishability; excluding tied cases did not materially improve the original evaluator's system-gap correlation.
L029 Component analysis suggested that most of the simple baseline's improvement came from user specificity rather than source detection.
L030 Directional analysis showed that judges usually recognized the real response, that adding history changed simulator-fooling rates for one judge, and that generated responses in one task family appeared more explicitly profile-specific than real responses. This motivated separate reporting of signed specificity and directional source judgments.
