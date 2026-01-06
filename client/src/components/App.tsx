import {
	Box,
	Container,
	CssBaseline,
	Divider,
	ThemeProvider,
} from "@mui/material";

import { ErrorBoundary } from "react-error-boundary";

import logo from "/logo.png";

import { theme } from "../themeProvider";
import { VehicleManager } from "./VehicleManager";

export const App = () => {
	return (
		<ErrorBoundary
			FallbackComponent={({ error }) => <pre>{error.message}</pre>}
		>
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
							<VehicleManager />
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
		</ErrorBoundary>
	);
};

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
