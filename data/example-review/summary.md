L001 User asked the agent to make provider failures visible without blocking successful results.
L002 The initial implementation failed the entire lookup when one provider timed out.
L003 Agent changed aggregation to preserve successful offers and attach provider-level warnings.
L004 Integration tests confirmed that successful offers remained available during one provider timeout.
