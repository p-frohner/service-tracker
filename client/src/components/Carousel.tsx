import { Box, Skeleton, styled } from "@mui/material";
import type { VehicleImage } from "../api";

export const Carousel = ({ images }: { images: VehicleImage[] }) => {
	if (images.length === 0) {
		return (
			<Skeleton
				variant="rectangular"
				width="100%"
				height={300}
				sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}
			>
				Downloading images...
			</Skeleton>
		);
	}
	return (
		<CarouselWrapper>
			<Box className="carousel">
				{images.map((image) => (
					<Box key={image.filename} className="carousel-slide">
						<img src={`${import.meta.env.VITE_API_URL}${image.filename}`} alt="" loading="lazy" />
					</Box>
				))}
			</Box>
		</CarouselWrapper>
	);
};

const CarouselWrapper = styled(Box)(({ theme }) => ({
	position: "relative",
	margin: `${theme.spacing(1.5)} 0`,

	"& .carousel": {
		display: "flex",
		gap: "1rem",
		overflowX: "auto",
		borderRadius: "12px",
		scrollbarWidth: "none",
		scrollSnapType: "x mandatory",
		scrollBehavior: "smooth",
		scrollMarkerGroup: "after",
	},

	"& .carousel::scroll-marker-group": {
		display: "flex",
		justifyContent: "center",
		gap: `${theme.spacing(1)}`,
		position: "absolute",
		bottom: `${theme.spacing(2)}`,
		left: "50%",
		transform: "translateX(-50%)",
	},

	"& .carousel-slide": {
		flex: "0 0 100%",
		scrollSnapAlign: "center",
		containerType: "scroll-state",
		containerName: "slide",

		"& img": {
			width: "100%",
			height: "300px",
			objectFit: "cover",
			borderRadius: "8px",
			display: "block",
			transition: "all 0.3s ease",
			opacity: "0.5",
			scale: "0.75",
		},
	},

	"@container slide scroll-state(snapped: x)": {
		".carousel-slide img": {
			opacity: "1",
			scale: "1",
		},
	},

	".carousel-slide::scroll-marker": {
		content: '""',
		width: "15px",
		height: "15px",
		background: theme.palette.background.paper,
		border: `1px solid ${theme.palette.primary.dark}`,
		borderRadius: "50%",
		cursor: "pointer",
		transition: "all 0.2s",

		"&:hover": {
			background: theme.palette.primary.light,
		},
		"&:target-current": {
			background: theme.palette.primary.main,
			transform: "scale(1.3)",
			border: `1px solid ${theme.palette.primary.dark}`,
		},
	},

	".carousel::scroll-button(*)": {
		border: "none",
		background: "white",
		fontSize: "1.25rem",
		width: "40px",
		height: "40px",
		borderRadius: "50%",
		cursor: "pointer",
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
		transition: "all 0.2s",
		position: "absolute",
		top: "50%",
		transform: "translateY(-50%)",
		zIndex: "10",

		"&:hover:not(:disabled)": {
			background: theme.palette.primary.light,
			color: theme.palette.primary.contrastText,
		},
		"&:hover:disabled": {
			opacity: "0.3",
			cursor: "not-allowed",
		},
	},

	".carousel::scroll-button(left)": {
		content: '"⇽"',
		left: "1.5rem",
	},

	".carousel::scroll-button(right)": {
		content: '"⇾"',
		right: "1.5rem",
	},
}));
