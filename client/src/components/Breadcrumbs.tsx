import { Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";

import { Link } from "./Link";

type Props = {
	items: {
		label: string;
		url?: string;
	}[];
};

export const Breadcrumbs = ({ items }: Props) => {
	return (
		<MuiBreadcrumbs aria-label="breadcrumb">
			{items.map((item) =>
				item.url ? (
					<Link key={item.url} underline="hover" to={item.url}>
						{item.label}
					</Link>
				) : (
					<Typography key={item.label} sx={{ color: "text.primary", fontWeight: "bold" }}>
						{item.label}
					</Typography>
				),
			)}
		</MuiBreadcrumbs>
	);
};
