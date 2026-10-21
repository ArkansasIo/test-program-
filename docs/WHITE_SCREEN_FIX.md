# Railway UI White-Screen Troubleshooting

If the Railway Operations UI renders a blank screen:

1. Open browser developer tools and inspect the console.
2. Verify the Vite bundle loads without 404 errors.
3. Verify `src/index.css` imports the required railway styles.
4. Check that `railwayModules.ts` resolves the selected module/page IDs.
5. Check React error boundaries and route selection.
6. Verify API failures are rendered as status/error states rather than throwing during initial render.
7. Confirm that stale or missing operational data does not block the page shell.
8. Run `npm run build` to identify TypeScript/module errors.

The railway shell should remain visible even when the API is unavailable.
