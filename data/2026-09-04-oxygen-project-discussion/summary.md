# Trajectory summary

This trajectory refined Oxygen's contributor workflow and evaluation plan by defining a smaller process for generation, human review, and export, identifying context-preservation and redaction constraints, and framing longitudinal personalized Insight prediction as the initial scalable evaluation. Downstream task evaluation and trajectory-derived benchmarks remain possible extensions, with reproducibility, topic comparability, annotation cost, and multiple valid Insights unresolved.

# Summary groups

## G001

Lines: L001-L010

The meeting reviewed a reduced Oxygen workflow for coding-agent sessions and meeting transcripts. The workflow preserves detailed project evidence in a line-level Summary, separates generated Insights, adds redaction and human review, and requires further testing and improved readability.

## G002

Lines: L011-L016

Pipeline trials exposed context omissions, variable runtime, summaries centered on Agent actions, limited human verification, and excessive removal of technical detail during redaction. Summary and Insight generation occurs jointly before the dependency-preserving redaction pass.

## G003

Lines: L017-L023

Participants considered human-reviewed Insight agreement and downstream task performance as evaluation targets. Manling favored extrinsic evaluation under a fixed learning budget, while mixed human-Agent behavior and limited labeling capacity made success-rate measurement difficult.

## G004

Lines: L024-L031

A contributor-specific sequential prediction evaluation emerged from the discussion, using earlier approved Summary-Insight pairs to predict later Insights. Exact downstream replay remained operationally difficult because retained trajectories lack live environments, and the available personalized data may be insufficient for gains on general benchmarks.

## G005

Lines: L032-L039

The evaluation target expanded to include cross-task operating knowledge, contributor preferences, domain knowledge, and task-specific knowledge. This mixture may support personalized held-out evaluation, while multiple valid Insights require evaluation methods that accept alternative annotations.

## G006

Lines: L040-L047

The proposed initial evaluation uses each contributor's chronological 80/20 split, with topic comparability and preference stability requiring empirical validation. Trajectory-derived benchmarks remain a later option, and Oxygen's broader research value was identified as a longitudinal dataset of repeated interactions from the same contributors. The meeting output was selected for immediate multi-perspective review.

# Summary lines

