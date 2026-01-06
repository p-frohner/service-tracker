import { createTheme } from "@mui/material";
import { lightBlue, purple } from "@mui/material/colors";

export const theme = createTheme({
	palette: {
		primary: lightBlue,
		secondary: purple,
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					fontSize: "1rem",
				},
			},
		},
	},
});
