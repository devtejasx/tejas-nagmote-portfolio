// One-line problem and fix for each merged PR, paraphrased from the PR's own
// description on GitHub. Keys are "<owner>/<repo>#<number>".

export type PrKind =
  | 'Concurrency'
  | 'Memory safety'
  | 'Undefined behaviour'
  | 'Correctness'
  | 'Build & CI'
  | 'Testing'
  | 'Feature'
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
  'ng-log/ng-log#63': {
    kind: 'Correctness',
    problem:
      'Both stack dumps, from LOG(FATAL) and from the failure signal handler, stopped at 32 frames without saying so, so a deep trace looked complete while its outer frames were missing.',
    fix: 'Capture one frame more than is printed and, when it exists, end the trace with an “omitted” marker, written async-signal-safely in the signal handler.',
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
  'google/benchmark#2291': {
    kind: 'Correctness',
    problem:
      'DoNotOptimize bound its argument as an asm output operand, so GCC and Clang both refused to compile it for a type with a const data member.',
    fix: 'Add a small trait that routes non-writable types to an asm input operand, keeping the memory clobber so the optimisation barrier is unchanged.',
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
  'ThePhrozenKeep/D2MOO#237': {
    kind: 'Correctness',
    problem:
      'Offset 0x20 of D2GameStrc was typed as a bare uint32_t, although every callback that touches it takes a D2ClientInfoStrc** — one of them was declared with the wrong pointer type.',
    fix: 'Type the slot as D2ClientInfoStrc*, align the odd callback with its four siblings and rename the creator to FnCreateClientInfo. The 32-bit layout is unchanged.',
  },
  'ThePhrozenKeep/D2MOO#239': {
    kind: 'Correctness',
    problem:
      'Both item ids in the “put a scroll into a book” packet come from the client; on a scroll/book mismatch the server asserted and called exit(-1), so one bad packet took the whole game server down.',
    fix: 'Reject the mismatch like the function’s other invalid-input cases, returning an error to the packet handler. The original behaviour stays behind NO_BUG_FIX.',
  },
  'ThePhrozenKeep/D2MOO#240': {
    kind: 'Memory safety',
    problem:
      'The debugger’s UTF-8 name buffer was sized at exactly 3 bytes per character: one-character names came back empty, CJK names lost their last character, and an empty string wrote a terminator through a null pointer. The unit spawner also had no way to pick a row by id.',
    fix: 'Give the buffer 3 spare bytes so it is never empty, and add “<id>: <name>” labels plus a clamped id input to the monster spawners.',
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
  'grafana/grafana-pathfinder-app#1995': {
    kind: 'Testing',
    problem:
      'Three minimizedSidebar test ids were left behind after the component that used them was deleted.',
    fix: 'Remove the dead constants after confirming nothing on main still references them.',
  },
  'grafana/grafana-pathfinder-app#2054': {
    kind: 'Correctness',
    problem:
      'Path progress filtered each candidate storage key on its own, so a long bundled id kept one key shape and lost the other; a record stored under the dropped shape was never found and scored 0%, dragging down the path’s average.',
    fix: 'Make the check all-or-nothing: a member whose keys would be rewritten resolves as unresolved and is left out of the mean, with tests through both the id and url branches.',
  },
  'grafana/grafana-pathfinder-app#2081': {
    kind: 'Correctness',
    problem:
      'Where navigator.clipboard is undefined, such as plain-HTTP origins, writeText threw synchronously, so the chained error handling never ran and copy buttons silently did nothing.',
    fix: 'Route every copy through one helper that reports success or failure, falls back to execCommand inside focus-trapped modals, and is guarded by a test against new direct clipboard calls.',
  },
  'grafana/grafana-pathfinder-app#2268': {
    kind: 'Correctness',
    problem:
      'The element picker cleaned dynamic attributes after its uniqueness check, so a saved selector could stop matching the element that was picked.',
    fix: 'Re-check the selector after cleaning and keep the uncleaned one if it is no longer unique; the hover preview now shows the selector a click would record.',
  },

  // coverport, MicroPython, PySTAC
  'fullsend-ai/coverport#113': {
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
  'stac-utils/pystac#1805': {
    kind: 'Feature',
    problem:
      'application/octet-stream and application/zip show up often in asset and link metadata, but MediaType had no constants for them, so users wrote the strings by hand.',
    fix: 'Add MediaType.OCTET_STREAM and MediaType.ZIP, with a test that an asset built with ZIP serializes to "application/zip".',
  },
  // kornia
  'kornia/kornia#4839': {
    kind: 'Correctness',
    problem:
      'PlanckianJitter truncates a Uniform(0, N) draw to a table index. In float16/bfloat16 on MPS, torch.rand can return exactly 1.0, which truncates to N, one past the end, so RandomPlanckianJitter intermittently raised an out-of-bounds error.',
    fix: 'Draw the index in float32 whenever the augmentation runs in half precision; float32/float64 draws are unchanged.',
  },
  'kornia/kornia#5473': {
    kind: 'Correctness',
    problem:
      'A shape-changing augmentation such as RandomCrop given a batch_prob mixing applied and skipped rows silently transformed every row, so skipped rows’ labels stopped matching their pixels and inverse() failed with a shape mismatch.',
    fix: 'Raise a ValueError on that path in forward, inverse and the augmentation audit, keeping whole-batch gates and shape-preserving augmentations unchanged. A deliberate breaking change, with tests in float32 and float64.',
  },
}

export const prKey = (repo: string, number: number) => `${repo}#${number}`

export type KindFilter = PrKind | 'All'

export const prMatches = (repo: string, number: number, filter: KindFilter) =>
  filter === 'All' || prDetails[prKey(repo, number)]?.kind === filter
