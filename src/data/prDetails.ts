// One-line problem and fix for each merged PR, paraphrased from the PR's own
// description on GitHub. Keys are "<owner>/<repo>#<number>".

export type PrKind =
  | 'Concurrency'
  | 'Memory safety'
  | 'Undefined behaviour'
  | 'Correctness'
  | 'Build & CI'
  | 'Testing'
  | 'Docs'

export interface PrDetail {
  kind: PrKind
  problem: string
  fix: string
}

export const prDetails: Record<string, PrDetail> = {
  // ng-log
  'ng-log/ng-log#37': {
    kind: 'Concurrency',
    problem:
      'EnableLogCleaner() and DisableLogCleaner() wrote a plain bool that every logging thread read concurrently: a data race, and so undefined behaviour. The cleaner also scanned log directories on the logging path.',
    fix: 'The cleaner now runs on its own thread, woken by a condition variable. Logging threads touch cleaner state only when they create a log file, under the cleaner’s mutex, and directory scans never block them.',
  },
  'ng-log/ng-log#38': {
    kind: 'Correctness',
    problem:
      'The log file header always advertised the default line format, even when the application had installed its own prefix formatter.',
    fix: 'Write the format line only when no custom prefix formatter is installed.',
  },
  'ng-log/ng-log#36': {
    kind: 'Correctness',
    problem:
      'On Windows, paths were converted with locale-dependent mbstowcs/wcstombs, so log directories with non-ASCII names were mangled and the log cleaner silently removed nothing.',
    fix: 'Convert with MultiByteToWideChar/WideCharToMultiByte on CP_ACP, which is locale-independent and matches the APIs that create the log files.',
  },
  'ng-log/ng-log#45': {
    kind: 'Correctness',
    problem:
      'After the glog → ng-log rename, signal dumps on Linux guarded the thread id behind a macro that no longer existed, so crash dumps lost the LWP field.',
    fix: 'Use NGLOG_OS_LINUX so the kernel thread id is printed again.',
  },
  'ng-log/ng-log#47': {
    kind: 'Build & CI',
    problem:
      'The installed CMake package config referenced an undefined glog variable in its version-check message, printing “CMake >= required” with no version.',
    fix: 'Reference ng-log_CMake_VERSION, the variable the check actually uses.',
  },
  'ng-log/ng-log#46': {
    kind: 'Docs',
    problem: 'Typos in code comments and in the flags documentation.',
    fix: 'Corrected them; comments and docs only, no functional change.',
  },
  'ng-log/ng-log#44': {
    kind: 'Correctness',
    problem:
      'LogMessageTime::gmtoffset() returns seconds but was computed in whole hours, so offsets such as India’s +05:30 were reported as +05:00.',
    fix: 'Compute the offset directly in std::chrono::seconds.',
  },
  'ng-log/ng-log#48': {
    kind: 'Correctness',
    problem:
      'An oversized --max_log_size was collapsed to the 1 MB minimum: the opposite of what the user asked for.',
    fix: 'Cap oversized values at 4095 MB, the largest that still fits after the MB-to-bytes shift, and keep the 0 → 1 override.',
  },
  'ng-log/ng-log#52': {
    kind: 'Undefined behaviour',
    problem:
      'A test helper passed a possibly negative char to isdigit(), which is undefined behaviour, and its strchr() check accepted a string starting with NUL.',
    fix: 'Cast to unsigned char before isdigit() and reject NUL explicitly.',
  },
  'ng-log/ng-log#51': {
    kind: 'Testing',
    problem:
      'A test-utility diagnostic could never fire: std::map::at() threw before the CHECK that should have explained the misuse.',
    fix: 'Look the stream up with find() and CHECK the result with a per-stream message.',
  },
  'ng-log/ng-log#35': {
    kind: 'Correctness',
    problem:
      'With --logtostdout, messages could sit in stdout’s buffer even when buffering was disabled with --logbuflevel=-1.',
    fix: 'Flush stdout under the same severity condition that file logging uses.',
  },
  'ng-log/ng-log#61': {
    kind: 'Correctness',
    problem:
      'The internal Itanium demangler rejected three constructs that GCC and Clang emit, so the affected frames appeared mangled in failure stack traces.',
    fix: 'Accept the C4/C5/D4/D5 structor variants, an omitted default-argument parameter number, and std-qualified unresolved types.',
  },

  // google/benchmark
  'google/benchmark#2265': {
    kind: 'Memory safety',
    problem:
      'CreateDefaultDisplayReporter() cached an owning pointer in a function-local static, so a second run was handed a dangling reporter: a heap use-after-free.',
    fix: 'Return std::unique_ptr and drop the static. Every call gets a fresh reporter, and the bug can no longer be expressed in the type.',
  },
  'google/benchmark#2245': {
    kind: 'Correctness',
    problem:
      '--benchmark_list_tests ignored --benchmark_format and always printed plain names, which made the list awkward for tooling to consume.',
    fix: 'Add a virtual BenchmarkReporter::List() with JSON and CSV implementations; console output is unchanged.',
  },
  'google/benchmark#2276': {
    kind: 'Correctness',
    problem:
      'The MemoryManager window opened before setup and closed after teardown, so fixture allocations were counted against the benchmark.',
    fix: 'Bracket only the measured run, the region the timers already cover, and add a regression test.',
  },
  'google/benchmark#2264': {
    kind: 'Undefined behaviour',
    problem:
      'A cache-line static_assert used offsetof() on a non-standard-layout type, which is undefined behaviour and breaks -Werror builds on newer Clang.',
    fix: 'Replace it with a well-defined runtime check and remove the warning-suppression pragmas.',
  },
  'google/benchmark#2275': {
    kind: 'Concurrency',
    problem:
      'The thread-safety annotations in mutex.h were never enabled, so builds with -Wthread-safety (Bazel on macOS, for example) failed under -Werror.',
    fix: 'Enable them whenever the compiler supports the capability attribute.',
  },
  'google/benchmark#2274': {
    kind: 'Correctness',
    problem:
      'In release builds, calling PauseTiming() or ResumeTiming() outside the benchmark loop added an absolute clock reading to every run’s time.',
    fix: 'Report the misuse as a benchmark error in every build configuration instead.',
  },

  // D2MOO
  'ThePhrozenKeep/D2MOO#228': {
    kind: 'Correctness',
    problem:
      'In ACT1Q2_Callback03_ChangedLevel, a second state check could never trigger, because the first branch had already updated the state.',
    fix: 'Capture the comparison in a local before the state changes, matching the original game.',
  },
  'ThePhrozenKeep/D2MOO#234': {
    kind: 'Build & CI',
    problem: 'CI had been failing since the VS 2026 runner image broke the clang-tidy setup.',
    fix: 'Fix the chain of CI failures one step at a time, starting with a .clang-tidy key the new version rejects.',
  },
  'ThePhrozenKeep/D2MOO#232': {
    kind: 'Correctness',
    problem: 'Quest log flags were OR’d in, while the original game writes the low byte outright.',
    fix: 'Mask and set the low byte, matching the original’s byte-wide write.',
  },
  'ThePhrozenKeep/D2MOO#238': {
    kind: 'Correctness',
    problem:
      'PLRSAVE2_CheckPlayerFlags masked after shifting, so character progression always read as 0 and the difficulty gates stayed locked.',
    fix: 'Mask first, then shift, as the save code already does elsewhere.',
  },
  'ThePhrozenKeep/D2MOO#236': {
    kind: 'Correctness',
    problem:
      'ACT1Q4_SetMonolithOrder advanced its counter on every roll, so a collision left a monolith without a class.',
    fix: 'Advance only when a stone is placed, matching the original loop.',
  },

  // grafana-pathfinder-app
  'grafana/grafana-pathfinder-app#1687': {
    kind: 'Correctness',
    problem:
      'The App Platform write descriptor never included the validated manifest, so packages authored as learning paths were published as flat guides.',
    fix: 'Project the manifest into spec.manifest, and drop a spec.type field the CRD does not declare.',
  },
  'grafana/grafana-pathfinder-app#1692': {
    kind: 'Correctness',
    problem:
      'A guide opened from inside a learning path never got its alignment prompt, because its starting location was shadowed.',
    fix: 'Read the starting location from the manifests in priority order and use the first declared value.',
  },
  'grafana/grafana-pathfinder-app#1686': {
    kind: 'Correctness',
    problem:
      'Block-editor saves were stamped with schema version 1.0 while the editor emits 1.1.0.',
    fix: 'Fall back to the editor’s current schema version constant.',
  },

  // coverport, MicroPython, PySTAC
  'konflux-ci/coverport#113': {
    kind: 'Testing',
    problem: 'The coverage-jira-tasks URL helpers had no unit tests.',
    fix: 'Add standard-library unittest coverage for the four helpers, including a regression guard, and run it in CI.',
  },
  'micropython/micropython#19709': {
    kind: 'Correctness',
    problem:
      'The SEEED_XIAO_ESP32C5 deploy instructions flashed firmware at offset 0, leaving the bootloader looping on “invalid header”.',
    fix: 'Use 0x2000, the bootloader offset on ESP32-C5 boards.',
  },
  'stac-utils/pystac#1804': {
    kind: 'Correctness',
    problem:
      '_set_property converted only top-level list items, so more deeply nested objects broke JSON serialization.',
    fix: 'Convert every stored value recursively, with a regression test.',
  },
}

export const prKey = (repo: string, number: number) => `${repo}#${number}`

export type KindFilter = PrKind | 'All'

export const prMatches = (repo: string, number: number, filter: KindFilter) =>
  filter === 'All' || prDetails[prKey(repo, number)]?.kind === filter
