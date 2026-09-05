# Runtime media

The login screen uses the bundled `launch-poster.png` as its immediate first-frame surface and a remote development video while the app is being assembled. Before release, add the licensed, short, muted ambient `.mp4`, switch `LoginScreen.tsx` to `require()` the bundled video, and keep its first frame visually identical to this poster and the native launch-screen handoff.