L001 Zihan opened the meeting to consolidate recent Oxygen progress and introduced a new contributor who would participate in project design and development.
L002 Zihan said the earlier contributor workflow tried to cover too many operations, took too long in practice, and had therefore been reduced to a much smaller toolkit and review interface.
L003 Zihan described the current input scope as either coding-agent sessions or multi-person meeting transcripts, with output consisting of a line-by-line Summary and evidence-linked AI Insights.
L004 Zihan said the current pipeline first applies a deterministic tool to condense a session and then uses a project-specific prompt to generate `summary.md` and `insight.md`; recent trials took roughly two to three minutes per trajectory and could run in parallel.
L005 Zihan explained that ordinary coding-agent handoff summaries optimize for continuation of the coding task, whereas Oxygen needs to retain information for later learning and analysis.
L006 Zihan said the prompt deliberately separates an insight-neutral Summary from Insights because earlier models put conclusions directly into the Summary and then merely repeated them as Insights.
L007 Zihan emphasized preserving participant intent and actions, state transitions, intermediate attempts, failures, fixes, negative evidence, repeated friction, disagreement, uncertainty, decision rationale, and material technical evidence rather than only the final outcome.
L008 Zihan noted that the current outputs could still expose sensitive information and proposed an explicit redaction stage while retaining project-relevant generic information.
L009 Zihan said the simplified workflow was intended to scale: contributors would quickly review the AI output against their own project understanding, edit it if necessary, and export the approved result.
L010 Zihan proposed more internal testing and another collaborator trial before broader distribution, while noting that readability of transcript-derived summaries still needed improvement.
L011 Zidi cautioned that the fastest trials exposed the model mainly to prior compacted context, recent user-agent interaction, and tool output, so they could omit important service or environment information and remain noisy.
L012 Zidi reported that the full pipeline stripped a complete trajectory, generated the Summary and Insights, and then redacted them; one trajectory took about ten minutes rather than two, and scaling behavior remained unknown.
L013 Zidi observed that processing the complete trajectory with a separate model made the Agent, rather than the User, the subject of much of the story.
L014 Zidi argued that a human annotator may be unable to verify many Agent experiments and may only be able to judge whether those experiments imply useful future instructions.
L015 Zidi found the current redaction too aggressive because it removed useful technical names and generalized the account, even though the overall storyline and length were largely preserved.
L016 Zidi clarified that unredacted Summary and Insights are generated together from the trajectory, after which a redaction pass jointly transforms the previous Summary and Insights while maintaining their dependency.
L017 Zihan initially proposed evaluating a continual-learning system by comparing its generated Insights with human-reviewed Insights, including agreement and correctness of evidence references.
L018 Zidi questioned what a continual learner would learn from an isolated Summary-to-Insight task and characterized that operation as only one subset of instruction or note-taking behavior.
L019 Zihan said evaluation through actual downstream tasks had been considered, including possible collaboration on an agent benchmark, but reproducing a full downstream task internally could create a long and heavy evaluation cycle.
L020 Yuxiang recalled an earlier plan to generate questions from trajectories, collect human answers as a benchmark, and apply continual learning, but said that stage had not yet been implemented.
L021 Manling proposed that the Insights might be more relevant to recursive self-improvement if they improved the Agent's ability to teach itself: under the same budget, learned knowledge should produce a larger gain in success rate on a subsequent round.
L022 Zidi identified measurement of success rate as a central difficulty because the data mixes human and Agent behavior while human labeling effort is limited.
L023 Manling distinguished intrinsic evaluation by human judgment from extrinsic evaluation through downstream tasks and argued that extrinsic evaluation would better demonstrate whether an Insight has practical value under a fixed learning budget.
L024 Zihan proposed an intrinsic alternative in which a continual learner reads trajectories sequentially, generates Insights in the same format, and is compared with human-reviewed Insights using measures such as precision and recall.
L025 Zidi proposed splitting each contributor's data into training and test portions: training would expose both Summaries and human-approved Insights so the model could learn what that person finds useful, while testing would provide new Summaries and compare the generated Insights with the contributor's held-out annotations.
L026 Zihan and Zidi agreed that this formulation resembled teacher forcing, avoided exposing held-out answers, supplied substantial prior context about human preferences, and offered a natural evaluation of transfer to later trajectories.
L027 Zidi warned that exact downstream replay would be difficult because contributors' projects and environments differ, critical functionality may not appear in the textual trajectories, and many tasks are not transferable to a common benchmark.
L028 Zidi cited prior work in which large-scale real user-agent interactions improved a coding agent on a general benchmark, but Zidi doubted that Oxygen's smaller personalized dataset would support the same kind of result.
L029 Manling asked why a trajectory's Insights could not be evaluated on a held-out task from the same domain, with intrinsic quality measured against alternative acceptable annotations and extrinsic value measured by improvement in the task's final status.
L030 Zihan explained that Oxygen often retains only an offline textual trajectory, not the live environment needed to produce new observations; replaying a different action in a file system, cloud drive, or server would therefore be impossible or operationally heavy.
L031 Manling accepted that the retained trajectory could not simply be rerun and revised her earlier assumption that every collected trajectory naturally came with a reproducible downstream success measure.
L032 Zihan suggested that a contributor might instead recommend a suitable existing benchmark on which the Agent's capability had improved, while acknowledging that this would yield only limited eligible data.
L033 Zidi argued that the Insights most helpful to a contributor may be cross-task operational knowledge, such as actions the Agent should avoid in that person's environment, rather than knowledge for one specific downstream task; a task benchmark would measure only one facet of usefulness.
L034 Zihan reframed the objective using research labs: the key question is not only whether every lab reaches a common benchmark score, but whether the system captures what each lab wanted its Agent to learn along that lab's chosen path and makes later work smoother.
L035 Manling distinguished task-dependent expert knowledge from task-independent but user-dependent preferences and asked which of these Oxygen intends to learn, because the distinction changes how held-out tasks and Insights should be constructed.
L036 Zihan argued that contributor annotation will inevitably encode personal priorities, because people notice and approve what matters to them; Zihan treated this preference signal as part of the product value and as a motivation for contributors who want their own Agents to improve.
L037 Zihan said a personalized held-out evaluation could still reveal domain-learning ability: a stronger learner should infer both the contributor's preferences and meaningful knowledge in the contributor's domain.
L038 Zidi agreed that Insights are a mixture of human preferences, domain knowledge, and task-specific knowledge, and suggested that learning to identify useful information in a new expert structure is itself part of the capability under study.
L039 Manling warned that each contributor's mixture of knowledge and preference creates multiple valid alternative Insights, which may confuse a single reference-based quality metric unless the evaluation explicitly handles those alternatives.
L040 Zihan proposed evaluating each contributor independently by giving the Agent the first 80 percent of that contributor's chronologically ordered Summary-Insight pairs and asking it to predict the human-approved Insights for the final 20 percent, without mixing contributors.
L041 Yuxiang questioned whether the chronological split would be comparable when the first 80 percent and final 20 percent might concern entirely different topics.
L042 Zidi hypothesized that a contributor's strong personal preferences might remain stable across topics but said this assumption had to be tested empirically.
L043 Zihan and Zidi concluded that controlling tasks or hiring multiple groups to execute common checkpoints would require substantial annotation effort and would not scale as readily as collecting existing coding-agent trajectories.
L044 Yuxiang proposed first collecting a trajectory set, deriving a benchmark from that set, and then comparing continual-learning algorithms trained on either the extracted Insights or the original trajectories, avoiding the need to prebuild a benchmark and hire people to generate matching data.
L045 Zihan and Zidi responded that a trajectory-derived benchmark would require high-quality domain and preference understanding and might only become trustworthy after the system performs very well on intrinsic Insight prediction.
L046 Zidi argued that Oxygen's broader value is a longitudinal collection of interactions from the same humans, including their approved useful Insights, because personalization and user-modeling research generally lacks this kind of coherent interaction data.
L047 Zihan closed by proposing that this meeting transcript itself be processed and reviewed immediately, specifically asking the system to summarize Insights from the different participants' perspectives before expanding access beyond the initial trusted users.
