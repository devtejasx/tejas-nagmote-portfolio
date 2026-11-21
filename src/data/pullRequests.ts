// Generated from `gh search prs --author devtejasx --merged`: every PR merged
// into an external repository as of 2026-11-14 (own repos and coursework are
// left out). Every number below resolves to https://github.com/<repo>/pull/<number>.

export interface MergedPullRequest {
  number: number
  title: string
  mergedAt: string
}

export const mergedPullRequests: Record<string, MergedPullRequest[]> = {
  'ng-log/ng-log': [
    {
      number: 38,
      title: 'fix: omit default format line from header with custom prefix formatter',
      mergedAt: '2026-07-16',
    },
    {
      number: 36,
      title: 'fix: log cleaner on Windows for non-ASCII log directories',
      mergedAt: '2026-07-17',
    },
    {
      number: 45,
      title: 'fix(signalhandler): restore LWP id in signal dumps on Linux',
      mergedAt: '2026-07-17',
    },
    {
      number: 47,
      title: 'fix(cmake): use ng-log version variable in config version guard',
      mergedAt: '2026-07-17',
    },
    { number: 46, title: 'docs: fix typos in comments and documentation', mergedAt: '2026-07-17' },
    {
      number: 44,
      title: 'fix: report sub-hour UTC offsets from LogMessageTime::gmtoffset',
      mergedAt: '2026-07-18',
    },
    {
      number: 48,
      title: 'fix: cap oversized max_log_size instead of shrinking it to 1 MB',
      mergedAt: '2026-07-18',
    },
    {
      number: 52,
      title: 'test: avoid undefined behavior in IsLoggingPrefix character checks',
      mergedAt: '2026-07-27',
    },
    {
      number: 51,
      title: 'test: make missing-capture diagnostics reachable',
      mergedAt: '2026-07-27',
    },
    {
      number: 37,
      title: 'fix: data race between EnableLogCleaner and logging threads',
      mergedAt: '2026-08-04',
    },
    { number: 35, title: 'fix: honor logbuflevel when logging to stdout', mergedAt: '2026-08-05' },
    {
      number: 61,
      title:
        'fix(demangle): accept structor variants, default argument scopes and std-qualified unresolved names',
      mergedAt: '2026-08-21',
    },
    {
      number: 63,
      title: 'fix: say when a stack trace is cut off at the depth limit',
      mergedAt: '2026-10-21',
    },
  ],
  'google/benchmark': [
    {
      number: 2245,
      title: 'Make --benchmark_list_tests respect --benchmark_format',
      mergedAt: '2026-07-16',
    },
    {
      number: 2265,
      title: 'Fix use-after-free in CreateDefaultDisplayReporter (#2240)',
      mergedAt: '2026-08-03',
    },
    {
      number: 2276,
      title: 'Exclude setup/teardown from the MemoryManager measurement window (#2149)',
      mergedAt: '2026-08-03',
    },
    {
      number: 2264,
      title: 'Replace offsetof cache-line check with a well-defined runtime check (#1877)',
      mergedAt: '2026-09-14',
    },
    {
      number: 2275,
      title: 'Detect thread safety attribute support in mutex.h (#2263)',
      mergedAt: '2026-09-15',
    },
    {
      number: 2274,
      title: 'Diagnose invalid PauseTiming()/ResumeTiming() calls (#2235)',
      mergedAt: '2026-09-21',
    },
    {
      number: 2291,
      title: 'Support DoNotOptimize on types with const members (#1997)',
      mergedAt: '2026-10-13',
    },
  ],
  'ThePhrozenKeep/D2MOO': [
    {
      number: 228,
      title: 'Fix incorrect logic in ACT1Q2_Callback03_ChangedLevel',
      mergedAt: '2026-07-29',
    },
    {
      number: 234,
      title: 'ci: fix the clang-tidy lookup broken by the VS 2026 runner image',
      mergedAt: '2026-09-07',
    },
    {
      number: 232,
      title: "Fix quest log flags being OR'd instead of byte-assigned",
      mergedAt: '2026-09-07',
    },
    {
      number: 238,
      title: 'Fix character progression extraction in PLRSAVE2_CheckPlayerFlags',
      mergedAt: '2026-09-15',
    },
    {
      number: 236,
      title: 'Fix ACT1Q4_SetMonolithOrder skipping a monolith on a collision',
      mergedAt: '2026-09-15',
    },
    {
      number: 237,
      title: "Type the game's 0x20 slot as D2ClientInfoStrc*",
      mergedAt: '2026-10-12',
    },
    {
      number: 239,
      title: 'Reject a mismatched scroll instead of exiting in sub_6FC49AE0',
      mergedAt: '2026-10-12',
    },
    {
      number: 240,
      title: 'Debugger: spawn monsters by id, and fix truncated UTF-8 names',
      mergedAt: '2026-10-13',
    },
  ],
  'grafana/grafana-pathfinder-app': [
    {
      number: 1687,
      title: 'fix(mcp): emit spec.manifest from the App Platform handoff descriptor',
      mergedAt: '2026-08-25',
    },
    {
      number: 1692,
      title: 'fix(recovery): let a complete manifest supply the starting location',
      mergedAt: '2026-08-26',
    },
    {
      number: 1686,
      title: 'fix(block-editor): stamp saves with the schema version the editor emits',
      mergedAt: '2026-08-27',
    },
    { number: 1995, title: 'chore: remove dead minimizedSidebar test ids', mergedAt: '2026-09-24' },
    {
      number: 2054,
      title: 'fix: exclude a path member when any candidate key fails normalization',
      mergedAt: '2026-10-05',
    },
    {
      number: 2081,
      title: 'fix: route clipboard copies through a helper that never throws',
      mergedAt: '2026-10-13',
    },
    {
      number: 2268,
      title:
        'fix(devtools): keep a selector only if cleaning leaves it matching the picked element',
      mergedAt: '2026-11-03',
    },
  ],
  'konflux-ci/coverport': [
    {
      number: 113,
      title: 'test(#110): add unit tests for coverage-jira-tasks URL helpers',
      mergedAt: '2026-09-15',
    },
  ],
  'micropython/micropython': [
    {
      number: 19709,
      title: 'esp32/boards/SEEED_XIAO_ESP32C5: Use 0x2000 as the flash offset.',
      mergedAt: '2026-09-16',
    },
  ],
  'stac-utils/pystac': [
    {
      number: 1804,
      title: 'fix: recursively convert values in PropertiesExtension._set_property',
      mergedAt: '2026-09-11',
    },
    { number: 1805, title: 'feat: add octet-stream and zip media types', mergedAt: '2026-10-01' },
  ],
  'kornia/kornia': [
    {
      number: 4839,
      title: 'fix(augmentation): keep the PlanckianJitter index sampler in float32',
      mergedAt: '2026-09-25',
    },
    {
      number: 5473,
      title: 'fix(augmentation)!: reject a mixed gate on shape-changing augmentations',
      mergedAt: '2026-10-06',
    },
  ],
}
