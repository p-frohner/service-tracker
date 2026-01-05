import { Box, Container } from "@mui/material";
import logo from "/logo.png";

export const App = () => {
	return (
		<Container maxWidth="lg">
			<Box
				component="img"
				src={logo}
				sx={{ display: { xs: "block", md: "none", objectFit: "none", objectPosition: "right" } }}
				width={110}
				height={72}
			/>
			<Box
				component="img"
				src={logo}
				sx={{ display: { xs: "none", md: "block", objectFit: "fill", objectPosition: "center" } }}
				width={558}
				height={72}
			/>
		</Container>
	);
};
