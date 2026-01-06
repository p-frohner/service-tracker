import { Box, Container, CssBaseline, Divider, Stack, ThemeProvider } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import logo from "/logo.png";
import { theme } from "./themeProvider";

export const App = () => {
	return (
		<ErrorBoundary FallbackComponent={({ error }) => <pre>{error.message}</pre>}>
			<CssBaseline />
			<ThemeProvider theme={theme}>
				<Container maxWidth="lg">
					<Content />
				</Container>
			</ThemeProvider>
		</ErrorBoundary>
	);
};

const Content = () => {
	return (
		<Box
			borderRadius={10}
			borderColor="primary.dark"
			height="calc(100vh - 64px)"
			marginTop={4}
			sx={{ borderWidth: 4, borderStyle: "solid" }}
		>
			<Box textAlign="center">
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
			</Box>

			<Divider sx={{ height: 4, borderBottom: "none", backgroundColor: "primary.dark" }} />
			<Stack direction="row" spacing={2} padding={4}>
				<Box>Item 1</Box>
				<Box>Item 2</Box>
			</Stack>
		</Box>
	);
};
