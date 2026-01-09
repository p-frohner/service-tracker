import { Box, Container, CssBaseline, Divider, GlobalStyles, ThemeProvider } from "@mui/material";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import logo from "/logo.png";
import { theme } from "../themeProvider";

export const Route = createRootRoute({
	component: () => {
		return (
			<ErrorBoundary FallbackComponent={({ error }) => <pre>{error.message}</pre>}>
				<CssBaseline />
				<ThemeProvider theme={theme}>
					<GlobalStyles
						styles={{
							"::view-transition-old(main-content)": {
								animation: "250ms ease-out both fade-out, 250ms ease-out both blur-out",
							},
							"::view-transition-new(main-content)": {
								animation: "300ms ease-in both fade-in, 300ms ease-in both blur-in",
							},
							"@keyframes blur-in": { from: { filter: "blur(10px)" }, to: { filter: "blur(0)" } },
							"@keyframes blur-out": { to: { filter: "blur(10px)" } },

							"@keyframes fade-in": { from: { opacity: 0 } },
							"@keyframes fade-out": { to: { opacity: 0 } },
						}}
					/>
					<Container maxWidth="lg">
						<Box marginTop={2}>
							<Box textAlign="center">
								<Logo />
							</Box>
							<Divider
								sx={{
									height: 8,
									borderBottom: "none",
									backgroundColor: "primary.dark",
								}}
							/>
							<Box sx={{ backgroundColor: "primary.paper", viewTransitionName: "main-content" }}>
								<Outlet />
							</Box>
						</Box>
					</Container>
				</ThemeProvider>
			</ErrorBoundary>
		);
	},
});

const Logo = () => (
	<Box
		component="img"
		height={72}
		src={logo}
		margin={1}
		sx={{
			objectFit: { xs: "none", md: "fill" },
			objectPosition: { xs: "right", md: "center" },
			width: { xs: 110, md: 558 },
		}}
	/>
);
