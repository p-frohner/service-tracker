import { Box, Container, CssBaseline, Divider, ThemeProvider } from "@mui/material";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { ErrorBoundary } from "react-error-boundary";

import logo from "/logo.png";
import { theme } from "../themeProvider";

export const Route = createRootRoute({
	component: () => (
		<ErrorBoundary FallbackComponent={({ error }) => <pre>{error.message}</pre>}>
			<CssBaseline />
			<ThemeProvider theme={theme}>
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
						<Box sx={{ backgroundColor: "primary.paper" }}>
							<Outlet />
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
		</ErrorBoundary>
	),
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
