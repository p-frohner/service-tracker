import { createTheme } from "@mui/material";

export const theme = createTheme({
	palette: {
		primary: {
			main: "#5287d1",
			contrastText: "#fff",
		},
		secondary: {
			main: "#5D1029",
		},
	},
	components: {
		MuiBackdrop: {
			styleOverrides: {
				root: {
					backdropFilter: "blur(8px)",
					backgroundColor: "rgba(0, 0, 0, 0.4)",
				},
			},
		},
		MuiBreadcrumbs: {
			defaultProps: {
				separator: "🚘",
			},
		},
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
		MuiDialog: {
			styleOverrides: {
				paper: {
					borderRadius: 10,
				},
			},
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: {
					textAlign: "center",
					fontWeight: 600,
					fontSize: "1.5rem",
					padding: 24,
				},
			},
		},
		MuiLink: {
			defaultProps: {
				underline: "hover",
				color: "primary",
			},
			styleOverrides: {
				root: {
					fontWeight: 600,
					fontSize: "1.2rem",
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
					"& .MuiOutlinedInput-notchedOutline": { top: "0" },
				},
			},
		},
	},
});
