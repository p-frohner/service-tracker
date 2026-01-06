import { createTheme } from "@mui/material";

export const theme = createTheme({
	palette: {
		primary: {
			main: "#2E5BFF",
			contrastText: "#fff",
		},
		secondary: {
			main: "#5D1029",
		},
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiButton: {
			defaultProps: {
				color: "primary",
			},
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 600,
					borderRadius: 10,
				},
			},
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: {
					fontWeight: 600,
					fontSize: "1.5rem",
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				InputLabelProps: { shrink: true },
				variant: "outlined",
				size: "small",
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					position: "relative",
					transform: "none",
					marginBottom: "8px",
					fontSize: "0.875rem",
					fontWeight: 600,
					color: "#333",
					textTransform: "uppercase",
					"&.Mui-focused": {
						color: "primary", // Your Cobalt Blue
					},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					"& legend": { display: "none" },
				},
			},
		},
	},
});
